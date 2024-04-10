/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @angular-eslint/directive-selector */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
    selector: '[striptags]',
})
export class StripHtmlTagsDirective {
    constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

    @HostListener('input')
    onInput() {
        const element = this.elementRef.nativeElement;
        const plainText = element.textContent; // Get the plain text without HTML tags
        this.renderer.setProperty(element, 'textContent', plainText); // Update the content with plain text
    }
}
