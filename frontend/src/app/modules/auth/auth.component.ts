import { Component } from '@angular/core';
import { FormsModule,NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
@Component({
  selector: 'app-auth',
    imports: [FormsModule,CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  mode: 'login' | 'register' = 'login';
  email = '';
  password = '';
  confirmPassword = '';
 
  loading = false;
  errorMessage = '';
  successMessage = '';
 
  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['app/dashboard']);
    }}
  switchMode(mode: 'login' | 'register'): void {
    this.mode = mode;
    this.errorMessage = '';
    this.successMessage = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
  }
 
  onSubmit(form: NgForm): void {
    if (form.invalid) return;
 
    if (this.mode === 'register' && this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match!!!';
      return;
    }
 
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
 
    const payload = { email: this.email, password: this.password };
 
    if (this.mode === 'login') {
      this.authService.login(payload).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['app/dashboard']);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error || 'Login failed! Please try again!!!';
        }
      });
    } else {
      this.authService.register(payload).subscribe({
        next: (res) => {
          this.loading = false;
          this.successMessage = res.message || 'Registered successfully! Please log in!!!';
          setTimeout(() => this.switchMode('login'), 1500);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error || 'Registration failed! Please try again!!!';
        }
      });
    }
  }
}

