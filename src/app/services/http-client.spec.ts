import { TestBed } from '@angular/core/testing';

import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import Axios from 'axios';
import { config } from '../config/config';

import settings from '../../assets/settings.json';
import testvars from '../../assets/testvars.json'

const heroText = testvars.heroText;

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
      [
        {
          _id: '679c73650e0a691d64d20482',
          id: 'db892938-8b19-4565-a44f-9dcd1d5573da',
          name: heroText
        },
        {
          _id: '679c74470e0a691d64d20483',
          id: 'fb9da59f-569d-4e32-927a-8e489501d7f6',
          name: 'Aquaman VI'
        },
        {
          _id: '67d95774345155cd0ee5b7b9',
          id: '1da61156-369a-4c53-92f6-25a9f8d3bcb4',
          name: 'Chuck Norris X'
        },
        {
          _id: '67d957eb6d8a2a27b06264e4',
          id: 'f2fb84fe-72bd-4bbf-9b6d-833b279c1da1',
          name: 'Dr. Strange'
        },
        {
          _id: '67d9589b5409413c03e33dd6',
          id: '743f1aae-9b16-498b-85d4-9279b7fc18d7',
          name: 'Gregory Peck'
        },
        {
          _id: '67e2f6cdb02a1ad3d708ff94',
          id: 'dfab986f-b66d-40b0-a2e2-337b93d42aa8',
          name: 'Bish Fobo'
        },
        {
          _id: '67e3149089636207aa3ad74e',
          id: 'cac90bc0-70a5-401e-8252-e452b473ab95',
          name: 'Tyai Dyai'
        },
        {
          _id: '67e392002580b9ba141908c0',
          id: 'a2c0bfe0-6235-4ec0-97e5-6b0e7dd3b4e1',
          name: 'Iron man'
        },
        {
          _id: '67e3a4cb02d001c780f404d1',
          id: 'f6296c69-250f-4bc0-a8b5-1077bbf734e0',
          name: 'Blast Doe'
        },
        {
          _id: '67e3a5b602d001c780f404d2',
          id: '603e0f6d-262c-43fb-8e24-da7f3fca0f01',
          name: 'Brecht Sr'
        },
        {
          _id: '67e3a61702d001c780f404d3',
          id: 'e73a016b-1c40-4441-91b9-4bf5d21acf73',
          name: 'Bosh Fibi SR'
        },
        {
          _id: '67e4f52b5d28c9a4acca78ea',
          id: 'addba7e9-2f16-4bcf-a3d8-814f36bb7f84',
          name: 'Wonder Woman'
        },
        {
          _id: '67e662adaf51840228561200',
          id: 'e4e346a3-17c7-4d5b-b15b-8c174f7ef0e4',
          name: 'Dr. Strange'
        },
        {
          _id: '67e66344cd7b3ab57f26e816',
          id: 'badafde7-c3bd-4351-9bc8-551b6208e8ea',
          name: 'Wonder Woman'
        },
        {
          _id: '67e6634acd7b3ab57f26e817',
          id: '0f66baa0-4db4-4125-9d3e-4129e070f0ba',
          name: 'Wonder Woman'
        },
        {
          _id: '67e6658313f10467ac4d5ffb',
          id: '6002dafb-0776-4f46-afd1-a20b121298d3',
          name: 'Wonder Woman'
        },
        {
          _id: '67ed0d11ed1fc4c350e23718',
          id: 'f057e432-be0d-4499-a839-31c2d475f9e3',
          name: 'Plum Cake'
        },
        {
          _id: '680753434c394337b74df88e',
          id: '58f32dfa-f51b-4ad2-985d-c967d37738a4',
          name: 'Brad Pitt'
        },
        {
          "_id": "6819eb1852049258f4ec1ce6",
          "id": "23d66981-5d41-4250-b7d1-49950133181f",
          "name": "Brecht Jr"
        }
      ];
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

