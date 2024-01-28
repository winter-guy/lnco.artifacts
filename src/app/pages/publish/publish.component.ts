/* eslint-disable @typescript-eslint/ban-types */
import { Component, Inject, OnInit } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Compose } from '@lib/interfaces/compose';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Tag } from '@lib/interfaces/article';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { NgFor } from '@angular/common';

@Component({
    standalone: true,
    imports: [ReactiveFormsModule, MatChipsModule, MatIconModule, NgFor],
    templateUrl: './publish.component.html',
    styleUrl: './publish.component.css',
})
export class PublishComponent implements OnInit {
    public editorForm!: FormGroup;
    public tags: Tag[] = [];
    readonly separatorKeysCodes = [ENTER, COMMA] as const;

    constructor(
        public dialogRef: DialogRef<string>,
        @Inject(DIALOG_DATA) public data: Compose,
        private _formBuilder: FormBuilder,
    ) {}

    ngOnInit(): void {
        this.editorForm = this._formBuilder.group({
            headline: [
                '',
                {
                    updateOn: 'change',
                },
            ],
            description: [],
        });

        this.editorForm.patchValue({
            headline: this.data.header,
            description: this.data.description,
        });
    }

    public close(): void {
        this.dialogRef.close();
    }

    public add(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();

        if (value) {
            this.tags.push({ name: value });
        }
        event.chipInput?.clear();
    }

    public remove(tag: Tag): void {
        const index: number = this.tags.indexOf(tag);
        if (index >= 0) {
            this.tags.splice(index, 1);
        }
    }
}
