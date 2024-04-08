/* eslint-disable @angular-eslint/component-selector */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Article } from '@lib/interfaces/article';

import { ArtifactService } from '@lib/services/artifacts/artifacts.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'artifact',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './artifact.component.html',
})
export class ArtifactComponent implements OnInit {
    artifact$!: Observable<Article>;
    constructor(protected artifactService: ArtifactService) {}
    ngOnInit(): void {
        this.artifact$ = this.artifactService.getArtifactsById('a3b9c8d7e6f5a4b3c2d1e0f');
    }
}
