/* eslint-disable */
import { Directive, ElementRef, forwardRef, HostListener, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
    selector: '[contenteditable][formControlName], [contenteditable][formControl], [contenteditable][ngModel]',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ContenteditableValueAccessor),
            multi: true,
        },
    ],
})
export class ContenteditableValueAccessor implements ControlValueAccessor {
    constructor(private readonly elementRef: ElementRef, private readonly renderer: Renderer2) {}

    private onTouched = () => {};
    private onChange: (value: string) => void = () => {};

    registerOnChange(onChange: (value: string) => void) {
        this.onChange = onChange;
    }

    registerOnTouched(onTouched: () => void) {
        this.onTouched = onTouched;
    }

    @HostListener('input')
    onInput() {
        const textContent = this.elementRef.nativeElement.textContent;
        this.onChange(textContent);
    }

    @HostListener('blur')
    onBlur(): void {
        this.onTouched();
    }

    setDisabledState(disabled: boolean): void {
        this.renderer.setAttribute(this.elementRef.nativeElement, 'contenteditable', String(!disabled));
    }

    writeValue(value: string | null): void {
        const processedValue = ContenteditableValueAccessor._processValue(value);
        this.renderer.setProperty(this.elementRef.nativeElement, 'textContent', processedValue);
    }

    private static _processValue(value: string | null): string {
        const processed = value || '';
        return processed.trim() === '<br>' ? '' : processed;
    }
}
