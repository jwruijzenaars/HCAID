import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CsvService } from './csv-service.service';
import { DropDownGame } from './dropdown-game';
import { Category } from './category';
import { Platform } from './platform';

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
  gameList: DropDownGame[] = [];
  platformList: Platform[] = [];
  categoriesList: Category[] = [];
  selectedGames = [];
  selectedPlatforms = [];
  selectedCategories = [];
  gameddSettings: IDropdownSettings = {};
  platformddSettings: IDropdownSettings = {};
  categoriesddSettings: IDropdownSettings = {};

  ngOnInit() {
    this.gameddSettings = {
      singleSelection: false,
      idField: 'appid',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 15,
      allowSearchFilter: true,
      allowRemoteDataSearch: true,
      enableCheckAll: false
    };

    this.platformddSettings = {
      singleSelection: false,
      idField: 'genre',
      textField: 'genre',
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

    this.csvService.getDropDownGames().subscribe((data: DropDownGame[]) => {
      this.gameList = data;
    });

    this.csvService.getCategories().subscribe((data: Category[]) => {
      this.categoriesList = data;
    });

    this.csvService.getPlatforms().subscribe((data: Platform[]) => {
      this.platformList = data;
    });
  }

  constructor(private formBuilder: FormBuilder, private csvService: CsvService) {
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
    if (this.gameSelectorForm.invalid || this.selectedGames.length === 0 || this.selectedGames.length > 3) {
      return;
    }

    // Placeholder for server-side authentication logic (mock)
    const names = (this.selectedGames as DropDownGame[]).map((item) => item.name);
    const platforms = (this.selectedPlatforms as Platform[]).map((item) => item.platform);
    const categories = (this.selectedCategories as Category[]).map((item) => item.category);
    const price = this.gameSelectorForm.value.price;

    // Do prediction here
    console.log("Do prediction here...");
  }

  updatePrice(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.price = +input.value; // Update the price property
  }

}
