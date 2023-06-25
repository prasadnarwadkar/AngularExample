import { TestBed } from '@angular/core/testing';

import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import Axios from 'axios';
import { config } from '../config/config';

import settings from '../../assets/settings.json';

const apiBaseUrl = settings.apiBaseUrl;
console.log(apiBaseUrl);

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
        [{"_id":"6497dfaec418f507e459df9b","id":"281e3073-6d75-4021-aac3-1e9993b24a78","name":"Wonder woman"},{"_id":"6497dfb9c418f507e459df9c","id":"71b899df-3d44-4466-8a65-d9f120eb8fb1","name":"Spiderman"},{"_id":"6497dfc6c418f507e459df9d","id":"149d51aa-de0a-4ad8-95f4-5fd60e110779","name":"Magneto III"}];

        if (!config) {
            await Axios.get(`${apiBaseUrl}getherodirect`)
                .then(data => {
                    console.log(data.data);
                    // When observable resolves, result should match test data
                    expect(data.data).toEqual(expectedHeroes);
                }
                );
        }
        else {
            await Axios.get(`${config.apiBaseUrl}getherodirect`)
                .then(data => {
                    console.log(data.data);
                    // When observable resolves, result should match test data
                    expect(data.data).toEqual(expectedHeroes);
                }
                );
        }
    });
});

