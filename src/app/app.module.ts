import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CdkTableModule } from '@angular/cdk/table';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroService } from './services/hero.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthHeaderInterceptor } from './interceptors/header.interceptor';
import { CatchErrorInterceptor } from './interceptors/http-error.interceptor';
import { AuthService } from './shared/services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { HeroesComponent } from './hero-list/heroes.component';
import { HeaderComponent } from './header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LoaderInterceptor } from './interceptors/loader.interceptor';
import { LoaderService } from './services/loader.service';

export function appInitializerFactory(authService: AuthService) {
  return () => authService.checkTheUserOnTheFirstLoad();
}

@NgModule({

  declarations: [
    AppComponent,
    DashboardComponent,
    HeroDetailComponent,
    HeroesComponent,
    HeaderComponent, 
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule,
    BrowserAnimationsModule,
    RouterModule,
    AppRoutingModule,
    CdkTableModule,
    MatTableModule,
    MatPaginatorModule,
    SharedModule,
    BrowserModule,
    FormsModule,
    MatToolbarModule,
    HttpClientModule

  ],
  providers: [HeroService,
    { provide: Window, useValue: window },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: AuthHeaderInterceptor,
    //   multi: true,
    // },
    {provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CatchErrorInterceptor,
      multi: true,
    },
    
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      multi: true,
      deps: [AuthService, LoaderService],
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [HeroesComponent]
})
export class AppModule { }
