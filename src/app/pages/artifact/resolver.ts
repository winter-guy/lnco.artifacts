import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoadingComponent } from '@lib/components/loading/loading.component';
import { SecRecord } from '@lib/interfaces/record';
import { ArtifactService } from '@lib/services/artifacts/artifacts.service';
import { Observable, delay, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FactResolver
    implements Resolve<{ record: Observable<SecRecord>; loading?: DialogRef<unknown, LoadingComponent> }>
{
    constructor(private _artifact: ArtifactService, private readonly _dialog: Dialog) {}
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): { record: Observable<SecRecord>; loading?: DialogRef<unknown, LoadingComponent> } {
        state;

        // const loadingDialog = this._dialog.open(LoadingComponent, {
        //     disableClose: true,
        // });
        const id = route.queryParams['page'] as string;
        return {
            record: this._artifact.getArtifactsById(id).pipe(
                map((res: SecRecord) => {
                    return res;
                }),
                delay(1000),
            ),
            // loading: loadingDialog,
        };
    }
}
