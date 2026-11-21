import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'chat',
        loadComponent: () => import('./chat/chat.page').then((m) => m.ChatPage),
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
];