import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        title: 'Artifacts',
        loadComponent: async () => (await import('./artifact.component')).ArtifactComponent,
    },
];
