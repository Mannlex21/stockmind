import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
})
export class Register {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  isLoading = signal(false);

  registerForm = this.fb.nonNullable.group({
    companyName: ['', [Validators.required, Validators.minLength(2)]],
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      // Simulación de creación de cuenta
      setTimeout(() => {
        console.log('Register Payload:', this.registerForm.getRawValue());
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      }, 1500);
    }
  }
}
