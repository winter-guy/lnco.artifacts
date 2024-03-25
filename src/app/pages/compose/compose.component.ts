import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Observable, combineLatest, debounceTime, skip } from 'rxjs';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { SharedModule } from '@lib/content/shared.module';
import { ThemeService } from '@lib/services';
import { ArtifactService } from '@lib/services/artifacts/artifacts.service';
import { PublishComponent } from '@pages/publish/publish.component';

import { Article, BlocksEntity } from '@lib/interfaces/article';
import { Compose } from '@lib/interfaces/compose';

import { editorjsConfig, toolsConfig } from '@lib/editor/editor.config';
import EditorJS from '@editorjs/editorjs';

import { ShortenStringPipe } from '@lib/pipe/short.pipe';
import { AuthService } from '@auth0/auth0-angular';
import { myValueSubject } from '@lib/services/core/publish';
import { SecRecord } from '@lib/interfaces/record';

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
        private _themeService: ThemeService,
        private _cdkDialog: Dialog,
        private readonly _auth: AuthService,
    ) {}

    ngOnInit(): void {
        this._themeService.setNavbarState(false);
        this.editorForm = this._formBuilder.group({
            headline: [
                '',
                {
                    updateOn: 'change',
                },
            ],
            article: [],
        });

        this._auth.getAccessTokenSilently().subscribe((token) => {
            myValueSubject.next(token);
        });

        /* overrides theme for composer page, dark theme abstructs view and editing experiance. */
        this._themeService.setTheme('light');

        this.detectEditorChanges()
            .pipe(debounceTime(200), skip(1))
            .subscribe({
                next: () => {
                    this.editor.save().then((outputData) => {
                        JSON.stringify(outputData, null, 2);
                        Object.create(<Article>{});
                        console.log(outputData);
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

    postDataBlock!: SecRecord;
    public buildEditorWithBlocks(_artifactId: string): void {
        this.artifactService.getArtifactsById(_artifactId).subscribe((article) => {
            this.postDataBlock = article;
            this.editor = new EditorJS({
                holder: 'editorjs',
                autofocus: true,
                readOnly: false,
                placeholder: 'Share your story ... ',
                tools: toolsConfig,
                data: article.record,
            });

            this.editorForm.get('headline')?.patchValue(article.meta.head);
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
            const dialogConf = {
                width: '100vw',
                height: '100vh',
                minHeight: '100vh',
                maxWidth: 'unset',
                panelClass: ['rounded-none', 'bg-white'],

                disableClose: false,
            };

            combineLatest([
                this.artifactService.getImageFromPublication(outputData.blocks as BlocksEntity[]),
                this.artifactService.getContentFromPublication(outputData.blocks as BlocksEntity[]),
            ]).subscribe(([_images, _description]) => {
                if (outputData.blocks.length > 0) {
                    const dialogRef = this._cdkDialog.open(PublishComponent, {
                        ...dialogConf,
                        data: <Compose>{
                            header: this.editorForm.controls['headline'].value as string,
                            description: new ShortenStringPipe().transform(_description),
                            draftId: this.draftHashIdentifier,
                            images: _images,
                            tags: this.postDataBlock?.meta?.tags,
                        },
                    });
                    dialogRef.closed.subscribe((result) => {
                        console.log(result);
                        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                        console.log(`Dialog result: ${result}`);
                    });
                } else {
                    // this._warningWithEmptyPublish()
                }
            });
        });
    }

    ngOnDestroy(): void {
        this._themeService.setNavbarState(true);
    }
}
