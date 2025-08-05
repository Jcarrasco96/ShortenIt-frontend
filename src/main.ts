/// <reference types="@angular/localize" />

import {bootstrapApplication} from '@angular/platform-browser';
import {App} from '@app/app';
import {
  enableProdMode,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from '@app/app.routes';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {progressInterceptor} from 'ngx-progressbar/http';
import {AuthStore} from '@app/store/auth.store';
import {environment} from '@environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(App, {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideAppInitializer(() => {
      const authStore = inject(AuthStore);

      authStore.initAuth();
    }),
    provideHttpClient(withFetch(), withInterceptors([progressInterceptor])),
  ]
}).catch((err) => console.error(err));
