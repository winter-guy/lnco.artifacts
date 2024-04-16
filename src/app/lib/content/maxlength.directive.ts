/* eslint-disable */
import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[maxLengthContenteditable]',
})
export class MaxLengthContenteditableDirective {
    constructor() {
        //
    }

    @HostListener('input', ['$event'])
    onInput(event: InputEvent): void {
        const element = event.target as HTMLDivElement;
        const text = element.innerText;

        if (text.length > 400) {
            event.preventDefault();
            const truncatedText = text.substr(0, 400);
            element.innerText = truncatedText;
            // Optionally, you can emit an event or display an error message here
        }
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        const allowedKeys = ['Backspace', 'Delete'];
        const key = event.key;

        if (!allowedKeys.includes(key)) {
            event.preventDefault();
            // Optionally, you can emit an event or display an error message here
        }
    }
}
