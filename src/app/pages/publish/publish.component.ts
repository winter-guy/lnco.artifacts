/* eslint-disable @typescript-eslint/ban-types */
import { Component, Inject, OnInit } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Compose } from '@lib/interfaces/compose';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Tag } from '@lib/interfaces/article';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { NgFor, NgIf } from '@angular/common';
import { CheckboxComponent } from './checkbox.component';

@Component({
    standalone: true,
    imports: [ReactiveFormsModule, MatChipsModule, MatIconModule, NgFor, NgIf, FormsModule, CheckboxComponent],
    templateUrl: './publish.component.html',
    styleUrl: './publish.component.css',
})
export class PublishComponent implements OnInit {
    public editorForm!: FormGroup;
    public tags: Tag[] = [];
    public isChecked = false;

    public poster!: {
        label: string;
        url: string;
        selected: boolean;
    }[];
    readonly separatorKeysCodes = [ENTER, COMMA] as const;

    constructor(
        public dialogRef: DialogRef<string>,
        @Inject(DIALOG_DATA) public data: Compose,
        private _formBuilder: FormBuilder,
    ) {}

    ngOnInit(): void {
        this.tags = this.data.tags;
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

        this.poster = this.data.images.map((url, i) => {
            return { label: `${i}_selection`, url: url, selected: i === 0 ? true : false };
        });
        console.log(this.poster);
    }

    public get selectedPoster(): string | undefined {
        return this.poster.find((image) => image.selected)?.url;
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

    public onCheckboxChange(index: number): void {
        // Uncheck other checkboxes when one is checked
        this.poster.forEach((checkbox: { selected: boolean }, i: number) => {
            checkbox.selected = !(i !== index);
        });
        console.log(this.poster);
    }

    //XXXXXXX
    public handleCheckboxChange(event: Event): void {
        // Uncheck other checkboxes when the current one is checked
        if (event.target instanceof HTMLInputElement) {
            this.isChecked = event.target.checked;

            // You can implement logic to uncheck other checkboxes here
            if (this.isChecked) {
                console.log('Checkbox checked');
            }
        }
    }
}
