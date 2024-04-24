import { Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';

export const routes: Routes = [
    {
        path: '',
        title: '',
        loadChildren: async () => (await import('@pages/home')).routes,
    },
    {
        path: 'artifact',
        loadChildren: async () => (await import('@pages/artifact')).routes,
    },
    {
        path: 'lnco',
        loadChildren: async () => (await import('@pages/lnco')).routes,
    },
    {
        path: 'compose',
        title: 'composer',
        loadChildren: async () => (await import('@pages/compose')).routes,
        canActivate: [AuthGuard],
    },
];
