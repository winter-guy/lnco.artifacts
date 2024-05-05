import { CommonModule, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, Inject } from '@angular/core';
import { NavbarComponent } from '@lib/components';

import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { needConfirmation } from '@lib/content/dialog.directive';
@Component({
    selector: 'app-layout-horizontal',
    standalone: true,
    imports: [CommonModule, NavbarComponent, MatSidenavModule, RouterModule],
    templateUrl: './layout-horizontal.component.html',
    styleUrls: ['./layout.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutHorizontalComponent {
    showFiller = false;
    windowWidth!: number;
    windowHeight!: number;
    showMore = false;

    constructor(public auth: AuthService, @Inject(DOCUMENT) private _doc: Document) {
        this.getWindowSize();
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: Event): void {
        event;
        this.getWindowSize();
    }

    getWindowSize(): void {
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
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
