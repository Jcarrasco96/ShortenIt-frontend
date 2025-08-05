import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {loadedAnimation} from '@app/animations/loaded.animation';
import {HttpErrorResponse} from '@angular/common/http';
import {AuthService} from '@app/services/auth.service';
import {AuthStore} from '@app/store/auth.store';
import {environment} from '@environments/environment';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  animations: [loadedAnimation]
})
export class LoginComponent {

  private fb = inject(FormBuilder);

  private authService = inject(AuthService);

  private authStore = inject(AuthStore);

  private router = inject(Router);

  protected loginForm: FormGroup;
  protected loading = false;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  protected onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.loginForm.disable();

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (res) => {
        this.loading = false;
        this.loginForm.enable();
        this.authStore.login(res);
        this.router.navigate(['/home']).then(_r => {

        });
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.loginForm.enable();

        this.loginForm.get('password')?.setErrors({
          customError: err?.error?.message || 'Unknown error.'
        });
        this.loginForm.get('password')?.markAsTouched();
      }
    });
  }

  protected readonly environment = environment;
}
