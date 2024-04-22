import { DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router, RouterModule } from '@angular/router';
import { LoadingComponent } from '@lib/components/loading/loading.component';
import { Artifact } from '@lib/interfaces/artifact';

import { ArtifactService } from '@lib/services/artifacts/artifacts.service';
import { AppTheme, ThemeService } from '@lib/services/theme';
import { Subject, takeUntil, delay, Observable, map } from 'rxjs';

@Component({
    standalone: true,
    imports: [CommonModule, RouterModule, LoadingComponent],
    providers: [ArtifactService],
    templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
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
                        fact.loading.close();
                    }),
                )
                .subscribe();
        });
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

    public onBtnActionClicked(id: string): void {
        const NAV_URL = '/artifact';
        this.router.navigate([NAV_URL], { queryParams: { page: id } });
    }
}
