import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        title: 'compose',
        loadComponent: async () => (await import('./compose.component')).ComposeComponent,
    },
];
