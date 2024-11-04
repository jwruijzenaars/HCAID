import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  registerSuccess = false;
  errorMessage = '';

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', Validators.required],
      dob: ['', Validators.required],
      income: ['', Validators.required],
      married: ['', Validators.required],
      children: ['', Validators.required],
      education: ['', Validators.required],
      occupation: ['', Validators.required],
      gender: ['', Validators.required],
    });
  }

  // Getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  // Handle form submission
  async onSubmit() {
    this.submitted = true;

    // If form is invalid, exit the function
    if (this.registerForm.invalid) {
      return;
    }

    // Placeholder for server-side authentication logic (mock)
    const email = this.registerForm.value.email;
    const password = this.registerForm.value.password;

    // Use Authservice to register
    await this.authService.register(email, password).then((result) => {
      if (result) {
        this.registerSuccess = true;
        this.errorMessage = '';
        this.router.navigate(['/']);
      } else {
        this.registerSuccess = false;
        this.errorMessage = 'Email already exists. Please try again.';
      }
    });
  }
}
