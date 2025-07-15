import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {AuthManagerService} from '@app/services/auth-manager.service';
import {loadedAnimation} from '@app/animations/loaded.animation';
import {HttpErrorResponse} from '@angular/common/http';
import {AuthService} from '@app/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
  animations: [loadedAnimation]
})
export class Login implements OnInit {

  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authManagerService: AuthManagerService,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.authManagerService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate(['/home']).then(_r => {
          console.log('goto HOME from LOGIN component');
        });
      }
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: async (_res) => {
        this.loading = false;

        await this.router.navigate(['/home']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;

        this.loginForm.get('password')?.setErrors({
          customError: err?.error?.message || 'Unknown error.'
        });
        this.loginForm.get('password')?.markAsTouched();
      }
    });
  }

}
