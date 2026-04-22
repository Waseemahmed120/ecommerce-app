
// import { Routes } from '@angular/router';
// import { Login } from './login/login';
// import { MainLayout } from './layout/main-layout/main-layout';
// import { Users } from './pages/users/users';
// import { Posts } from './pages/posts/posts';
// import { PostDetail } from './pages/post-detail/post-detail';
// import { Cart } from './pages/cart/cart';
// import { Payment } from './pages/payment/payment';
// import { authGuard } from './auth-guard';

// export const routes: Routes = [
//   { path: 'login', component: Login },
//   {
//     path: 'dashboard',
//     component: MainLayout,
//     canActivate: [authGuard],
//     children: [
//       { path: 'users', component: Users },
//       { path: 'posts', component: Posts },                    
//       { path: 'product/:id', component: PostDetail },         
//       { path: 'cart', component: Cart },                     
//       { path: 'payment', component: Payment },                
//       { path: '', redirectTo: 'posts', pathMatch: 'full' }  
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
      { path: 'posts', component: Posts },
      { path: 'product/:id', component: PostDetail },
      { path: 'cart', component: Cart },
      { path: 'payment', component: Payment },
      { path: '', redirectTo: 'posts', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];