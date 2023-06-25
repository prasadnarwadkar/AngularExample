import { TestBed, inject } from '@angular/core/testing';

import { HeroService } from './hero.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';


describe('HeroService', () => {
    let httpClientSpy: jasmine.SpyObj<HttpClient>;
    let heroService: HeroService;

    beforeEach(() => {
        heroService = new HeroService(httpClientSpy);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule,MatPaginatorModule, HttpClientModule,  MatToolbarModule, MatMenuModule],
            providers: [HeroService, HttpClient, { provide: Window, useValue: window }]
        });
    });

    it('should be created', inject([HeroService], (service: HeroService) => {
        expect(service).toBeTruthy();
    }));

    it('should return expected heroes from a call to the service which calls api "api/getherodirect"', 
        inject([HeroService],  async (service: HeroService)  => {
        const expectedHeroes =
        [{"_id":"6497dfaec418f507e459df9b","id":"281e3073-6d75-4021-aac3-1e9993b24a78","name":"Wonder woman"},{"_id":"6497dfb9c418f507e459df9c","id":"71b899df-3d44-4466-8a65-d9f120eb8fb1","name":"Spiderman"},{"_id":"6497dfc6c418f507e459df9d","id":"149d51aa-de0a-4ad8-95f4-5fd60e110779","name":"Magneto III"}];

        await service.getHeroesUsingAxios()
            .then(data => {
                console.log(data);
                // When observable resolves, result should match test data
                expect(data).toEqual(expectedHeroes);
            }
            );
    }));
});

