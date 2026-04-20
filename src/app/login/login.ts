
// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
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

//   login(): void {
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

  // 👁 Password visibility control
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

  // 👁 Toggle password show / hide
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