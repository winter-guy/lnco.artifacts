/* eslint-disable @typescript-eslint/naming-convention */

import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

import { Observable, switchMap } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(request: HttpRequest<never>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return this.authService.isAuthenticated$.pipe(
            switchMap((isAuthenticated: boolean) => {
                if (this.isExceptionEndpoint(request.url) && !isAuthenticated) {
                    // Proceed with the request without adding the Authorization header
                    return next.handle(request);
                } else {
                    // If not in the exception list, obtain the JWT token asynchronously
                    return this.authService.getAccessTokenSilently().pipe(
                        switchMap((token: string) => {
                            // Clone the original request and add the Authorization header with the JWT token
                            const clonedRequest = request.clone({
                                setHeaders: {
                                    'Content-Type': 'application/json; charset=utf-8',
                                    'Access-Control-Allow-Origin': 'true',
                                    'Access-Control-Allow-Credentials': 'true',
                                    'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
                                    'SPA-name': 'artifacts',
                                    Authorization: `Bearer ${token}`,
                                },
                            });

                            // Proceed with the cloned request
                            return next.handle(clonedRequest);
                        }),
                    );
                }
            }),
        );
    }

    private isExceptionEndpoint(url: string): boolean {
        const exceptionEndpoints = ['/api/v2/fetch', '/api/v2/fetch/'];
        return exceptionEndpoints.some((endpoint) => url.includes(endpoint));
    }
}
