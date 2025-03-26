import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Hero } from '../services/hero';
import { HeroService } from '../services/hero.service';

import { MatTableDataSource } from '@angular/material/table';
import { LoaderService } from '../services/loader.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'my-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  [x: string]: any;
  heroes: Hero[] | undefined;
  ds!: MatTableDataSource<Hero, MatPaginator>;
  loading$ = this.loader.isLoading$;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  heroService = inject(HeroService);

  selectedHero: Hero | undefined;
  addingHero = false;
  error: any;
  showNgFor = false;
  displayedColumns = [ "name"];

  constructor(private router: Router, private route: ActivatedRoute,
    private loader: LoaderService) {
      console.log('HeroesComponent constructor');
  }

  ngAfterViewInit() {

  }



  async getHeroes(): Promise<void> {
    await (await this.heroService
      .getHeroesUsingHttpClient())
      .subscribe(
        (heroes: any) => {
          this.heroes = heroes as any;

          this.ds = new MatTableDataSource<Hero, MatPaginator>(this.heroes);
          this.ds.paginator = this.paginator;
        },
        (error: any) => (this.error = error)
      );
  }

  addHero(): void {
    this.addingHero = true;
    this.selectedHero = undefined;
  }

  closedSaveHeroDlg(savedHero: Hero): void {
    this.addingHero = false;
    if (savedHero) {
      //window.location.reload();
      this.getHeroes();
    }
  }

  deleteHero(hero: Hero, event: any): void {
    event.stopPropagation();
    this.heroService.delete(hero).subscribe((res: any) => {
      this.heroes = this.heroes?.filter(h => h !== hero);
      if (this.selectedHero === hero) {
        this.selectedHero = undefined;
      }
    }, (error: any) => (this.error = error));
  }

  async ngOnInit(): Promise<void> {
    //await this.getHeroes();
    console.log('HeroesComponent OnInit');

    this.route.paramMap.subscribe(async params => {

      //await this.getHeroes();

    });
  }


  ngOnDestroy() {
    console.log('HeroesComponent OnDestroy');
  }
  onSelect(hero: Hero): void {
    this.selectedHero = hero;
    this.addingHero = false;
  }

  gotoDetail(add: boolean): void {
    if (add) {
      this.router.navigate(['/detail']);
    }
    else {
      this.router.navigate(['/detail', this.selectedHero?.id]);
    }

  }
}
