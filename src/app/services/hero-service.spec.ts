import { TestBed, inject } from '@angular/core/testing';

import { HeroService } from './hero.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';

import testvars from '../../assets/testvars.json'

const heroText = testvars.heroText;

describe('HeroService', () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let heroService: HeroService;

  beforeEach(() => {


    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatPaginatorModule, HttpClientModule, MatToolbarModule, MatMenuModule],
      providers: [HeroService, { provide: HttpClient, useValue: httpClientSpy }, { provide: Window, useValue: window }]
    });

    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
    heroService = new HeroService(httpClientSpy);
  });

  it('should be created', inject([HeroService], (service: HeroService) => {
    expect(service).toBeTruthy();
  }));

  it('should return expected heroes from a call to the service which calls api "api/getherodirect"',
    inject([HeroService], async (service: HeroService) => {
      const expectedHeroes =
        [{ "id": "db892938-8b19-4565-a44f-9dcd1d5573da", "name": "Spiderman" }, { "id": "a2c0bfe0-6235-4ec0-97e5-6b0e7dd3b4e1", "name": "Iron man" }, { "id": "56aacfed-93e2-4cef-9efa-b71f60bdc5bd", "name": "Wonder Woman" }];

      await service.getHeroesUsingAxios()
        .then(data => {
          const mappedData = data.map((item: { name: string; id: string; }) => {
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
    }));
});

