import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'profile', // Redirect to 'home' when the path is empty
        pathMatch: 'full',
    },
    {
        path: 'profile',
        title: 'Profile',
        loadComponent: async () => (await import('./profile/profile.component')).ProfileComponent,
    },
];
