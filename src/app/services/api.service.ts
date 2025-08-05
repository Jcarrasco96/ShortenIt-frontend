import {inject, Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, catchError, filter, finalize, Observable, switchMap, take, tap, throwError} from 'rxjs';
import {AuthErrorResponse} from '@app/interfaces/responses/auth-error-response';
import {LoginResponse} from '@app/interfaces/responses/login-response';
import {AuthStore} from '@app/store/auth.store';
import {ErrorStore} from '@app/store/error.store';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private authStore = inject(AuthStore);
  private errorStore = inject(ErrorStore);

  private http = inject(HttpClient);

  private isRefreshing = false;
  private refreshSubject = new BehaviorSubject<string | null>(null);

  get(endpoint: string, params = {}): Observable<any> {
    return this.request('GET', endpoint, null, { params });
  }

  post(endpoint: string, body: any): Observable<any> {
    return this.request('post', endpoint, body);
  }

  put(endpoint: string, body: any = {}): Observable<any> {
    return this.request('put', endpoint, body);
  }

  delete(endpoint: string): Observable<any> {
    return this.request('delete', endpoint);
  }

  private authHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (this.authStore.accessToken()) {
      headers = headers.set('Authorization', `Bearer ${this.authStore.accessToken()}`);
    }

    return headers;
  }

  private request(method: string, endpoint: string, body?: any, options: any = {}): Observable<any> {
    const headers = this.authHeaders();

    return this.http.request(method, `${environment.baseUrl}/${endpoint}`, { body, headers, ...options }).pipe(
      catchError(err => this.handleAuthError(err, method, endpoint, body, options))
    );
  }

  private handleAuthError(err: any, method: string, endpoint: string, body: any, options: any): Observable<any> {
    const authErrorResponse: AuthErrorResponse = err.error;

    const isTokenError = err.status === 401 && (
      authErrorResponse.message.toLowerCase().includes('token') ||
      authErrorResponse.message.toLowerCase().includes('header')
    );

    if (isTokenError) {
      if (!this.isRefreshing) {
        this.isRefreshing = true;
        this.refreshSubject.next(null);

        return this.refreshToken().pipe(
          switchMap(tokens => {
            this.authStore.setTokens(tokens);
            this.refreshSubject.next(tokens.access_token);
            return this.request(method, endpoint, body, options);
          }),
          catchError(error => {
            this.authStore.logout();
            this.errorStore.setError(err);
            return throwError(() => error);
          }),
          finalize(() => {
            this.isRefreshing = false;
          })
        );
      } else {
        return this.refreshSubject.pipe(
          filter(token => token !== null),
          take(1),
          switchMap(() => this.request(method, endpoint, body, options))
        );
      }
    }

    return throwError(() => err);
  }

  postNoHeaders(endpoint: string, body: any): Observable<any> {
    return this.http.post(`${environment.baseUrl}/${endpoint}`, body);
  }

  refreshToken(): Observable<LoginResponse> {
    const refresh_token = this.authStore.refreshToken();

    return this.postNoHeaders('v1/auth/refresh-token', { refresh_token }).pipe(
      tap((tokens: LoginResponse) => this.authStore.setTokens(tokens))
    );
  }

}
