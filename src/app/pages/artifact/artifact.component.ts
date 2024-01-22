/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @angular-eslint/component-selector */
import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Article } from '@lib/interfaces/article';

import { ArtifactService } from '@lib/services/artifacts/artifacts.service';
import { Observable } from 'rxjs';

import { editorjsConfig, toolsConfig } from '@lib/editor/editor.config';
import EditorJS from '@editorjs/editorjs';
import { ActivatedRoute } from '@angular/router';

@Component({
    standalone: true,
    imports: [CommonModule],
    templateUrl: './artifact.component.html',
})
export class ArtifactComponent implements OnInit {
    public artifact$!: Observable<Article>;
    public localCached!: Article;
    public editor!: EditorJS;
    public editorObserver!: MutationObserver;
    constructor(protected artifactService: ArtifactService, private _router: ActivatedRoute) {}

    ngOnInit(): void {
        const url = this._router.snapshot.queryParams['page'] as string;
        this.artifact$ = this.artifactService.getArtifactsById(url);

        this.artifactService.getArtifactsById(url).subscribe((res) => {
            if (res) {
                this.localCached = res;
                this.editor = new EditorJS({
                    holder: 'editorjs',
                    autofocus: false,
                    readOnly: true,
                    tools: toolsConfig,
                    data: res,
                });
            }
        });

        this.detectEditorChanges();
    }

    @ViewChild('editorjs')
    div!: ElementRef<HTMLInputElement>;

    detectEditorChanges(): Observable<unknown> {
        return new Observable((observer) => {
            const editorDom = <Element>document.querySelector('#editorjs');
            console.log(editorDom);
            const config = { attributes: true, childList: true, subtree: true };
            this.editorObserver = new MutationObserver((mutation) => {
                observer.next(mutation);
            });

            this.editorObserver.observe(editorDom, config);
        });
    }

    public buildEditorWithoutBlocks(): void {
        this.editor = new EditorJS(editorjsConfig);
    }
}
