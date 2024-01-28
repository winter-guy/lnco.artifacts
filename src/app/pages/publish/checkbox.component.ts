/* eslint-disable @angular-eslint/component-selector */
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'checkbox',
    standalone: true,
    imports: [],
    template: `
        <label>
            <input
                class="absolute m-1.5 cursor-pointer rounded border-slate-300 text-blue-600 transition disabled:cursor-not-allowed disabled:bg-slate-200 disabled:opacity-75"
                type="checkbox"
                type="checkbox"
                [checked]="isChecked"
                (change)="onCheckboxChange()"
            />
        </label>
    `,
})
export class CheckboxComponent {
    @Input() label = '';
    @Input() isChecked = false;
    @Output() checkedChange = new EventEmitter<boolean>();

    onCheckboxChange(): void {
        this.checkedChange.emit(!this.isChecked);
    }
}
