import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        title: 'artifacts',
        loadComponent: async () => (await import('./artifact.component')).ArtifactComponent,
        // children: [
        //     {
        //         path: '',
        //         redirectTo: 'archives',
        //         pathMatch: 'full'
        //     },
        //     {
        //         path: 'archives',
        //         title: 'Archives',
        //         loadChildren: async () => (await import('src/app/pages/artifact/artifact.component')).ROUTES,
        //     },
        // ],
    },
];
