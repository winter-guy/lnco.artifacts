import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'artifact', // Redirect to 'home' when the path is empty
        pathMatch: 'full',
    },
    {
        path: 'edit',
        title: 'Journal',
        loadChildren: async () => (await import('@pages/journal/view')).routes,
    },
    {
        path: 'artifact',
        title: 'Artifact',
        loadChildren: async () => (await import('@pages/journal/article')).routes,
    },
];
