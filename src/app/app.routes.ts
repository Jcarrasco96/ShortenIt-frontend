import {Routes} from '@angular/router';
import {authGuard} from './guards/auth-guard';
import {LoginComponent} from '@app/pages/login/login.component';
import {HomeComponent} from '@app/pages/home/home.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    //loadComponent: () => import('@app/pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login',
      public: true,
    },
    canActivate: [authGuard],
  },
  {
    path: 'link/:code',
    loadComponent: () => import('@app/pages/link-redirect/link-redirect.component').then(m => m.LinkRedirectComponent),
    data: {
      title: 'Link redirect',
      public: true,
    },
    canActivate: [authGuard],
    // resolve: {
    //   delay: DelayResolver
    // }
  },
  {
    path: 'home',
    component: HomeComponent,
    //loadComponent: () => import('@app/pages/home/home.component').then(m => m.HomeComponent),
    data: {
      title: 'Home',
      public: false,
    },
    canActivate: [authGuard],
  },
  {
    path: 'clients',
    loadComponent: () => import('@app/pages/client/client.component').then(m => m.ClientComponent),
    data: {
      title: 'Clients',
      public: false,
    },
    canActivate: [authGuard],
  },
  {
    path: 'certifications',
    loadComponent: () => import('@app/pages/client/client.component').then(m => m.ClientComponent),
    data: {
      title: 'Certifications',
      public: false,
    },
    canActivate: [authGuard],
  },
  {
    path: 'users',
    loadComponent: () => import('@app/pages/user/user.component').then(m => m.UserComponent),
    data: {
      title: 'Users',
      public: false,
    },
    canActivate: [authGuard],
  },
  {
    path: 'error/:code',
    loadComponent: () => import('@app/pages/error/error.component').then(m => m.ErrorComponent),
    data: {
      title: 'Error',
      public: true,
    },
    canActivate: [authGuard],
  },

  {
    path: '**',
    redirectTo: '/login'
  }
];
