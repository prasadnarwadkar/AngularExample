import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Hero } from './hero';
import { config } from '../config/config';
import Axios, { AxiosResponse } from 'axios';
import settings from '../../assets/settings.json';
import axios from 'axios';

const apiBaseUrl = settings.apiBaseUrl;

@Injectable()
export class HeroService {
  private heroesUrl = 'app/heroes'; // URL to web api
  public add_subject = new Subject<String>()

  constructor(private http: HttpClient) { }

  async getHeroesUsingHttpClient() {

    return this.http
      .get(`${apiBaseUrl}gethero`)
      .pipe(map(data => (data as any).data), catchError(this.handleError));

  }

  saveHero = async (hero: Hero) => {
    try {
      let data = {};  
      let response: AxiosResponse<any>;

      if (hero.id) {
        data = JSON.stringify({
          "heroItem": {
            "name": hero.name,
            "id": hero.id
          }
        });

        response = await axios.post(`${apiBaseUrl}updateHero`, data, {
          headers: {
            'accept': '*/*',
            'Content-Type': 'application/json'
          }
        });
      }
      else {
        data = JSON.stringify({
          "heroItem": {
            "name": hero.name
          }
        });

        response = await axios.post(`${apiBaseUrl}addHero`, data, {
          headers: {
            'accept': '*/*',
            'Content-Type': 'application/json'
          }
        });
      }

      return response.data;
    } catch (error) {
      console.error("Error saving hero:", error);
      throw error;
    }
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
    let promise = await this.getHeroesUsingHttpClient();
    return promise.pipe(
      map(heroes => (heroes as any).find((hero: { id: any; }) => hero.id == id))
    );
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
