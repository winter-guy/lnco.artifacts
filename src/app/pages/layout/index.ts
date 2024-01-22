import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home', // Redirect to 'home' when the path is empty
        pathMatch: 'full', // Ensure a full match for the empty path
    },
    {
        path: 'home',
        title: 'Home',
        loadChildren: async () => (await import('@pages/home')).routes,
    },
    {
        path: 'artifact',
        title: 'Artifact',
        loadChildren: async () => (await import('@pages/artifact')).routes,
    },
    {
        path: 'compose',
        title: 'Compose',
        loadChildren: async () => (await import('@pages/compose')).routes,
    },
];
