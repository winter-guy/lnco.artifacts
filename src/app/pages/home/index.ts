import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        title: 'Home',
        loadComponent: async () => (await import('./home.component')).HomeComponent,
        children: [
            {
                path: 'artifact',
                title: 'Artifact',
                loadChildren: async () => (await import('@pages/artifact')).routes,
            },
        ],
    },
];
