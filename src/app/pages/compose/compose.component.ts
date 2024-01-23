/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/require-await */
import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Article } from '@lib/interfaces/article';
import { ArtifactService } from '@lib/services/artifacts/artifacts.service';
import { Observable, debounceTime, skip } from 'rxjs';

import { editorjsConfig, toolsConfig } from '@lib/editor/editor.config';
import EditorJS from '@editorjs/editorjs';
import { ThemeService } from '@lib/services';

@Component({
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './compose.component.html',
})
export class ComposeComponent implements OnInit, OnDestroy {
    public artifact$!: Observable<Article>;
    public localCached!: Article;
    public editor!: EditorJS;
    public editorObserver!: MutationObserver;

    constructor(
        protected artifactService: ArtifactService,
        private _router: ActivatedRoute,
        private themeService: ThemeService,
    ) {}

    ngOnInit(): void {
        this.themeService.setNavbarState(false);
        this.detectEditorChanges()
            .pipe(debounceTime(200), skip(1))
            .subscribe({
                next: () => {
                    this.editor.save().then(async (outputData) => {
                        JSON.stringify(outputData, null, 2);
                        Object.create(<Article>{});
                        // console.log(this.editorData)
                        /* put draft creation logic here */
                    });
                },
            });

        const IdFromUrl = this._router.snapshot.queryParams['page'] as string;
        if (IdFromUrl) {
            this.buildEditorWithBlocks(IdFromUrl);
        } else {
            this.buildEditorWithoutBlocks();
        }
    }

    postDataBlock!: Article;
    public buildEditorWithBlocks(_artifactId: string): void {
        this.artifactService.getArtifactsById(_artifactId).subscribe((article) => {
            this.postDataBlock = article;
            this.editor = new EditorJS({
                holder: 'editorjs',
                autofocus: false,
                readOnly: false,
                placeholder: 'Share your story ... ',
                tools: toolsConfig,
                data: article,
            });

            // this.editorForm.get('headline')?.patchValue(article.highlight.header);
        });
    }

    @ViewChild('editorjs')
    div!: ElementRef<HTMLInputElement>;

    detectEditorChanges(): Observable<unknown> {
        return new Observable((observer) => {
            const editorDom = <Element>document.querySelector('#editorjs');
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

    ngOnDestroy(): void {
        this.themeService.setNavbarState(true);
    }
}
