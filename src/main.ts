import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { enableProdMode } from '@angular/core';
import { environment } from '@env/environment';

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, appConfig).catch((error) => {
    console.error(error);
});
