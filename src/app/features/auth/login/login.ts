import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  isLoading = signal(false);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      // Simulación de petición de autenticación
      setTimeout(() => {
        console.log('Login Payload:', this.loginForm.getRawValue());
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      }, 1500);
    }
  }
}
