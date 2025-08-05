import {Component, inject} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {HttpErrorResponse} from '@angular/common/http';
import {AuthService} from '@app/services/auth.service';
import {AuthStore} from '@app/store/auth.store';
import {environment} from '@environments/environment';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './navbar.layout.html',
  styleUrl: 'navbar.layout.css'
})
export class NavbarLayout {

  private authService = inject(AuthService);
  private router = inject(Router);

  private authStore = inject(AuthStore);

  protected logout() {
    const isLoggedIn = this.authStore.isLoggedIn();

    if (!isLoggedIn) {
      return;
    }

    const refresh_token = this.authStore.refreshToken();

    this.authService.logout(refresh_token).subscribe({
      next: (_response) => {
        this.authStore.logout();
        this.router.navigate(['/login']).then(_r => {
          console.log('goto LOGIN from navbar');
        });
      },
      error: (_err: HttpErrorResponse) => {
        this.authStore.logout();
        this.router.navigate(['/login']).then(_r => {
          console.log('goto LOGIN from navbar ERROR');
        });
      }
    });
  }

  protected readonly environment = environment;
}
