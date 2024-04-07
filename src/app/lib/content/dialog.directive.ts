/* eslint-disable */
import { ConfirmDialogComponent } from '@lib/components/consent/dialog.component';
import { ConfirmDialogData } from '@lib/interfaces/confirm.dialog';
import { DialogService } from '@lib/services/dialog/dialog.service';

const defaultConfirmData = {
    title: 'Confirmation',
    message: 'Are you sure you want to perform this action?',
};

export function needConfirmation(confirmData: ConfirmDialogData = defaultConfirmData) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
        target;
        propertyKey;
        
        const originalMethod = descriptor.value;

        // Annotate the type of 'this' explicitly
        descriptor.value = async function(this: any, ...args: any[]): Promise<void> {
            const isValidated = await DialogService.getInstance()
                ?.openDialog(confirmData, ConfirmDialogComponent)
                .toPromise();

            if (isValidated) {
                // Ensure 'this' is not being shadowed by another variable
                await originalMethod.apply(this, args);
            }
        };

        return descriptor;
    };
}

