import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { CdkMenuModule } from '@angular/cdk/menu';
import { AuthService } from '@auth0/auth0-angular';

import { Observable, Subject, takeUntil } from 'rxjs';

import { ThemeService } from '@lib/services';
import { AppTheme } from '@lib/services/theme';
import { needConfirmation } from '@lib/content/dialog.directive';
import { LogoComponent } from '../logo/logo.component';
@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterModule, LogoComponent, CdkMenuModule],
    templateUrl: './navbar.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit, OnDestroy {
    public currentTheme!: AppTheme | null;
    private readonly _destroy$ = new Subject();

    $navbarState!: Observable<boolean>;

    constructor(
        public router: Router,
        public themeService: ThemeService,
        public auth: AuthService,
        @Inject(DOCUMENT) private _doc: Document,
    ) {}

    ngOnInit(): void {
        this.themeService.currentTheme$
            .pipe(takeUntil(this._destroy$))
            .subscribe((theme) => (this.currentTheme = theme));

        this.$navbarState = this.themeService.navState;
    }

    ngOnDestroy(): void {
        this._destroy$.complete();
        this._destroy$.unsubscribe();
    }

    handleThemeChange(theme: AppTheme): void {
        this.themeService.setTheme(theme);
    }

    public onBtnActionClicked(id?: string): void {
        const NAV_URL = '/compose';
        this.router.navigate([NAV_URL], { queryParams: { page: id } });
    }

    public loginWithRedirect(): void {
        this.auth.loginWithRedirect();
    }

    @needConfirmation({
        message: `Are you sure you want to log out?`,
        description: `Logging out will terminate your current session and require you to 
                        sign in again to access your account and modify artifacts. `,
        label: 'sign out',
        disableCloseBtn: true,
    })
    public logout(): void {
        this.auth.logout({ logoutParams: { returnTo: this._doc.location.origin } });
    }
}
