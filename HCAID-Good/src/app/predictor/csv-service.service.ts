import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Game } from './game';
import { DropDownGame } from './dropdown-game';

@Injectable({
  providedIn: 'root'
})
export class CsvService {
  private csvUrl = 'assets/steam.csv';

  constructor(private http: HttpClient) { }

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
}
