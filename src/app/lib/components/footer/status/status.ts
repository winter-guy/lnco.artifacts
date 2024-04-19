import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
    standalone: true,
    imports: [MatDialogModule, CommonModule],
    templateUrl: './status.html',
    styles: `
    ::ng-deep .mat-mdc-dialog-container .mdc-dialog__surface {
  @apply rounded
}`,
})
export class StatusComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: { status: boolean }) {}
}
