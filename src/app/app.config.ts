/* eslint-disable @typescript-eslint/naming-convention */
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { jwtInterceptor, serverErrorInterceptor } from '@lib/interceptors';
import { routes } from './app.routes';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { AuthModule } from '@auth0/auth0-angular';
import { environment } from '@env/environment';

export const appConfig: ApplicationConfig = {
    providers: [
        importProvidersFrom(
            AuthModule.forRoot({
                domain: environment.auth.domain,
                clientId: environment.auth.clientId,
                authorizationParams: {
                    redirect_uri: window.location.origin,
                    audience: environment.auth.audience,
                },
                httpInterceptor: {
                    ...environment.httpInterceptor,
                },
            }),
            BrowserAnimationsModule,
        ),
        provideRouter(routes, withComponentInputBinding()),
        provideHttpClient(withInterceptors([serverErrorInterceptor, jwtInterceptor])),
        provideAnimations(),
    ],
};
