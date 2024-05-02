import { DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import {
    Component,
    ComponentFactoryResolver,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewContainerRef,
    inject,
} from '@angular/core';
import { Router, ActivatedRoute, Data, RouterModule } from '@angular/router';
import { LoadingComponent } from '@lib/components/loading/loading.component';
import { MapComponent } from '@lib/components/map/map.component';
import { Artifact } from '@lib/interfaces/artifact';
import { ThemeService } from '@lib/services';
import { ArtifactService } from '@lib/services/artifacts/artifacts.service';
import { AppTheme } from '@lib/services/theme';
import { Subject, Observable, takeUntil, delay, map } from 'rxjs';

import { MatPaginatorModule } from '@angular/material/paginator';
import { CarouselComponent } from '@lib/components/carousel/carousel.component';

@Component({
    selector: 'app-lnco',
    standalone: true,
    imports: [CommonModule, RouterModule, LoadingComponent, MatPaginatorModule, CarouselComponent],
    providers: [ArtifactService],
    templateUrl: './lnco.component.html',
    styleUrl: './lnco.component.css',
})
export class LncoComponent implements OnInit, OnDestroy {
    currentTheme!: AppTheme | null;
    private readonly _themeService = inject(ThemeService);
    private readonly _destroy$ = new Subject();

    public artifacts$!: Observable<Artifact[]>;

    public date!: Date;
    monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

    constructor(
        public artifactSrvc: ArtifactService,
        protected readonly router: Router,
        private readonly _route: ActivatedRoute,

        private _componentFactoryResolver: ComponentFactoryResolver,
    ) {}

    ngOnInit(): void {
        this.date = new Date();
        this._themeService.currentTheme$
            .pipe(takeUntil(this._destroy$))
            .subscribe((theme) => (this.currentTheme = theme));

        this._route.data.subscribe(({ data }: Data) => {
            const fact = data as { record: Observable<Artifact[]>; loading: DialogRef<unknown, LoadingComponent> };
            this.artifacts$ = fact.record;
            // do something with your resolved data ...
            fact.record
                .pipe(
                    delay(1000),
                    map(() => {
                        // fact.loading.close();
                    }),
                )
                .subscribe();
        });
    }

    @ViewChild('mapComponentContainer', { read: ViewContainerRef }) mapComponentContainer!: ViewContainerRef;
    dynamicComponentRef: unknown;
    public toggleDynamicComponent(): void {
        if (this.dynamicComponentRef) {
            // If dynamic component is already added, remove it
            this.mapComponentContainer.clear();
            this.dynamicComponentRef = null;
        } else {
            // Create an instance of the dynamic component
            const componentFactory = this._componentFactoryResolver.resolveComponentFactory(MapComponent);
            this.dynamicComponentRef = this.mapComponentContainer.createComponent(componentFactory);

            // You can pass inputs to the component
            // this.dynamicComponentRef.instance.inputProperty = value;
        }
    }

    ngOnDestroy(): void {
        this._destroy$.complete();
        this._destroy$.unsubscribe();
    }

    handleThemeChange(theme: AppTheme): void {
        this._themeService.setTheme(theme);
    }

    get randomNum(): number {
        return Math.floor(Math.random() * 200) + 1;
    }
}
