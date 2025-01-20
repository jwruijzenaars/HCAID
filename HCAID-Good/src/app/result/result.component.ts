import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrl: './result.component.css'
})
export class ResultComponent {
  isPositive: boolean = true;
  confidence: number = 82;
  featureImportance: { name: string; percentage: number }[] = [];
  title = '';
  categories: string[] = [];
  platforms: string[] = [];
  price = 0;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { data: any };

    if (state?.data) {
      this.isPositive = state.data.result;
      this.confidence = state.data.confidence;
      this.featureImportance = state.data.featureImportance;
      this.title = state.data.title;
      this.categories = state.data.categories;
      this.platforms = state.data.platforms;
      this.price = state.data.price;
    }
  }
}
