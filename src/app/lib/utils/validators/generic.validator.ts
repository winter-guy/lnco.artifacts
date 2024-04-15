/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function formGroupValidator(validationMessages: { [key: string]: { [key: string]: string } }): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const messages: { [key: string]: string } = {};

        if (control instanceof FormGroup) {
            processControls(control);
        }

        if (Object.keys(messages).length === 0) {
            return null;
        }

        return messages;

        function processControls(container: FormGroup) {
            Object.keys(container.controls).forEach((controlKey) => {
                const controlProperty = container.controls[controlKey];

                if (controlProperty instanceof FormGroup) {
                    processControls(controlProperty);
                } else {
                    if (validationMessages[controlKey]) {
                        // messages[controlKey] = '';

                        if (controlProperty.errors) {
                            const errorKeys = Object.keys(controlProperty.errors);
                            const lastErrorKey = errorKeys[errorKeys.length - 1];
                            const lastErrorMessage = validationMessages[controlKey][lastErrorKey];

                            if (lastErrorMessage) {
                                messages[controlKey] = lastErrorMessage;
                            }
                        }
                    }
                }
            });
        }
    };
}
