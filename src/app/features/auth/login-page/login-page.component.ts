import { Component, inject, signal, WritableSignal } from '@angular/core';
import {
  MatError,
  MatFormField,
  MatInput,
  MatInputModule,
  MatLabel,
} from '@angular/material/input';
import { MatCard } from '@angular/material/card';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [
    MatFormField,
    MatInputModule,
    MatLabel,
    MatCard,
    ReactiveFormsModule,
    MatButton,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  error: WritableSignal<string> = signal('');

  form = this.fb.group({
    username: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9_ ]*')]],
    password: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9_ ]*')]],
  });

  submit(): void {
    const { username, password } = this.form.value;
    if (!username || !password) {
      return;
    }
    this.authService.login(username, password).subscribe({
      next: () => this.router.navigate(['/users']),
      error: (err: HttpErrorResponse) => this.error.set(err?.error?.message),
    });
  }
}
