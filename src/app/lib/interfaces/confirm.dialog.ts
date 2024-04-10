export interface ConfirmDialogData {
    message: string;
    description?: string;
    label?: string;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    alignment?: 'items-center' | 'items-start';
    disableCloseBtn?: boolean;
}
