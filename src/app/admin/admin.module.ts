import {NgModule} from '@angular/core';
import { AdminRoutingModule } from './admin-routing.module';
import {AdminComponent} from './admin.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AdminComponent
  ],
  imports: [
    AdminRoutingModule,
    SharedModule, FormsModule, ReactiveFormsModule
  ]
})
export class AdminModule {}
