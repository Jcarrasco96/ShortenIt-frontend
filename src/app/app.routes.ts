import {Routes} from '@angular/router';
import {Login} from './pages/login/login';
import {Home} from './pages/home/home';
import {authGuard} from './guards/auth-guard';
import {LinkRedirectComponent} from '@app/pages/link-redirect/link-redirect.component';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'link/:code',
    component: LinkRedirectComponent,
  },
  {
    path: 'home',
    component: Home,
    canActivate: [authGuard],
  },
  // {
  //   path: '',
  //   component: Home,
  //   canActivate: [authGuard],
  // },

  {
    path: '**',
    redirectTo: '/login'
  }
];
