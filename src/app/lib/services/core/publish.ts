/* eslint-disable @typescript-eslint/naming-convention */

import { environment } from '@env/environment';
import axios from 'axios';

import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export const myValueSubject: BehaviorSubject<string> = new BehaviorSubject<string>('Bearer ');

export function uploadBlobToS3BucketAndGetUrl(snapshot: Blob): Observable<{ success: number; file: { url: string } }> {
    const url = `${environment.apiUri}/upload`;

    return myValueSubject.pipe(
        switchMap((authToken: string) => {
            const headers = {
                Authorization: `Bearer ${authToken}`,
            };

            const formData = new FormData();
            formData.append('image', snapshot, 'filename.png'); // Adjust the filename and form field name as necessary
            formData.append('isPrivate', 'false');
            return from(axios.post<{ url: string; isPrivate: boolean; ref?: string }>(url, formData, { headers })).pipe(
                switchMap((response) => {
                    return of({
                        success: 1,
                        file: {
                            url: response.data.url,
                        },
                    });
                }),
            );
        }),
    );
}

export function uploadByUrlToS3BucketAndGetUrl(
    snapshot: string,
): Observable<{ success: number; file: { url: string } }> {
    const url = `${environment.apiUri}/upload/url`;
    return myValueSubject.pipe(
        switchMap((authToken: string) => {
            const headers = {
                Authorization: `Bearer ${authToken}`,
            };

            return from(
                axios.post<{ url: string; isPrivate: boolean; ref?: string }>(
                    url,
                    {
                        url: snapshot,
                        isPrivate: false,
                        ref: 'a3b9c8d7e6f5a4b3c2d1e0f',
                    },
                    { headers },
                ),
            ).pipe(
                switchMap((response) => {
                    return of({
                        success: 1,
                        file: {
                            url: response.data.url,
                        },
                    });
                }),
            );
        }),
    );
}
