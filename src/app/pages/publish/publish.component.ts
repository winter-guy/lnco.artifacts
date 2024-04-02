/* eslint-disable @typescript-eslint/ban-types */
import { Component, Inject, OnInit } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Compose } from '@lib/interfaces/compose';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';

import { Tag } from '@lib/interfaces/article';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { NgFor, NgIf } from '@angular/common';
import { CheckboxComponent } from './checkbox.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { InShort } from '@lib/interfaces/record';
@Component({
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatChipsModule,
        MatIconModule,
        MatStepperModule,
        MatFormFieldModule,
        NgFor,
        NgIf,
        FormsModule,
        CheckboxComponent,
        MatButtonToggleModule,
        CdkAccordionModule,
    ],
    templateUrl: './publish.component.html',
    styleUrl: './publish.component.css',
})
export class PublishComponent implements OnInit {
    public editorForm!: FormGroup;
    public inShort!: FormGroup;
    public enableInShortsEditor!: boolean;
    public inShorts: InShort[] = [
        {
            head: 'Navigating the UK Housing Market: Trends, Challenges, and Opportunities',
            content: `The UK housing market has seen a significant price increase over the past two years, driven by low interest rates and high demand. However, rising mortgage rates pose a challenge for homeowners, potentially leading to financial strain when fixed-rate deals expire. Market indicators suggest a slowdown, with analysts predicting a 5-12% decline in prices over the next 18 months. The trajectory of interest rates and inflation will be critical in determining future market direction. Despite short-term challenges, opportunities exist for first-time buyers and investors, contingent on monitoring macroeconomic factors closely.`,
        },
        { head: 'ascas', content: 'ascas' },
    ];
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

        this.inShort = this._formBuilder.group({
            head: [''],
            content: [],
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

    public onSelectionChange($event: StepperSelectionEvent): void {
        console.log('Selection changed:', $event.selectedStep.label);
        // You can perform any action here based on the selected index

        this.enableInShortsEditor = $event.selectedStep.label === 'In Shorts';
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
