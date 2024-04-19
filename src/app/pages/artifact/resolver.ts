import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SecRecord } from '@lib/interfaces/record';
import { ArtifactService } from '@lib/services/artifacts/artifacts.service';
import { Observable, delay, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FactResolver implements Resolve<SecRecord> {
    constructor(private _artifact: ArtifactService) {}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SecRecord> {
        state;
        const id = route.queryParams['page'] as string;
        return this._artifact.getArtifactsById(id).pipe(
            map((res: SecRecord) => {
                return res;
            }),
            delay(1000),
        );
    }
}
