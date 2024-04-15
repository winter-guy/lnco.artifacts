/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-prototype-builtins */
/* eslint-disable @angular-eslint/directive-selector */
import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, NG_VALIDATORS, Validator } from '@angular/forms';

// Provide all set of validation messages here
const VALIDATION_MESSAGES = {
    email: {
        required: 'Please fill out this field.',
        email: 'This email is invalid',
    },
    username: {
        required: 'Please fill out this field.',
        minlength: 'The password length must be greater than or equal to 8',
    },
    name: {
        required: 'Please fill out this field.',
    },
    profile: {
        required: 'Please fill out this field.',
    },
    about: {
        required: 'Please fill out this field.',
    },
};

@Directive({
    selector: '[formGroupValidator]',
    standalone: true,
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: FormGroupValidatorDirective,
            multi: true,
        },
    ],
})
export class FormGroupValidatorDirective implements Validator {
    // By default the defined set of validation messages is passed but a custom message when the class is called can also be passed
    @Input() validationMessages: { [key: string]: { [key: string]: string } } = VALIDATION_MESSAGES;
    @Output() validated: EventEmitter<any> = new EventEmitter<any>();

    constructor() {
        //
    }

    validate(formGroup: FormGroup): { [key: string]: any } {
        return this.formGroupValidator(formGroup);
    }

    // this will process each formcontrol in the form group
    // and then return the error message to display
    // the return value will be in this format `formControlName: 'error message'`;
    formGroupValidator(container: FormGroup): { [key: string]: string } {
        const messages: { [key: string]: string } = {};

        // Loop through all the formControls
        for (const controlKey in container.controls) {
            if (container.controls.hasOwnProperty(controlKey)) {
                // Get the properties of each formControl
                const controlProperty = container.controls[controlKey];

                // If it is a FormGroup, process its child controls.
                if (controlProperty instanceof FormGroup) {
                    const childMessages = this.formGroupValidator(controlProperty);
                    Object.assign(messages, childMessages);
                } else {
                    // Only validate if there are validation messages for the control
                    if (this.validationMessages[controlKey]) {
                        messages[controlKey] = '';

                        if ((controlProperty.dirty || controlProperty.touched) && controlProperty.errors) {
                            // Get the array of error keys for the control
                            const errorKeys = Object.keys(controlProperty.errors);

                            // Get the last error key
                            const lastErrorKey = errorKeys[errorKeys.length - 1];

                            // Get the last error message for the control
                            const lastErrorMessage = this.validationMessages[controlKey][lastErrorKey];

                            if (lastErrorMessage) {
                                messages[controlKey] = lastErrorMessage;
                            }
                        }
                    }
                }
            }
        }

        this.validated.emit(messages);
        return messages;
    }
}
