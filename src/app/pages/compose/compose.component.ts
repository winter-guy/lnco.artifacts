/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/require-await */
import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Article, BlocksEntity } from '@lib/interfaces/article';
import { ArtifactService } from '@lib/services/artifacts/artifacts.service';
import { Observable, debounceTime, skip } from 'rxjs';
import { Dialog, DialogModule } from '@angular/cdk/dialog';

import { editorjsConfig, toolsConfig } from '@lib/editor/editor.config';
import EditorJS from '@editorjs/editorjs';
import { ThemeService } from '@lib/services';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@lib/content/shared.module';
import { PublishComponent } from '@pages/publish/publish.component';
import { Compose } from '@lib/interfaces/compose';
import { ShortenStringPipe } from '@lib/pipe/short.pipe';

@Component({
    standalone: true,
    imports: [CommonModule, RouterModule, ReactiveFormsModule, SharedModule, DialogModule],
    templateUrl: './compose.component.html',
})
export class ComposeComponent implements OnInit, OnDestroy {
    public artifact$!: Observable<Article>;
    public editor!: EditorJS;
    public editorObserver!: MutationObserver;
    public draftHashIdentifier!: string;

    public editorForm!: FormGroup;

    constructor(
        protected artifactService: ArtifactService,
        private _formBuilder: FormBuilder,
        private _router: ActivatedRoute,
        private themeService: ThemeService,
        private cdkDialog: Dialog,
    ) {}

    ngOnInit(): void {
        this.themeService.setNavbarState(false);
        this.editorForm = this._formBuilder.group({
            headline: [
                '',
                {
                    updateOn: 'change',
                },
            ],
            article: [],
        });

        /* overrides theme for composer page, dark theme abstructs view and editing experiance. */
        this.themeService.setTheme('light');

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

        this.draftHashIdentifier = this._router.snapshot.queryParams['page'] as string;
        if (this.draftHashIdentifier) {
            this.buildEditorWithBlocks(this.draftHashIdentifier);
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
                autofocus: true,
                readOnly: false,
                placeholder: 'Share your story ... ',
                tools: toolsConfig,
                data: article,
            });

            this.editorForm.get('headline')?.patchValue(article.highlight.header);
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

    public saveEditorData(): void {
        this.editor.save().then((outputData) => {
            const DialogConf = {
                width: '100vw',
                height: '100vh',
                minHeight: '100vh',
                maxWidth: 'unset',
                panelClass: ['rounded-none', 'bg-white'],

                disableClose: false,
            };

            this.getContentFromPublication(outputData.blocks as BlocksEntity[]).then((_description) => {
                if (outputData.blocks.length > 0) {
                    const dialogRef = this.cdkDialog.open(PublishComponent, {
                        ...DialogConf,
                        data: <Compose>{
                            header: this.editorForm.controls['headline'].value,
                            description: new ShortenStringPipe().transform(_description),
                            draftId: this.draftHashIdentifier,
                        },
                    });
                    dialogRef.closed.subscribe((result) => {
                        console.log(`Dialog result: ${result}`);
                    });
                } else {
                    // this._warningWithEmptyPublish()
                }
            });
        });
    }

    private getContentFromPublication(blocks: BlocksEntity[]): Promise<string> {
        return new Promise((resolve) => {
            if (blocks) {
                blocks.forEach((element) => {
                    if (element.type == 'paragraph') {
                        const head = element.data.text ? element.data.text : '';
                        resolve(new DOMParser().parseFromString(head, 'text/html').body.innerText);
                    }
                });
            }
            resolve('');
        });
    }

    ngOnDestroy(): void {
        this.themeService.setNavbarState(true);
    }
}
