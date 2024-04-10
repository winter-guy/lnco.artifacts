import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogData } from '@lib/interfaces/confirm.dialog';

@Component({
    standalone: true,
    imports: [MatDialogModule, CommonModule],
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
})
export class ConfirmDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData) {}
}
