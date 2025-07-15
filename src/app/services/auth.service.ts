import {Injectable} from '@angular/core';
import { Observable, tap} from 'rxjs';
import {ApiService} from '@app/services/api.service';
import {LoginResponse} from '@app/interfaces/login-response';
import {AuthManagerService} from '@app/services/auth-manager.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private apiService: ApiService,
    private authManagerService: AuthManagerService
  ) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.apiService.post('v1/auth/login', {
      username: username,
      password: password
    }).pipe(
      tap((response: LoginResponse) => {
        this.authManagerService.login(response.token);
      })
    );
  }

}
