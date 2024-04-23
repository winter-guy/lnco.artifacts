import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoadingComponent } from '@lib/components/loading/loading.component';
import { Artifact } from '@lib/interfaces/artifact';

import { ArtifactService } from '@lib/services/artifacts/artifacts.service';
import { Observable, delay, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HomeResolver
    implements Resolve<{ record: Observable<Artifact[]>; loading?: DialogRef<unknown, LoadingComponent> }>
{
    constructor(private _artifact: ArtifactService, private readonly _dialog: Dialog) {}
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): { record: Observable<Artifact[]>; loading?: DialogRef<unknown, LoadingComponent> } {
        state;

        const loadingDialog = this._dialog.open(LoadingComponent, {
            disableClose: true,
        });

        return {
            record: this._artifact.getArtifacts().pipe(
                map((res: Artifact[]) => {
                    return res;
                }),
                delay(1000),
            ),
            loading: loadingDialog,
        };
    }
}
