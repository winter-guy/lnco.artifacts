import { Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { authGuard } from '@lib/guards';

export const routes: Routes = [
    {
        path: '',
        loadChildren: async () => (await import('@pages/layout')).routes,
    },
    {
        path: 'user',
        loadChildren: async () => (await import('@pages/user')).routes,
        canActivate: [AuthGuard],
    },
    {
        path: 'journal',
        loadChildren: async () => (await import('@pages/journal')).routes,
        canActivate: [AuthGuard],
    },
    {
        path: 'settings',
        loadChildren: async () => (await import('@pages/settings')).routes,
        canMatch: [authGuard()],
    },
    {
        path: '**',
        loadComponent: async () => (await import('@pages/screens/not-found/not-found.component')).NotFoundComponent,
    },
];
