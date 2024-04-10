import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Observable, combineLatest, debounceTime, skip } from 'rxjs';
import { Dialog, DialogModule, DialogRef } from '@angular/cdk/dialog';
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
import { Record, SecRecord } from '@lib/interfaces/record';

import { CdkMenu, CdkMenuModule } from '@angular/cdk/menu';

@Component({
    standalone: true,
    imports: [CommonModule, RouterModule, ReactiveFormsModule, SharedModule, DialogModule, CdkMenuModule, CdkMenu],
    templateUrl: './compose.component.html',
})
export class ComposeComponent implements OnInit, OnDestroy {
    public artifact$!: Observable<Article>;
    public editor!: EditorJS;
    public editorObserver!: MutationObserver;
    public draftHashIdentifier!: string;

    public editorForm!: FormGroup;
    public userName!: string | undefined;

    constructor(
        protected readonly artifactService: ArtifactService,

        private readonly _formBuilder: FormBuilder,
        private readonly _route: ActivatedRoute,
        private readonly _router: Router,
        private readonly _themeService: ThemeService,
        private readonly _cdkDialog: Dialog,
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
                        /* put draft creation logic here */
                    });
                },
            });

        this.draftHashIdentifier = this._route.snapshot.queryParams['page'] as string;
        if (this.draftHashIdentifier) {
            this.buildEditorWithBlocks(this.draftHashIdentifier);
        } else {
            this.buildEditorWithoutBlocks();
        }

        this._auth.isAuthenticated$.subscribe((isAuthenticated) => {
            if (isAuthenticated) {
                // Access the user's profile
                this._auth.user$.subscribe((user) => {
                    this.userName = user?.name; // Or any other property containing the user's name
                });
            }
        });
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
                    const dialogRef: DialogRef<Record, PublishComponent> = this._cdkDialog.open(PublishComponent, {
                        ...dialogConf,
                        data: {
                            header: this.editorForm.controls['headline'].value as string,
                            description: new ShortenStringPipe().transform(_description),
                            draftId: this.draftHashIdentifier,
                            images: _images,
                            tags: this.postDataBlock?.meta?.tags,
                            inShort: this.postDataBlock?.inShort,
                            article: outputData,
                            author: this.userName,
                            editing: !!this.postDataBlock?.id,
                        } as Compose,
                    });
                    dialogRef.closed.subscribe((res) => {
                        if (res) this.onBtnActionClicked(res.id);
                    });
                } else {
                    // this._warningWithEmptyPublish()
                }
            });
        });
    }

    public onBtnActionClicked(pageId: string): void {
        const NAV_URL = '/artifact';
        this._router.navigate([NAV_URL], { queryParams: { page: pageId } });
    }

    ngOnDestroy(): void {
        this._themeService.setNavbarState(true);
    }
}
