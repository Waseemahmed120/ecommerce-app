// import { Routes } from '@angular/router';
// import { Login } from './login/login';
// import { Sidebar } from './layout/sidebar/sidebar';
// import { Users } from './pages/users/users';
// import { Gallery } from './pages/gallery/gallery';
// import { authGuard } from '././auth-guard';

// export const routes: Routes = [
//   { path: 'login', component: Login },
//   {
//     path: 'dashboard',
//     component: Sidebar,
//     canActivate: [authGuard],
//     children: [
//       { path: 'users', component: Users },
//       { path: 'gallery', component: Gallery },
//       { path: '', redirectTo: 'users', pathMatch: 'full' }
//     ]
//   },
//   { path: '', redirectTo: 'login', pathMatch: 'full' },
//   { path: '**', redirectTo: 'login' }
// ];







import { Routes } from '@angular/router';
import { Login } from './login/login';
import { MainLayout } from './layout/main-layout/main-layout';
import { Users } from './pages/users/users';
import { Posts } from './pages/posts/posts';
import { PostDetail } from './pages/post-detail/post-detail';
import { Cart } from './pages/cart/cart';
import { Payment } from './pages/payment/payment';
import { authGuard } from './auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: 'dashboard',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: 'users', component: Users },
      { path: 'posts', component: Posts },                    // Renamed from gallery
      { path: 'product/:id', component: PostDetail },         // NEW: Product details
      { path: 'cart', component: Cart },                      // NEW: Cart page
      { path: 'payment', component: Payment },                // NEW: Payment page
      { path: '', redirectTo: 'posts', pathMatch: 'full' }    // Default to posts
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];