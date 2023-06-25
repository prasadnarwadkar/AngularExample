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
  @Output() close = new EventEmitter();
  error: any;
  navigated = false; // true if navigated here

  constructor(
    private router: Router,
    private heroService: HeroService,
    
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    //('detail');
    this.route.params.forEach(async (params: Params) => {
      if (params['id'] !== undefined) {
        const id = params['id'];
        this.navigated = true;
        (await this.heroService.getHero(id)).subscribe((hero:any) => (this.hero = hero));
      } else {
        this.navigated = false;
        this.hero = new Hero();
      }
    });
  }

  save(): void {
    //alert('saving');
    this.heroService.save(this.hero!).subscribe((hero: any) => {
      this.hero = hero as any; // saved hero, w/ id if new
      this.goBack(hero as any);
    }, (error: any) => (this.error = error)); // TODO: Display error message
  }

  goBack(savedHero: Hero ): void {
    this.close.emit(savedHero);
    
    this.router.navigateByUrl('/heroes', { skipLocationChange: false, replaceUrl:true });
    if (this.navigated) {
      
      //window.history.back();
      this.router.navigateByUrl('/heroes');
    }
  }
}
