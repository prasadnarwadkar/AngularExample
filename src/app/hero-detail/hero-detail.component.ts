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
  @Input() hero: Hero | undefined;
  @Output() closeTheHeroSaveDlg = new EventEmitter<Hero>();
  error: any;
  navigated = false; // true if navigated here

  constructor(
    private router: Router,
    private heroService: HeroService,

    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    //('detail');
    this.route.params.forEach(async (params: Params) => {
      if (params['id'] !== undefined) {
        const id = params['id'];
        this.navigated = true;
        (await this.heroService.getHero(id)).subscribe((hero: any) => (this.hero = hero));
      } else {
        this.navigated = false;
        this.hero = new Hero();
      }
    });
  }

  save(): void {
    //alert('saving');
    if (this.hero && this.hero.name && this.hero.name.length > 0) {
      this.heroService.save(this.hero!).subscribe((hero: any) => {
        //this.hero = hero as any; // saved hero, w/ id if new
        this.goBack(this.hero as any);

      }, (error: any) => (this.error = error)); // TODO: Display error message
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
            this.router.navigateByUrl('/heroes');
          }
        }
      },
      (error) => {
      });
    }
    else {
      
      this.closeTheHeroSaveDlg.emit(savedHero);
      this.router.navigateByUrl('/heroes');
    }

    //this.router.navigateByUrl('/heroes', { skipLocationChange: false, replaceUrl:true });
    if (this.navigated) {

      //window.history.back();
      this.router.navigateByUrl('/heroes');
    }
  }
}
