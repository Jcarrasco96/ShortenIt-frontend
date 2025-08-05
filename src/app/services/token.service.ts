import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';

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
