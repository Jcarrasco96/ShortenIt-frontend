import {Injectable, signal} from '@angular/core';
import {LoginResponse} from '@app/interfaces/responses/login-response';

@Injectable({
  providedIn: 'root'
})
export class AuthStore {

  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';

  private _isLoggedIn = signal<boolean>(false);
  readonly isLoggedIn = this._isLoggedIn.asReadonly();

  constructor() {
    const auth = !!this.accessToken();
    this._isLoggedIn.set(auth);
  }

  login(loginResponse: LoginResponse): void {
    this.setTokens({
      access_token: loginResponse.access_token,
      refresh_token: loginResponse.refresh_token
    });

    this._isLoggedIn.set(true);
  }

  logout(): void {
    this.clearToken();
    this._isLoggedIn.set(false);
  }

  initAuth() {
    const auth = !!this.accessToken();
    this._isLoggedIn.set(auth);
  }

  accessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  refreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  setTokens(tokens: { access_token: string, refresh_token: string }) {
    localStorage.setItem(this.accessTokenKey, tokens.access_token);
    localStorage.setItem(this.refreshTokenKey, tokens.refresh_token);
  }

  clearToken() {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

}
