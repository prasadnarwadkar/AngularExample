import { TestBed } from '@angular/core/testing';

import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import Axios from 'axios';
import { config } from '../config/config';

import settings from '../../assets/settings.json';
import testvars from '../../assets/testvars.json'

const heroText = testvars.heroText;

const apiBaseUrl = settings.apiBaseUrl;


describe('Http Calls to API directly', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,]
    });

    // Inject the http service and test controller for each test
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should return expected heroes from api call to "api/getherodirect"', async () => {
    const expectedHeroes =
      [{ "id": "db892938-8b19-4565-a44f-9dcd1d5573da", "name": "Spiderman" }, { "id": "a2c0bfe0-6235-4ec0-97e5-6b0e7dd3b4e1", "name": "Iron man" }, { "id": "56aacfed-93e2-4cef-9efa-b71f60bdc5bd", "name": "Wonder Woman" }];
    if (!config) {
      await Axios.get(`${apiBaseUrl}getherodirect`)
        .then(data => {

          // When observable resolves, result should match test data
          // When observable resolves, result should match test data
         const mappedData = data.data.map((item: { name: string; id: string; }) => {
            return {
              name: item.name,
              id: item.id
            };
          });

          const mappedExpectedData = expectedHeroes.map((item: { name: string; id: string; }) => {
            return {
              name: item.name,
              id: item.id
            };
          });

          expect(mappedData).toEqual(mappedExpectedData);
        }
        );
    }
    else {
      await Axios.get(`${config.apiBaseUrl}getherodirect`)
        .then(data => {
          // When observable resolves, result should match test data
         const mappedData = data.data.map((item: { name: string; id: string; }) => {
            return {
              name: item.name,
              id: item.id
            };
          });

          const mappedExpectedData = expectedHeroes.map((item: { name: string; id: string; }) => {
            return {
              name: item.name,
              id: item.id
            };
          });

          expect(mappedData).toEqual(mappedExpectedData);
        }
        );
    }
  });
});

