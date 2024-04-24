import { Routes } from '@angular/router';
import { HomeResolver } from '@pages/home/resolver';

export const routes: Routes = [
    {
        path: 'lodging',
        loadComponent: async () => (await import('./lnco.component')).LncoComponent,
        resolve: {
            data: HomeResolver,
        },
    },
];
