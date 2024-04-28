/* eslint-disable */
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, ENVIRONMENT_INITIALIZER, importProvidersFrom, inject } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { jwtInterceptor, serverErrorInterceptor } from '@lib/interceptors';
import { routes } from './app.routes';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { AuthModule } from '@auth0/auth0-angular';
import { environment } from '@env/environment';
import { DialogService } from '@lib/services/dialog/dialog.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

export function initializeDialogService() {
    return (): void => {
        inject(DialogService);
    };
}
export const MY_DATE_FORMATS = {
    parse: {
      dateInput: 'LL',
    },
    display: {
      dateInput: 'LL',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
    },
  };

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
            MatDialogModule,
        ),
        provideRouter(routes, withComponentInputBinding()),
        provideHttpClient(withInterceptors([serverErrorInterceptor, jwtInterceptor])),
        provideAnimations(),
        {
            provide: ENVIRONMENT_INITIALIZER,
            useFactory: initializeDialogService,
            deps: [MatDialog],
            multi: true,
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    ],
};
