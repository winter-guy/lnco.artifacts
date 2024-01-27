/* eslint-disable @typescript-eslint/ban-types */
import { Component, Inject, OnInit } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Compose } from '@lib/interfaces/compose';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './publish.component.html',
    styleUrl: './publish.component.css',
})
export class PublishComponent implements OnInit {
    public editorForm!: FormGroup;

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
}
