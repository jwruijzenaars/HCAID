import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Game } from './game';
import { DropDownGame } from './dropdown-game';
import { Category } from './category';
import { Platform } from './platform';

@Injectable({
  providedIn: 'root'
})
export class CsvService {
  private csvUrl = 'assets/steam.csv';

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    // read a csv file and return the list of categories
    console.log('Reading the csv file');

    return this.http.get(this.csvUrl, { responseType: 'text' }).pipe(
      map(data => this.csvToCategoryArray(data))
    );
  }

  csvToCategoryArray(data: string): any {
    const lines = data.split('\n');
    const result: Category[] = [];
    const headers = lines[0].split(',');

    console.log('Headers: ', headers);

    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].split(',');

      if (currentLine.length !== headers.length) {
        continue;
      }

      // split the categories by ;
      const categories = currentLine[headers.indexOf('categories')].split(';');

      // check if the category is already in the result
      for (const category of categories) {
        const newCategory: Category = {
          category: category.trim()
        };

        if (!result.some((item) => item.category === newCategory.category)) {
          result.push(newCategory);
        }
      }
    }
    return result;
  }

  getPlatforms(): Observable<Platform[]> {
    // read a csv file and return the list of platforms
    console.log('Reading the csv file');

    return this.http.get(this.csvUrl, { responseType: 'text' }).pipe(
      map(data => this.csvToPlatformArray(data))
    );
  }

  csvToPlatformArray(data: string): any {
    const lines = data.split('\n');
    const result: string[] = [];
    const headers = lines[0].split(',');

    console.log('Headers: ', headers);

    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].split(',');

      if (currentLine.length !== headers.length) {
        continue;
      }

      // split the platforms by ;
      const platforms = currentLine[headers.indexOf('platforms')].split(';');

      // check if the platform is already in the result
      for (const platform of platforms) {
        if (!result.includes(platform.trim())) {
          result.push(platform.trim());
        }
      }
    }
    return result;
  }


  getDropDownGames(): Observable<DropDownGame[]> {
    // read a csv file and return the list of games
    console.log('Reading the csv file');

    return this.http.get(this.csvUrl, { responseType: 'text' }).pipe(
      map(data => this.csvToDropDownArray(data))
    );
  }

  csvToDropDownArray(csv: string): DropDownGame[] {
    const lines = csv.split('\n');
    const result: DropDownGame[] = [];
    const headers = lines[0].split(',');

    console.log('Headers: ', headers);

    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].split(',');
      if (currentLine.length !== headers.length) {
        continue;
      }
      const game: DropDownGame = {
        appid: Number(currentLine[headers.indexOf('appid')].trim()),
        name: currentLine[headers.indexOf('name')].trim()
      };

      result.push(game);
    }
    return result;
  }

  getGames(): Observable<Game[]> {
    // read a csv file and return the list of games
    console.log('Reading the csv file');

    return this.http.get(this.csvUrl, { responseType: 'text' }).pipe(
      map(data => this.csvToArray(data))
    );

  }

  csvToArray(csv: string): Game[] {
    const lines = csv.split('\n');
    const result: Game[] = [];
    const headers = lines[0].split(',');
    headers[17] = headers[17].substring(0, headers[17].length - 1); // Remove the newline character from the last header

    console.log('Headers: ', headers);

    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].split(',');
      if (currentLine.length !== headers.length) {
        continue;
      }
      const game: Game = {
        appid: Number(currentLine[headers.indexOf('appid')].trim()),
        name: currentLine[headers.indexOf('name')].trim(),
        developer: currentLine[headers.indexOf('developer')].trim(),
        publisher: currentLine[headers.indexOf('publisher')].trim(),
        positive_ratings: Number(currentLine[headers.indexOf('positive_ratings')].trim()),
        negative_ratings: Number(currentLine[headers.indexOf('negative_ratings')].trim()),
        price: Number(currentLine[headers.indexOf('price')].trim().substring(0, currentLine[headers.indexOf('price')].trim().length - 1)), // Remove the newline character from the last character
        categories: currentLine[headers.indexOf('categories')].trim(),
        genres: currentLine[headers.indexOf('genres')].trim(),
        steamspy_tags: currentLine[headers.indexOf('steamspy_tags')].trim()
      };

      result.push(game);
    }
    return result;
  }

  getGameNameStats(): Observable<any> {
    return this.http.get(this.csvUrl, { responseType: 'text' }).pipe(
      map(data => this.csvToGameNameStats(data))
    );
  }

  csvToGameNameStats(data: string): any {
    // read a csv file and return the list name lengths as weel as mean and standard deviation
    const lines = data.split('\n');
    const headers = lines[0].split(',');
    headers[17] = headers[17].substring(0, headers[17].length - 1); // Remove the newline character from the last header

    const nameLengths = [];
    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].split(',');
      if (currentLine.length !== headers.length) {
        continue;
      }
      nameLengths.push(currentLine[headers.indexOf('name')].trim().length);
    }

    const mean = nameLengths.reduce((a, b) => a + b) / nameLengths.length;
    const std = Math.sqrt(nameLengths.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / nameLengths.length);

    return {
      mean,
      std
    };
  }

  getGamePriceStats(): Observable<any> {
    return this.http.get(this.csvUrl, { responseType: 'text' }).pipe(
      map(data => this.csvToGamePriceStats(data))
    );
  }

  csvToGamePriceStats(data: string): any {
    // read a csv file and return the list of prices as weel as mean and standard deviation
    const lines = data.split('\n');
    const headers = lines[0].split(',');
    headers[17] = headers[17].substring(0, headers[17].length - 1); // Remove the newline character from the last header

    const prices = [];
    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].split(',');
      if (currentLine.length !== headers.length) {
        continue;
      }
      prices.push(Number(currentLine[headers.indexOf('price')].trim().substring(0, currentLine[headers.indexOf('price')].trim().length - 1)));
    }

    const mean = prices.reduce((a, b) => a + b) / prices.length;
    const std = Math.sqrt(prices.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / prices.length);

    return {
      mean,
      std
    };
  }
}
