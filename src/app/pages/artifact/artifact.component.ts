/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @angular-eslint/component-selector */
import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Article } from '@lib/interfaces/article';

import { ArtifactService } from '@lib/services/artifacts/artifacts.service';

import { toolsConfig } from '@lib/editor/editor.config';
import EditorJS from '@editorjs/editorjs';
import { ActivatedRoute } from '@angular/router';

@Component({
    standalone: true,
    imports: [CommonModule],
    templateUrl: './artifact.component.html',
})
export class ArtifactComponent implements OnInit {
    public post!: Article | undefined;
    public editor!: EditorJS;

    constructor(protected artifactService: ArtifactService, private _router: ActivatedRoute) {}

    ngOnInit(): void {
        const url = this._router.snapshot.queryParams['page'] as string;

        this.artifactService.getArtifactsById(url).subscribe((res) => {
            if (res) {
                this.post = res;
                this.editor = new EditorJS({
                    holder: 'editorjs',
                    autofocus: false,
                    readOnly: true,
                    tools: toolsConfig,
                    data: res,
                });
            }
        });
    }

    @ViewChild('editorjs')
    div!: ElementRef<HTMLInputElement>;
}
