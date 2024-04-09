import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        title: 'Artifact',
        loadComponent: async () => (await import('./article.component')).ArticleComponent,
    },
];
