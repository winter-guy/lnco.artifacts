import { Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home', // Redirect to 'home' when the path is empty
        pathMatch: 'full', // Ensure a full match for the empty path
    },
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
        path: 'compose',
        title: 'composer',
        loadChildren: async () => (await import('@pages/compose')).routes,
        canActivate: [AuthGuard],
    },
];
