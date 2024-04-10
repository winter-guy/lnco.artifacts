/* eslint-disable @typescript-eslint/naming-convention */
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

import { switchMap } from 'rxjs/operators';

const EXCEPTION_ENDPOINTS: string[] = ['/api/v2/fetch', '/api/v2/fetch/'];

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

    // Define your list of endpoints that don't require the access token
    const normalizedRequestUrl = request.url.trim().toLowerCase();
    const normalizedEndpoints = EXCEPTION_ENDPOINTS.map((endpoint) => endpoint.toLowerCase());
    if (normalizedEndpoints.some((endpoint) => normalizedRequestUrl.includes(endpoint))) {
        // Proceed with the request without adding the Authorization header
        return next(request);
    }

    // If not in the exception list, obtain the JWT token asynchronously
    return authService.getAccessTokenSilently().pipe(
        switchMap((token) => {
            // Clone the original request and add the Authorization header with the JWT token
            const clonedRequest = request.clone({
                setHeaders: {
                    ...(request.method !== 'GET' && { 'Content-Type': 'application/json; charset=utf-8' }),
                    'SPA-name': 'artifacts',
                    Authorization: `Bearer ${token}`,
                },
            });

            // Proceed with the cloned request
            return next(clonedRequest);
        }),
    );
};
