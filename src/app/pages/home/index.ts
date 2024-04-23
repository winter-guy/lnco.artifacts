import { Routes } from '@angular/router';
import { HomeResolver } from './resolver';

export const routes: Routes = [
    {
        path: '',
        loadComponent: async () => (await import('./home.component')).HomeComponent,
        resolve: {
            data: HomeResolver,
        },
    },
];
