import { CdkAccordionModule } from '@angular/cdk/accordion';
import { CdkMenuModule, CdkMenu } from '@angular/cdk/menu';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import EditorJS from '@editorjs/editorjs';
import { needConfirmation } from '@lib/content/dialog.directive';
import { toolsConfig } from '@lib/editor/editor.config';
import { SecRecord } from '@lib/interfaces/record';
import { ArtifactService } from '@lib/services/artifacts/artifacts.service';

@Component({
    standalone: true,
    imports: [CommonModule, CdkMenuModule, CdkMenu, CdkAccordionModule],
    templateUrl: './journal.component.html',
    styleUrl: './journal.component.css',
})
export class JournalComponent implements OnInit {
    public post!: SecRecord | undefined;
    public editor!: EditorJS;
    expandedIndex = 0;

    constructor(protected artifactService: ArtifactService, private _route: ActivatedRoute, private _router: Router) {}

    ngOnInit(): void {
        const id = this._route.snapshot.queryParams['page'] as string;

        this.artifactService.getArtifactsById(id).subscribe((res) => {
            if (res) {
                this.post = res;
                this.editor = new EditorJS({
                    holder: 'editorjs',
                    autofocus: false,
                    readOnly: true,
                    tools: toolsConfig,
                    data: res.record,
                });
            }
        });
    }

    @ViewChild('editorjs')
    div!: ElementRef<HTMLInputElement>;

    public onBtnActionClicked(): void {
        const NAV_URL = '/compose';
        this._route.queryParams.subscribe((params) => {
            this._router.navigate([NAV_URL], { queryParams: { page: params['page'] as string } });
        });
    }

    @needConfirmation({
        message: 'Are you sure you want to permanently delete this post?',
        description: 'This action cannot be undone.',
        label: 'delete',
        disableCloseBtn: true,
        alignment: 'items-start',
    })
    public deletePost(): void {
        if (this.post)
            this.artifactService.deleteArtifact(this.post.id).subscribe(() => {
                this._router.navigate(['/home']);
            });
    }
}
