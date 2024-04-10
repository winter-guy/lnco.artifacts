import { ComponentType } from '@angular/cdk/portal';
import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DialogService {
    matDialog = inject(MatDialog);

    private static _instance: DialogService | null = null;
    constructor() {
        DialogService._instance = this;
    }
    public static getInstance(): DialogService | null {
        return DialogService._instance;
    }

    openDialog<K, T>(data: K, component: ComponentType<T>): Observable<boolean> {
        return this.matDialog
            .open(component, {
                data: data,
                disableClose: true,
                panelClass: 'rounded',
            })
            .afterClosed() as Observable<boolean>;
    }
}
