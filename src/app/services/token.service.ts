import { Injectable } from '@angular/core';

const TOKEN_KEY = 'token.shorten.it';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() {}

  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  setToken(token: string) {
    sessionStorage.setItem(TOKEN_KEY, token);
  }

  clearToken() {
    sessionStorage.removeItem(TOKEN_KEY);
  }

}
