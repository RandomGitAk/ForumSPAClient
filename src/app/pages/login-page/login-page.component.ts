import { Component, inject } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  authService = inject(AuthService);
  serverErrorMessage: string | null = null;

  form = new FormGroup({
    email: new FormControl(null, [Validators.required, this.emailValidator]),
    password: new FormControl(null, Validators.required)
  })
  constructor(private router: Router) {}

  onSubmit(){
    if(this.form.valid){
     console.log(this.form.value)
     //@ts-ignore
     this.authService.login(this.form.value).pipe(
      catchError(error => {
        if (error.status === 400) {
          this.serverErrorMessage = "Invalid input. Please check your email and password.";
        } else if (error.status === 401) {
          this.serverErrorMessage = "Incorrect email or password.";
        } else {
          this.serverErrorMessage = "An unexpected error occurred.";
        }
        return of(null); 
      })
    )
     .subscribe(res => {
      if (res) {
        this.router.navigate(['/']);
        console.log(res);
      }
    })
    }
   }

  closeLogin() {
    this.router.navigate(['/']);
  }

  emailValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    if (!email) return null; 

    const hasAtSymbol = email.includes('@');
    const isValidLength = email.length >= 6;

    return hasAtSymbol && isValidLength ? null : { invalidEmail: true };
  }
}
