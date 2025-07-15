import {Component} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {Navbar} from '@app/layouts/navbar/navbar';
import {AuthManagerService} from '@app/services/auth-manager.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  isLoggedIn = false;

  constructor(
    private router: Router,
    private authManagerService: AuthManagerService
  ) {
    this.authManagerService.isLoggedIn$.subscribe(value => {
      this.isLoggedIn = value;
    });
  }

  isLoginRoute(): boolean {
    return this.router.url === '/login';
  }

}
