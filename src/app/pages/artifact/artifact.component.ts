import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Article } from '@lib/interfaces/article';
import { ArtifactService } from '@lib/services/artifacts/artifacts.service';

import EditorJS from '@editorjs/editorjs';
import { toolsConfig } from '@lib/editor/editor.config';

@Component({
    standalone: true,
    imports: [CommonModule],
    templateUrl: './artifact.component.html',
})
export class ArtifactComponent implements OnInit {
    public post!: Article | undefined;
    public editor!: EditorJS;

    constructor(protected artifactService: ArtifactService, private _route: ActivatedRoute, private _router: Router) {}

    ngOnInit(): void {
        const url = this._route.snapshot.queryParams['page'] as string;

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

    public onBtnActionClicked(id: string): void {
        const NAV_URL = '/compose';
        this._router.navigate([NAV_URL], { queryParams: { page: id } });
    }
}
