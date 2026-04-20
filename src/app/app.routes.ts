import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Sidebar } from './layout/sidebar/sidebar';
import { Users } from './pages/users/users';
import { Gallery } from './pages/gallery/gallery';
import { authGuard } from '././auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: 'dashboard',
    component: Sidebar,
    canActivate: [authGuard],
    children: [
      { path: 'users', component: Users },
      { path: 'gallery', component: Gallery },
      { path: '', redirectTo: 'users', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];