/* eslint-disable @typescript-eslint/naming-convention */
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

import { switchMap } from 'rxjs/operators';

/**
 * Interceptor that adds an Authorization header to requests that are authenticated and target the API URL.
 *
 * @param request The request object.
 * @param next The next interceptor in the chain.
 *
 * @returns The next Observable.
 */
export const jwtInterceptor: HttpInterceptorFn = (request, next) => {
    const authService = inject(AuthService);

    return authService.getAccessTokenSilently().pipe(
        switchMap((token) => {
            const clonedRequest = request.clone({
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                setHeaders: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Access-Control-Allow-Origin': 'true',
                    'Access-Control-Allow-Credentials': 'true',
                    'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
                    'SPA-name': 'artifacts',

                    Authorization: `Bearer ${token}`,
                },
            });

            return next(clonedRequest);
        }),
    );
};
