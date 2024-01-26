/* eslint-disable @typescript-eslint/ban-types */
import { Component, Inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

@Component({
    selector: 'app-publish',
    standalone: true,
    imports: [],
    templateUrl: './publish.component.html',
    styleUrl: './publish.component.css',
})
export class PublishComponent {
    constructor(public dialogRef: DialogRef<string>, @Inject(DIALOG_DATA) public data: {}) {}

    public close(): void {
        this.dialogRef.close();
    }
}
