import { Routes } from '@angular/router';
import { FactResolver } from './resolver';

export const routes: Routes = [
    {
        path: '',
        loadComponent: async () => (await import('./artifact.component')).ArtifactComponent,
        resolve: {
            data: FactResolver,
        },
    },
];
