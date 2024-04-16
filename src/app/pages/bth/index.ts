import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'developer', // Redirect to 'home' when the path is empty
        pathMatch: 'full',
    },
    {
        path: 'developer',
        title: 'Guy',
        loadComponent: async () => (await import('./about/about.component')).AboutComponent,
    },
];
