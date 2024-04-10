/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CommonModule, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthyService as AuthTemp, ThemeService } from '@lib/services';
import { LogoComponent } from '../logo/logo.component';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AppTheme } from '@lib/services/theme';
import { AuthService } from '@auth0/auth0-angular';
import { needConfirmation } from '@lib/content/dialog.directive';
import { CdkMenuModule } from '@angular/cdk/menu';

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
        public _router: Router,
        public _authService: AuthTemp,
        public _themeService: ThemeService,
        public auth: AuthService,
        @Inject(DOCUMENT) private doc: Document,
    ) {}

    ngOnInit(): void {
        this._themeService.currentTheme$
            .pipe(takeUntil(this._destroy$))
            .subscribe((theme) => (this.currentTheme = theme));

        this.$navbarState = this._themeService.navState;
    }

    ngOnDestroy(): void {
        this._destroy$.complete();
        this._destroy$.unsubscribe();
    }

    navigateToProfile(): unknown {
        return this._router.navigate(['/journal']);
    }

    handleThemeChange(theme: AppTheme): void {
        this._themeService.setTheme(theme);
    }

    onClickSignOut(): void {
        this._authService.logout();
        this._router.navigate(['/auth/login']);
    }

    public onBtnActionClicked(id?: string): void {
        const NAV_URL = '/compose';
        this._router.navigate([NAV_URL], { queryParams: { page: id } });
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
        this.auth.logout({ logoutParams: { returnTo: this.doc.location.origin } });
    }
}
