import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthStore} from '@app/store/auth.store';

export const authGuard: CanActivateFn = (route, state) => {
  if (route.data['public']) {
    return true;
  }

  const router = inject(Router);
  const authStore = inject(AuthStore);

  return !!authStore.accessToken() ? true : router.parseUrl('/login');
};
