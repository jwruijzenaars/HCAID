import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CsvService } from './csv-service.service';
import { DropDownGame } from './dropdown-game';
import { Category } from './category';
import { Platform } from './platform';
import { Router } from '@angular/router';

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
  platformList: Platform[] = [];
  categoriesList: Category[] = [];
  selectedPlatforms = [];
  selectedCategories = [];
  gameddSettings: IDropdownSettings = {};
  platformddSettings: IDropdownSettings = {};
  categoriesddSettings: IDropdownSettings = {};

  ngOnInit() {
    this.platformddSettings = {
      singleSelection: false,
      idField: 'platform',
      textField: 'platform',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 15,
      allowSearchFilter: true,
      allowRemoteDataSearch: true,
      enableCheckAll: false
    };

    this.categoriesddSettings = {
      singleSelection: false,
      idField: 'category',
      textField: 'category',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 15,
      allowSearchFilter: true,
      allowRemoteDataSearch: true,
      enableCheckAll: false
    };

    this.csvService.getCategories().subscribe((data: Category[]) => {
      this.categoriesList = data;
    });

    this.csvService.getPlatforms().subscribe((data: Platform[]) => {
      this.platformList = data;
    });
  }

  constructor(private formBuilder: FormBuilder, private csvService: CsvService, private router: Router) {
    this.gameSelectorForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      price: ['', [Validators.required]]
    });
  }

  // Getter for easy access to form fields
  get f() { return this.gameSelectorForm.controls; }

  onItemSelect(item: any) {
    console.log(item);
  }

  onPlatformSelect(item: any) {
    console.log(item);
  }

  onCategorySelect(item: any) {
    console.log(item);
  }

  // Handle form submission
  async onSubmit() {
    this.submitted = true;

    // If form is invalid, exit the function
    if (this.gameSelectorForm.invalid) {
      return;
    }

    // Placeholder for server-side authentication logic (mock)
    const title = this.gameSelectorForm.value.title;
    const platforms = (this.selectedPlatforms as Platform[]).map((item) => item.platform);
    const categories = (this.selectedCategories as Category[]).map((item) => item.category);
    const price = this.gameSelectorForm.value.price;

    // Do prediction here
    console.log("Do prediction here...");

    // Mock prediction response
    const prediction = {
      result: true, // Example: Positive prediction
      confidence: 82, // Example confidence
      featureImportance: [
        { name: 'Title', percentage: 40 },
        { name: 'Categories', percentage: 30 },
        { name: 'Platforms', percentage: 20 },
        { name: 'Price', percentage: 10 }
      ],
      title,
      platforms,
      categories,
      price
    };

    // Navigate to the ResultComponent with data
    this.router.navigate(['/prediction-result'], { state: { data: prediction } });
  }

  updatePrice(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.price = +input.value; // Update the price property
  }

}
