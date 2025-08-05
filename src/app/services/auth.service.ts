import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {LoginResponse} from '@app/interfaces/responses/login-response';
import {GenericResponse} from '@app/interfaces/responses/generic-response';
import {ApiService} from '@app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiService = inject(ApiService);

  login(email: string, password: string): Observable<LoginResponse> {
    return this.apiService.post('v1/auth/login', { email, password });
  }

  logout(refresh_token: string | null): Observable<GenericResponse | null> {
    return this.apiService.post('v1/auth/logout', { refresh_token });
  }

}
