import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ArtifactService } from '@lib/services/artifacts/artifacts.service';

import EditorJS from '@editorjs/editorjs';
import { toolsConfig } from '@lib/editor/editor.config';
import { SecRecord } from '@lib/interfaces/record';

import { CdkMenu, CdkMenuModule } from '@angular/cdk/menu';
import { CdkAccordionModule } from '@angular/cdk/accordion';

@Component({
    standalone: true,
    imports: [CommonModule, CdkMenuModule, CdkMenu, CdkAccordionModule],
    templateUrl: './artifact.component.html',
})
export class ArtifactComponent implements OnInit {
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
}
