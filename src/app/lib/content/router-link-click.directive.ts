import { Directive, HostListener } from '@angular/core';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[routerLinkClick]',
    standalone: true,
})
export class RouterLinkClickDirective {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}

    @HostListener('click', ['$event'])
    onClick(event: Event): void {
        // Prevent the default behavior of the link
        event.preventDefault();
        // Execute your function here
        this.yourFunction();
    }

    // Define your function here
    yourFunction(): void {
        // Your function logic goes here
        console.log('Router link clicked!');
    }
}
