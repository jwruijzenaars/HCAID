import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  loginSuccess = false;
  errorMessage = '';

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],  // Email validation
      password: ['', [Validators.required, Validators.minLength(6)]]  // Password validation
    });
  }

  // Getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  // Handle form submission
  async onSubmit() {
    this.submitted = true;

    // If form is invalid, exit the function
    if (this.loginForm.invalid) {
      return;
    }

    // Placeholder for server-side authentication logic (mock)
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    // Use Authservice to login
    await this.authService.login(email, password).then((result) => {
      if (result) {
        this.loginSuccess = true;
        this.errorMessage = '';
      } else {
        this.loginSuccess = false;
        this.errorMessage = 'Invalid email or password. Please try again.';
      }
    });
  }
}