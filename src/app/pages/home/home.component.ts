import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Artifact } from '@lib/interfaces/artifact';
import { ArtifactService } from '@lib/services/artifacts/artifacts.service';
import { AppTheme, ThemeService } from '@lib/services/theme';
import { Subject, takeUntil } from 'rxjs';

@Component({
    standalone: true,
    imports: [CommonModule, RouterModule],
    providers: [ArtifactService],
    templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
    currentTheme!: AppTheme | null;

    private readonly _themeService = inject(ThemeService);
    private readonly _destroy$ = new Subject();
    public artifacts!: Artifact[];

    public date!: Date;
    monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

    constructor(public artifactService: ArtifactService, protected router: Router) {}

    ngOnInit(): void {
        this.date = new Date();
        this._themeService.currentTheme$
            .pipe(takeUntil(this._destroy$))
            .subscribe((theme) => (this.currentTheme = theme));

        this.getArtifacts();
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

    getArtifacts(): void {
        this.artifactService.getArtifacts().subscribe((response) => {
            this.artifacts = response;
        });
    }

    public onBtnActionClicked(id: string): void {
        const NAV_URL = '/artifact';
        this.router.navigate([NAV_URL], { queryParams: { page: id } });
    }
}
