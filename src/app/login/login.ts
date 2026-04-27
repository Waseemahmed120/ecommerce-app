import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'] // Will contain only animations
})
export class Login {

  loginForm!: FormGroup;
  errorMessage = '';

  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get usernameControl() {
    return this.loginForm.get('username');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;

    if (this.auth.login({ username, password })) {
      this.router.navigateByUrl('/dashboard', { replaceUrl: true });
    } else {
      this.errorMessage = 'Invalid username or password';
    }
  }
}