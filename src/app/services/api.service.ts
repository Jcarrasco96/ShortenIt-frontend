import {Injectable} from '@angular/core';
import {environment} from '@environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {TokenService} from '@app/services/token.service';
import {AuthManagerService} from '@app/services/auth-manager.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl: string = environment.baseUrl;

  constructor(
    private authManagerService: AuthManagerService,
    private tokenService: TokenService,
    private http: HttpClient
  ) { }

  get(url: string, params = {}): Observable<any> {
    return this.http.get(`${this.baseUrl}/${url}`, {
      params,
      headers: this.authHeaders()
    }).pipe(catchError(err => this.handleAuthError(err)));
  }

  post(url: string, body: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${url}`, body, {
      headers: this.authHeaders()
    });
  }

  put(url: string, body: any = {}): Observable<any> {
    return this.http.put(`${this.baseUrl}/${url}`, body, {
      headers: this.authHeaders()
    });
  }

  delete(url: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${url}`, {
      headers: this.authHeaders()
    });
  }

  private authHeaders(): HttpHeaders {
    let headers = new HttpHeaders();

    if (this.tokenService.getToken()) {
      headers = headers.set('Authorization', `Bearer ${this.tokenService.getToken()}`);
    }

    return headers;
  }

  private handleAuthError(err: any) {
    const isTokenError = err.status === 401 && err.error?.message?.toLowerCase().includes('expired');

    if (isTokenError) {
      this.authManagerService.logout();
      return throwError(() => new Error('Token expirado'));
    }

    return throwError(() => err);
  }

}
