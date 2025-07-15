import {bootstrapApplication} from '@angular/platform-browser';
import {App} from '@app/app';
import {
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from '@app/app.routes';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideHttpClient} from '@angular/common/http';
import {provideToastr} from 'ngx-toastr';
import {AuthManagerService} from '@app/services/auth-manager.service';

bootstrapApplication(App, {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideToastr(),
    provideAnimations(),
    provideAppInitializer(() => {
      const authManagerService = inject(AuthManagerService);
      return authManagerService.checkLocalAuth();
    }),
    provideHttpClient()
  ]
}).catch((err) => console.error(err));
