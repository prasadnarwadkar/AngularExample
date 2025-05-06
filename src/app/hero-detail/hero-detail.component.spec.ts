import { ComponentFixture, TestBed } from '@angular/core/testing';
import { take, toArray } from 'rxjs/operators';

import { click, expectText, setFieldValue } from '../spec-helpers/element.spec-helper';
import { HeroDetailComponent } from './hero-detail.component';
import { HeroService } from '../services/hero.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import testvars from '../../assets/testvars.json'

const heroText = testvars.heroText;



describe('Hero Detail Tests', () => {
  var originalTimeout: number;
  let component: HeroDetailComponent;
  let fixture: ComponentFixture<HeroDetailComponent>;


  function expectTextToBeSetTo(text: string): void {
    expectText(fixture, 'hero-name-text', text);
  }

  //(await this.heroService.getHero(id)).subscribe((hero: any) => (this.hero = hero));
  const id = 'db892938-8b19-4565-a44f-9dcd1d5573da';
  let startText = 'Spiderman X 11';

  let routerStub: { navigate: any; };

  beforeEach(async () => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000; // Set timeout to 100 seconds
    routerStub = {
      navigate: jasmine.createSpy('navigate')
    }
    let httpClientSpy: jasmine.SpyObj<HttpClient>;


    await TestBed.configureTestingModule({
      declarations: [HeroDetailComponent],
      imports: [HttpClientTestingModule, HttpClientModule, FormsModule ],
      providers: [HeroService, HttpClient, {
        provide: ActivatedRoute, useValue: {
          paramMap: of({ get: (key: string) => key === 'id' ? id : null }),
          snapshot: { paramMap: { get: (key: string) => key === 'id' ? id : null } }
        }
      }, { provide: Window, useValue: window },
        { provide: Router, useValue: routerStub }]
    }).compileComponents();

    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
    const heroService = new HeroService(httpClientSpy);

    fixture = TestBed.createComponent(HeroDetailComponent);
    component = fixture.componentInstance;

    await heroService.getHeroesUsingAxios()
      .then(data => {
        console.log(data);
        var hero = data.find((hero: { id: string; }) => hero.id === id)
        component.hero = hero
        startText = component.hero?.name!
        fixture.detectChanges();
      }
      );

  });

  it('Save the Hero after edit', async () => {
    if (component.hero) {
      component.hero.name = heroText
      startText = component.hero.name
    }
    click(fixture, 'save-button');
    await sleep(2000);
    fixture.detectChanges();
    await sleep(2000);
    expect(routerStub.navigate).toHaveBeenCalledWith(['/heroes']);
  });


  it('displays the hero name', () => {
    expectTextToBeSetTo(startText);
  });

  function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  afterEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout; // Reset timeout
  });
});