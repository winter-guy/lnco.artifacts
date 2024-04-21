import { Routes } from '@angular/router';
import { HomeResolver } from './resolver';

export const routes: Routes = [
    {
        path: '',
        title: 'Home',
        loadComponent: async () => (await import('./home.component')).HomeComponent,
        resolve: {
            data: HomeResolver,
        },
    },
];
