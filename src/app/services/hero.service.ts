import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Hero } from './hero';
import { config } from '../config/config';
import Axios from 'axios';
import settings from '../../assets/settings.json';

const apiBaseUrl = settings.apiBaseUrl;
console.log(apiBaseUrl);

@Injectable()
export class HeroService {
  private heroesUrl = 'app/heroes'; // URL to web api
  public add_subject = new Subject<String>()

  constructor(private http: HttpClient) { }

  async getHeroesUsingHttpClient() {

    return this.http
      .get(`${config.apiBaseUrl}getHero`)
      .pipe(map(data => (data as any).data), catchError(this.handleError));

  }

  async getHeroesUsingAxios(): Promise<any> {
    if (!config) {
      return await Axios.get(`${apiBaseUrl}getherodirect`)
        .then(data => { return data.data; });

    }
    else {
      return await Axios.get(`${config.apiBaseUrl}getherodirect`)
        .then(data => { return data.data; });
    }
  }

  async getHero(id: any): Promise<Observable<Hero>> {
    return await (await this.getHeroesUsingHttpClient()).pipe(
      map(heroes => (heroes as any).find((hero: { id: any; }) => hero.id == id))
    );
  }

  save(hero: Hero) {
    if (hero.id != undefined && hero.id.length > 0) {

      return this.http.post(`${config.apiBaseUrl}updateHero`, { "heroItem": { 'name': hero.name, 'id': hero.id } })
    }

    return this.http.post(`${config.apiBaseUrl}addHero`, { "heroItem": { 'name': hero.name } }) // Node.js API connecting to a MongoDB db.
  }

  delete(hero: Hero) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const url = `${this.heroesUrl}/${hero.id}`;

    return this.http.delete<Hero>(url).pipe(catchError(this.handleError));
  }



  private handleError(res: HttpErrorResponse | any) {
    console.error(res.error || res.body.error);
    return observableThrowError(res.error || 'Server error');
  }
}
