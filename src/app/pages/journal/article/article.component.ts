import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ArtifactService } from '@lib/services/artifacts/artifacts.service';

@Component({
    standalone: true,
    imports: [CommonModule],
    templateUrl: './article.component.html',
})
export class ArticleComponent {
    @Input() username!: string;

    constructor(public readonly artifactSrvc: ArtifactService, protected router: Router) {}

    public journal$ = this.artifactSrvc.getJournalForSignedInUser();
    public onBtnActionClicked(id: string): void {
        const NAV_URL = '/journal/edit';
        console.log(id);
        this.router.navigate([NAV_URL], { queryParams: { page: id } });
    }
}
