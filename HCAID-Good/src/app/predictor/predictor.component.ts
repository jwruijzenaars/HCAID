import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-predictor',
  templateUrl: './predictor.component.html',
  styleUrl: './predictor.component.css'
})
export class PredictorComponent {
  gameSelectorForm: FormGroup;
  submitted = false;
  predictionSuccess = false;
  errorMessage = '';
  price = 0;

  constructor(private formBuilder: FormBuilder) {
    this.gameSelectorForm = this.formBuilder.group({
      title: ['', [Validators.required]],  // Email validation
      price: ['', [Validators.required]]  // Password validation
    });
  }

  // Getter for easy access to form fields
  get f() { return this.gameSelectorForm.controls; }

  // Handle form submission
  async onSubmit() {
    this.submitted = true;

    // If form is invalid, exit the function
    if (this.gameSelectorForm.invalid) {
      return;
    }

    // Placeholder for server-side authentication logic (mock)
    const title = this.gameSelectorForm.value.title;
    const price = this.gameSelectorForm.value.price;

    // Do prediction here
    console.log("Do prediction here...");
  }

  updatePrice(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.price = +input.value; // Update the price property
  }

}
