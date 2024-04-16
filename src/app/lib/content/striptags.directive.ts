/* eslint-disable */
import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
    selector: '[striptags]',
})
export class StripHtmlTagsDirective {
    constructor(private _elementRef: ElementRef, private _renderer: Renderer2) {}

    @HostListener('input')
    onInput(): void {
        const element = this._elementRef.nativeElement;
        const plainText = element.textContent; // Get the plain text without HTML tags
        this._renderer.setProperty(element, 'textContent', plainText); // Update the content with plain text
    }
}
