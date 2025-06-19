import { Component, inject, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../shared/interfaces';

import { AuthService } from '../shared/services';
import { FormBuilder } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @ViewChild('rightMenuTrigger') rightMenuTrigger!: MatMenuTrigger;
  @ViewChild('sidenav') sidenav!: MatSidenav;
  currentScreenSize!: string;
  destroyed = new Subject<void>();
  sidenavWidth = '100px'

  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);

  openMenu() {
    this.rightMenuTrigger.openMenu();
  }
  
  closeMenu() {
    this.rightMenuTrigger.closeMenu();
  }

  @Input() user: User | null = null;
  @Input() title: String | null = null;
  await: any;
  private _formBuilder = inject(FormBuilder);

  options = this._formBuilder.group({
    bottom: 0,
    fixed: false,
    top: 0,
  });

  constructor(private router: Router, private authService: AuthService) {
    inject(BreakpointObserver)
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(takeUntil(this.destroyed))
      .subscribe(result => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.currentScreenSize = this.displayNameMap.get(query) ?? 'Unknown';

            if (this.sidenav) {
              switch (this.currentScreenSize) {
                case "XSmall":
                  this.sidenav.close()
                  break;
                case "Small":
                  this.sidenav.close()
                  break;
                case "Medium":
                  this.sidenav.open()
                  break;
                case "Large":
                  this.sidenav.open()
                  break;
                default:
                  break;
              }
            }

          }
        }
      });
  }

  ngOnInit() {

  }

  async logout(): Promise<void> {
    try {

      let result = await this.authService.signOut();
      console.log("revoking google auth")

      // @ts-ignore
      google.accounts.id.disableAutoSelect();

      window.location.reload()
    } catch (Exception) {
      console.error(Exception)
    }
  }
}
