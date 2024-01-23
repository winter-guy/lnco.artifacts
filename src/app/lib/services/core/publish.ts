/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/naming-convention */
// import { HttpClient } from '@angular/common/http';
// import { inject } from '@angular/core';

import { environment } from '@env/environment';
import axios from 'axios';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

const myValueSubject: BehaviorSubject<string> = new BehaviorSubject<string>('Bearer ');

export function UploadBlobToS3BucketAndGetUrl(snapshot: Blob): Observable<{ success: number; file: { url: string } }> {
    // httpClient = inject(HttpClient);
    const url = `${environment.storeApi}/stream/blob`;

    return myValueSubject.pipe(
        switchMap((authToken: string) => {
            const headers = {
                Authorization: `Bearer ${authToken}`,
            };

            const formData = new FormData();

            formData.append('snapshot', snapshot, 'filename.png'); // Adjust the filename and form field name as necessary

            return from(axios.post<string>(url, formData, { headers })).pipe(
                switchMap((response) => {
                    return of({
                        success: 1,
                        file: {
                            url: response.data,
                        },
                    });
                }),
            );
        }),
    );
}

export function UploadByUrlToS3BucketAndGetUrl(
    snapshot: string,
): Observable<{ success: number; file: { url: string } }> {
    const url = `${environment.storeApi}/stream/url?url=${snapshot}`;

    return myValueSubject.pipe(
        switchMap((authToken: string) => {
            const headers = {
                Authorization: `Bearer ${authToken}`,
            };

            return from(axios.get<string>(url, { headers })).pipe(
                switchMap((response) => {
                    return of({
                        success: 1,
                        file: {
                            url: response.data,
                        },
                    });
                }),
            );
        }),
    );
}
