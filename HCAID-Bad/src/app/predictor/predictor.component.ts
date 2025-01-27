import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CsvService } from './csv-service.service';
import { DropDownGame } from './dropdown-game';
import { Category } from './category';
import { Platform } from './platform';
import * as tf from '@tensorflow/tfjs';
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
  gameList: DropDownGame[] = [];
  platformList: Platform[] = [];
  categoriesList: Category[] = [];
  selectedGames = [];
  selectedPlatforms = [];
  selectedCategories = [];
  gameddSettings: IDropdownSettings = {};
  platformddSettings: IDropdownSettings = {};
  categoriesddSettings: IDropdownSettings = {};
  nameNumericalData: any;
  priceNumericalData: any;

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

    this.csvService.getGameNameStats().subscribe((data: any) => {
      this.nameNumericalData = data
    });

    this.csvService.getGamePriceStats().subscribe((data: any) => {
      this.priceNumericalData = data;
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
    console.log("Form submitted");
    // If form is invalid, exit the function
    if (this.gameSelectorForm.invalid) {
      return;
    }

    const title = this.gameSelectorForm.value.title as string;
    const platforms = (this.selectedPlatforms as Platform[]).map((item) => item.platform);
    const categories = (this.selectedCategories as Category[]).map((item) => item.category);
    const price = this.gameSelectorForm.value.price as number;

    const preparedData = this.prepareData(title, platforms, categories, price);
    const pred_result = this.doPrediction(preparedData);

    const prediction = {
      result: pred_result,
      title,
      platforms,
      categories,
      price
    };

    // Navigate to the ResultComponent with data
    this.router.navigate(['/prediction-result'], { state: { data: prediction } });
  }

  prepareData(title: string, platforms: string[], categories: string[], price: number): any {
    // Placeholder for data preparation logic
    console.log("Preparing data");
    // Prepare data for prediction, convert text to numerical values(title), and one hot encode categorical data(categories, platforms)
    // Convert text to numerical values (title)
    const titleNumerical = title.length;

    // One hot encode categorical data (platforms, categories)
    const platformsOneHot = this.computeTfidf(platforms, this.platformList.map((item) => item.platform));
    const categoriesOneHot = this.computeTfidf(categories, this.categoriesList.map((item) => item.category));

    // Normalize the price
    const normalisedPrice = (price - this.priceNumericalData.mean) / this.priceNumericalData.std;

    // Normalize the title
    const normalisedTitle = (titleNumerical - this.nameNumericalData.mean) / this.nameNumericalData.std;

    // Combine all prepared data
    const preparedData = [
      normalisedTitle,
      ...platformsOneHot,
      ...categoriesOneHot,
      normalisedPrice
    ];

    const X = tf.tensor2d([preparedData], [1, preparedData.length]);
    console.log("Preprocessed Features (X_test_sampled):", X.toString());
    return X;
  }

  updatePrice(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.price = +input.value; // Update the price property
  }

  async doPrediction(data: any): Promise<boolean> {
    const model = await tf.loadLayersModel('assets/model.json');
    const prediction = model.predict(data);

    if (Array.isArray(prediction)) {
      const result = prediction[0].dataSync()[0] > 0.5;
      return result;
    } else {
      const result = prediction.dataSync()[0] > 0.5;
      return result;
    }
  }

  computeTfidf(inputTerms: string[], vocabulary: string[]): number[] {
    // Initialize the TF-IDF vector with zeros, one for each term in the vocabulary
    const tfidfVector = new Array(vocabulary.length).fill(0);

    // Iterate over the input terms
    inputTerms.forEach((term) => {
      const index = vocabulary.indexOf(term); // Find the index of the term in the vocabulary
      if (index !== -1) {
        tfidfVector[index] += 1; // Increment the frequency for that term
      }
    });

    // Normalize by the total number of input terms (basic TF normalization)
    const totalTerms = inputTerms.length;
    return tfidfVector.map((value) => (totalTerms > 0 ? value / totalTerms : 0));
  }



}
