import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        title: 'artifacts',
        loadComponent: async () => (await import('./artifact.component')).ArtifactComponent,
    },
];
