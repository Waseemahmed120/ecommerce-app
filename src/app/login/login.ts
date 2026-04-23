
// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import {
//   ReactiveFormsModule,
//   FormBuilder,
//   Validators,
//   FormGroup
// } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AuthService } from '../auth';

// @Component({
//   standalone: true,
//   selector: 'app-login',
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './login.html',
//   styleUrl: './login.css'
// })
// export class Login {

//   loginForm!: FormGroup;
//   errorMessage = '';

//   showPassword = false;

//   constructor(
//     private fb: FormBuilder,
//     private router: Router,
//     private auth: AuthService
//   ) {
//     this.loginForm = this.fb.group({
//       username: ['', Validators.required],
//       password: ['', Validators.required]
//     });
//   }

//   togglePassword(): void {
//     this.showPassword = !this.showPassword;
//   }

//   login(): void {
//     if (this.loginForm.invalid) return;

//     const { username, password } = this.loginForm.value;

//     if (this.auth.login({ username, password })) {
//       this.router.navigateByUrl('/dashboard', { replaceUrl: true });
//     } else {
//       this.errorMessage = 'Invalid username or password';
//     }
//   }
// }











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
  styleUrl: './login.css'
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
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.value;

    if (this.auth.login({ username, password })) {
      this.router.navigateByUrl('/dashboard', { replaceUrl: true });
    } else {
      this.errorMessage = 'Invalid username or password';
    }
  }

  get usernameControl() {
    return this.loginForm.get('username');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }
}