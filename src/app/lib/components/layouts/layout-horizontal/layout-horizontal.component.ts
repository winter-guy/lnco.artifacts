import { CommonModule, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '@lib/components';

import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { needConfirmation } from '@lib/content/dialog.directive';
import { RouterLinkClickDirective } from '@lib/content/router-link-click.directive';
@Component({
    selector: 'app-layout-horizontal',
    standalone: true,
    imports: [CommonModule, NavbarComponent, MatSidenavModule, RouterModule, RouterLinkClickDirective],
    templateUrl: './layout-horizontal.component.html',
    styleUrls: ['./layout.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutHorizontalComponent implements OnInit {
    showFiller = false;
    windowWidth!: number;
    windowHeight!: number;
    showMore = false;
    @ViewChild('drawer') drawer!: MatDrawer;


    ngOnInit(): void {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.drawer.close();
            }
        });
    }

    constructor(public auth: AuthService, @Inject(DOCUMENT) private _doc: Document, public router: Router) {
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
