import { Component } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { Observable } from "rxjs/internal/Observable";
import { AuthService } from "./shared/services/auth/auth.service";
import { User } from "./shared/interfaces/user.interface";
import { merge, of } from "rxjs";

@Component({
  selector: 'app-root',
  template: `
  
    
    <app-header  [user]="user$ | async"></app-header>
        
  `,

  styleUrls: ['..//styles.scss']
})
export class AppComponent {
  title = 'Hospital Management System';
  user$: Observable<User | null> = merge(
    this.authService.me(),

    this.authService.getUser()
  );

  constructor(
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private authService: AuthService
  ) {
    this.registerSvgIcons();
  }

  registerSvgIcons() {
    [
      'close',
      'add',
      'add-blue',
      'airplane-front-view',
      'air-station',
      'balloon',
      'boat',
      'cargo-ship',
      'car',
      'catamaran',
      'clone',
      'convertible',
      'delete',
      'drone',
      'fighter-plane',
      'fire-truck',
      'horseback-riding',
      'motorcycle',
      'railcar',
      'railroad-train',
      'rocket-boot',
      'sailing-boat',
      'segway',
      'shuttle',
      'space-shuttle',
      'steam-engine',
      'suv',
      'tour-bus',
      'tow-truck',
      'transportation',
      'trolleybus',
      'water-transportation',
    ].forEach(icon => {
      this.matIconRegistry.addSvgIcon(
        icon,
        this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${icon}.svg`)
      );
    });
  }
}