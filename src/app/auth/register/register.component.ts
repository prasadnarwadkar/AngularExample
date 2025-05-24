import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';

import { AuthService } from '../../shared/services';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../auth.component.scss'],
})
export class RegisterComponent {
  constructor(private router: Router, private authService: AuthService) { }

  passwordsMatchValidator(control: FormControl): ValidationErrors | null {
    const password = control.root.get('password');
    return password && control.value !== password.value
      ? {
        passwordMatch: true,
      }
      : null;
  }

  userForm = new FormGroup({
    fullname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    repeatPassword: new FormControl('', [Validators.required, this.passwordsMatchValidator]),
    picture: new FormControl(''),
  });

  get fullname(): AbstractControl {
    return this.userForm.get('fullname')!;
  }

  get email(): AbstractControl {
    return this.userForm.get('email')!;
  }

  get password(): AbstractControl {
    return this.userForm.get('password')!;
  }

  get repeatPassword(): AbstractControl {
    return this.userForm.get('repeatPassword')!;
  }

  register(): void {
    if (this.userForm.invalid) {
      if (this.userForm?.controls?.fullname?.errors?.required) {
        alert("Full name is needed")
      }

      if (this.userForm?.controls?.repeatPassword?.errors?.required) {
        alert("Confirm Password is needed")
      }

      if (this.userForm?.controls?.repeatPassword?.errors?.passwordMatch) {
        alert("Confirm Password doesn't match Password field")
      }


      return;
    }

    const { fullname, email, password, repeatPassword, picture } = this.userForm.getRawValue();

    this.authService.register(fullname!, email!, password!, repeatPassword!, picture!).subscribe({
      next: (v) => this.router.navigate(['']),
      error: (e) => {console.error(e); 
        if (e.message.indexOf('duplicate key error')>= 0){
        alert("Email has already been used");
      }},
      complete: () => console.info('complete')
    })
  }
}
