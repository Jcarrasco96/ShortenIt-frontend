import {BehaviorSubject} from 'rxjs';
import {TokenService} from '@app/services/token.service';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthManagerService {

  private loggedIn = new BehaviorSubject<boolean>(false);

  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(
    private tokenService: TokenService
  ) {}

  login(token: string) {
    this.loggedIn.next(true);
    this.tokenService.setToken(token)
    sessionStorage.setItem('auth', 'true');
  }

  logout() {
    sessionStorage.removeItem('auth');
    this.tokenService.clearToken();
    this.loggedIn.next(false);
  }

  checkLocalAuth(): void {
    const isAuth = sessionStorage.getItem('auth') === 'true';
    this.loggedIn.next(isAuth);
  }

}
