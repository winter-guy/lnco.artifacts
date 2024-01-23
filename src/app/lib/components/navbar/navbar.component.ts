/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService, ThemeService } from '@lib/services';
import { LogoComponent } from '../logo/logo.component';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AppTheme } from '@lib/services/theme';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterModule, LogoComponent],
    templateUrl: './navbar.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit, OnDestroy {
    public currentTheme!: AppTheme | null;
    private readonly _destroy$ = new Subject();

    $navbarState!: Observable<boolean>;

    constructor(public _router: Router, public _authService: AuthService, public _themeService: ThemeService) {}

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
}
