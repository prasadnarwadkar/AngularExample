import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Hero } from '../services/hero';
import { HeroService } from '../services/hero.service';

@Component({
  selector: 'my-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {
  @Input() public hero: Hero | undefined;
  @Output() closeTheHeroSaveDlg = new EventEmitter<Hero>();
  error: any;
  navigated = false; // true if navigated here

  constructor(
    private router: Router,
    private heroService: HeroService,

    private route: ActivatedRoute
  ) { }


  async ngOnInit(): Promise<void> {
    if (this.route.snapshot.params != undefined) {
      const id = this.route.snapshot.params['id'];
      
      if (id !== undefined) {
        this.navigated = true;
        (await this.heroService.getHero(id)).subscribe((hero: any) => (this.hero = hero));
      } else {
        this.navigated = false;
        this.hero = new Hero();
      }
    }
    else {
      const id = this.route.snapshot.paramMap.get('id');
      if (id !== undefined) {
        this.navigated = true;
        (await this.heroService.getHero(id)).subscribe((hero: any) => (this.hero = hero));
      } else {
        this.navigated = false;
        this.hero = new Hero();
      }
    }
  }

  async save(): Promise<any> {
    if (this.hero && this.hero.name && this.hero.name.length > 0) {

      try{
        await this.heroService.saveHero(this.hero).then((res) => {
          this.goBack(this.hero as any);
        });
      }
      catch(error)
      {
        alert(error)
      }
    }
    else {
      alert('Name of the hero can\'t be blank');
      
    }
  }

  goBack(savedHero: Hero | undefined): void {
    console.log("Saved Hero is: " + JSON.stringify(savedHero));

    if (!savedHero) {
      this.closeTheHeroSaveDlg.emit(undefined);

      this.route.url.subscribe((val) => {
        if (val.length > 0)
        {
          if (val[0].path == "detail")
          {
            this.router.navigate(['/heroes']);
          }
        }
      },
      (error) => {
      });
    }
    else {
      
      this.closeTheHeroSaveDlg.emit(savedHero);
      this.router.navigate(['/heroes']);
    }
  }
}
