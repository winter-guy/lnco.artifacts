import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        title: 'Artifacts',
        loadChildren: async () => (await import('@pages/journal/article')).routes,
    },
    {
        path: 'edit',
        title: 'Journal',
        loadChildren: async () => (await import('@pages/journal/view')).routes,
    },
];
