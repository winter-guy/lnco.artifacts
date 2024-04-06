export interface ConfirmDialogData {
    message: string;
    label?: string;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    message_alignment?: 'items-center' | 'items-start';
    disableCloseBtn?: boolean;
}
