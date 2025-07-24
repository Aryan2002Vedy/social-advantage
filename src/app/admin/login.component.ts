import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-wrapper">
      <form [formGroup]="loginForm" (ngSubmit)="login()">
        <h2>Admin Login</h2>
        <input type="email" formControlName="email" placeholder="Email" />
        <input type="password" formControlName="password" placeholder="Password" />
        <button type="submit">Login</button>
        <div *ngIf="error" class="error-msg">{{ error }}</div>
      </form>
    </div>
  `,
  styles: [`
    .login-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    form {
      width: 300px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    input {
      padding: 10px;
      border-radius: 4px;
      border: 1px solid #ccc;
    }
    button {
      background-color: #d08888;
      color: #fff;
      padding: 10px;
      border: none;
      cursor: pointer;
      font-weight: bold;
    }
    .error-msg {
      color: red;
      font-size: 0.9rem;
    }
  `]
})
export class LoginComponent {
  loginForm : FormGroup;
  error = '';

  constructor(private fb: FormBuilder, private auth: Auth, private router: Router) {
  this.loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });
}

  login() {
    const { email, password } = this.loginForm.value;

    if (!email || !password) return;

    signInWithEmailAndPassword(this.auth, email, password)
      .then(() => this.router.navigate(['/admin']))
      .catch(err => this.error = 'Invalid credentials');
  }
}
