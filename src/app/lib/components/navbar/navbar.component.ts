import {
    ChangeDetectionStrategy,
    Component,
    ComponentFactoryResolver,
    EventEmitter,
    Inject,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '@auth0/auth0-angular';

import { Observable, Subject, takeUntil } from 'rxjs';

import { ThemeService } from '@lib/services';
import { AppTheme } from '@lib/services/theme';
import { LogoComponent } from '../logo/logo.component';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterModule, LogoComponent, MatDatepickerModule, MatButtonModule, MatTabsModule],
    templateUrl: './navbar.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit, OnDestroy {
    public currentTheme!: AppTheme | null;
    private readonly _destroy$ = new Subject();
    public inSearch = false;

    $navbarState!: Observable<boolean>;
    @Output() drawer = new EventEmitter<boolean>();

    constructor(
        public router: Router,
        public themeService: ThemeService,
        public auth: AuthService,
        @Inject(DOCUMENT) private _doc: Document,

        private _componentFactoryResolver: ComponentFactoryResolver,
    ) {}

    ngOnInit(): void {
        this.themeService.currentTheme$
            .pipe(takeUntil(this._destroy$))
            .subscribe((theme) => (this.currentTheme = theme));

        this.$navbarState = this.themeService.navState;
    }

    toggleSearch(): void {
        this.inSearch = !this.inSearch;
    }

    // openSearch(): void {
    //     this.toggleDynamicComponent();
    // }

    // @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;
    // dynamicComponentRef: unknown;
    // public toggleDynamicComponent(): void {
    //     if (this.dynamicComponentRef) {
    //         // If dynamic component is already added, remove it
    //         this.dynamicComponentContainer.clear();
    //         this.dynamicComponentRef = null;
    //     } else {
    //         // Create an instance of the dynamic component
    //         const componentFactory = this._componentFactoryResolver.resolveComponentFactory(FooterComponent);
    //         this.dynamicComponentRef = this.dynamicComponentContainer.createComponent(componentFactory);
    //         // You can pass inputs to the component
    //         // this.dynamicComponentRef.instance.inputProperty = value;
    //     }

    //     this.toggleSearch();
    // }

    ngOnDestroy(): void {
        this._destroy$.complete();
        this._destroy$.unsubscribe();
    }

    public handleThemeChange(): void {
        const themes = ['light', 'dark'];
        const currentIndex = themes.indexOf(this.themeService.currentTheme ?? 'light');
        this.themeService.setTheme(themes[(currentIndex + 1) % themes.length] as AppTheme);
    }

    public onBtnActionClicked(id?: string): void {
        const NAV_URL = '/compose';
        this.router.navigate([NAV_URL], { queryParams: { page: id } });
    }

    public loginWithRedirect(): void {
        this.auth.loginWithRedirect();
    }

    public tabClick(event: MatTabChangeEvent): void {
        console.log(event.tab.textLabel);
    }

    public openDrawer(): void {
        this.drawer.emit(true);
    }
}
