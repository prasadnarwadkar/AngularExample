import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './login/profile.component';

@NgModule({
  imports: [SharedModule, AuthRoutingModule, FormsModule, ReactiveFormsModule],
  declarations: [LoginComponent, RegisterComponent, ProfileComponent],
})
export class AuthModule {}
