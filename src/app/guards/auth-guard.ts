import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {TokenService} from '@app/services/token.service';

export const authGuard: CanActivateFn = (route, state) => {
  if (state.url.startsWith('/link/')) {
    return true;
  }

  const router = inject(Router);
  const tokenService = inject(TokenService);

  const isLoggedIn = sessionStorage.getItem('auth') === 'true' && tokenService.getToken() != null;

  return isLoggedIn ? true : router.parseUrl('/login');
};
