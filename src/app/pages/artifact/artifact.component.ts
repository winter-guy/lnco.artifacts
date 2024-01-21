/* eslint-disable @angular-eslint/component-selector */
import { Component, OnInit } from '@angular/core';
import { ArtifactService } from '@lib/services/artifacts/artifacts.service';

@Component({
    selector: 'artifact',
    standalone: true,
    imports: [],
    templateUrl: './artifact.component.html',
})
export class ArtifactComponent implements OnInit {
    constructor(protected artifactService: ArtifactService) {}
    ngOnInit(): void {
        this.artifactService.getArtifactsById('a3b9c8d7e6f5a4b3c2d1e0f').subscribe((res) => {
            console.log(res);
        });
    }
}
