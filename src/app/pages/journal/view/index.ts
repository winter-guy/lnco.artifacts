import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        title: 'Journal',
        loadComponent: async () => (await import('./journal.component')).JournalComponent,
    },
];
