import { ConfirmDialogComponent } from '@lib/components/consent/dialog.component';
import { ConfirmDialogData } from '@lib/interfaces/confirm.dialog';
import { DialogService } from '@lib/services/dialog/dialog.service';

const defaultConfirmData = {
    title: 'Confirmation',
    message: 'Are you sure you want to perform this action?',
};

export function needConfirmation(confirmData: ConfirmDialogData = defaultConfirmData) {
    return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any) {
            DialogService.getInstance()
                ?.openDialog(confirmData, ConfirmDialogComponent)
                .subscribe((validation) => {
                    if (validation) {
                        originalMethod.apply(this, args);
                    }
                });
        };

        return descriptor;
    };
}
