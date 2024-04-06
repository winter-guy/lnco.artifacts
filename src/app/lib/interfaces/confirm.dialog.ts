export interface ConfirmDialogData {
    message: string;
    description?: string;
    label?: string;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    message_alignment?: 'items-center' | 'items-start';
    disableCloseBtn?: boolean;
}
