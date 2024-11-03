import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CsvService } from './csv-service.service';
import { Game } from './game';
import { DropDownGame } from './dropdown-game';

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
  showAlert = false;
  price = 0;
  dropdownList: DropDownGame[] = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};

  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'appid',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 15,
      allowSearchFilter: true,
      allowRemoteDataSearch: true,
      enableCheckAll: false
      // limitSelection: 3 // Change this based on the # of games we want as input
    };

    this.csvService.getDropDownGames().subscribe((data: DropDownGame[]) => {
      this.dropdownList = data;
    });
  }

  constructor(private formBuilder: FormBuilder, private csvService: CsvService) {
    this.gameSelectorForm = this.formBuilder.group({
      price: ['', [Validators.required]]
    });
  }

  // Getter for easy access to form fields
  get f() { return this.gameSelectorForm.controls; }

  onItemSelect(item: any) {
    console.log(item);
  }

  // Handle form submission
  async onSubmit() {
    this.submitted = true;

    // If form is invalid, exit the function
    if (this.gameSelectorForm.invalid || this.selectedItems.length === 0 || this.selectedItems.length > 3) {
      return;
    }

    // Placeholder for server-side authentication logic (mock)
    const names = (this.selectedItems as DropDownGame[]).map((item) => item.name);
    const price = this.gameSelectorForm.value.price;

    // Do prediction here
    console.log("Do prediction here...");
  }

  updatePrice(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.price = +input.value; // Update the price property
  }

}
