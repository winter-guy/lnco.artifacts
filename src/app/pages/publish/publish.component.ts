import { Component, Inject, OnInit } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Compose } from '@lib/interfaces/compose';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';

import { Tag } from '@lib/interfaces/article';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { CheckboxComponent } from './checkbox.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { InShort, Record } from '@lib/interfaces/record';
import { ArtifactService } from '@lib/services/artifacts/artifacts.service';

@Component({
    standalone: true,
    imports: [
        CommonModule,
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
    public inShortFormArray!: FormGroup;

    public enableInShortsEditor!: boolean;

    public tags: Tag[] = [];
    public isChecked = false;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public _poster!: {
        label: string;
        url: string;
        selected: boolean;
    }[];
    readonly separatorKeysCodes = [ENTER, COMMA] as const;

    constructor(
        public dialogRef: DialogRef<Record>,
        @Inject(DIALOG_DATA) public data: Compose,
        private _formBuilder: FormBuilder,
        private readonly _artifactSrvc: ArtifactService,
    ) {}

    ngOnInit(): void {
        console.log(this.data);
        this.inShortFormArray = this._formBuilder.group({
            formArray: this._formBuilder.array([]),
        });

        this.tags = this.data.tags ?? [];
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
            index: [],
            head: [''],
            content: [''],
        });

        this.editorForm.patchValue({
            headline: this.data.header,
            description: this.data.description,
        });

        this._poster = this.data.images.map((url, i) => {
            return { label: `${i}_selection`, url: url, selected: i === 0 ? true : false };
        });

        const formArray = this.inShortFormArray.get('formArray') as FormArray;

        this.data?.inShort?.forEach((item) => {
            formArray.push(this.createItem(item));
        });
    }

    async submit(): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/await-thenable
        const mappedvalue = await this._artifactSrvc.postPublicationMapper(
            this.data,
            {
                head: this.editorForm.controls['headline'].value as string,
                details: this.editorForm.controls['description'].value as string,
            },
            this.poster,
            this.data.article,
            this.inShortFormArray.controls['formArray'].value as InShort[],
            this.tags,
        );

        this._artifactSrvc.postArtifact(mappedvalue).subscribe((res) => {
            this.dialogRef.close(res);
        });
    }

    async update(): Promise<void> {
        const mappedvalue = await this._artifactSrvc.postPublicationMapper(
            this.data,
            {
                head: this.editorForm.controls['headline'].value as string,
                details: this.editorForm.controls['description'].value as string,
            },
            this.poster,
            this.data.article,
            this.inShortFormArray.controls['formArray'].value as InShort[],
            this.tags,
        );

        console.log(mappedvalue);
        this._artifactSrvc.updateArtifact(this.data.draftId, mappedvalue).subscribe((res) => {
            this.dialogRef.close(res);
        });
    }

    createItem(item: InShort): FormGroup {
        return this._formBuilder.group({
            head: [item.head],
            content: [item.content],
        });
    }

    public onSelectionChange($event: StepperSelectionEvent): void {
        console.log('Selection changed:', $event.selectedStep.label);
        // You can perform any action here based on the selected index

        this.enableInShortsEditor = $event.selectedStep.label === 'In Shorts';
    }

    public get poster(): string | undefined {
        return this._poster.find((image) => image.selected)?.url;
    }

    public close(): void {
        this.dialogRef.close();
    }

    public add(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();

        if (value) {
            this.tags?.push({ name: value });
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
        this._poster.forEach((checkbox: { selected: boolean }, i: number) => {
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

    addSummary(): void {
        const myArrayFormArray = this.inShortFormArray.get('formArray');
        if (!myArrayFormArray || !(myArrayFormArray instanceof FormArray)) {
            return;
        }

        const newFormGroup = this._formBuilder.group({
            head: [this.inShort.get('head')?.value],
            content: [this.inShort.get('content')?.value],
        });

        const contentIndex = this.inShort.controls['index'].value as number;
        if (!Object.is(contentIndex, null)) {
            myArrayFormArray.removeAt(Number(contentIndex));
        }

        myArrayFormArray.push(newFormGroup);
        this.inShort.reset();
    }

    public removeSummary(event: Event, index: number): void {
        event.stopPropagation();

        const myArrayFormArray = this.inShortFormArray.get('formArray') as FormArray;
        if (!myArrayFormArray) {
            console.error("Failed to get 'formArray' FormArray");
            return;
        }

        myArrayFormArray.removeAt(index);
    }

    public editSummary(event: Event, index: number, content: InShort): void {
        event.stopPropagation();

        this.inShort.patchValue({ ...content, index: index });
    }

    public resetSummary(): void {
        this.inShort.reset();
    }

    previewFlag = false;
    public toogleImagePreview(): void {
        this.previewFlag = !this.previewFlag;
    }
}
