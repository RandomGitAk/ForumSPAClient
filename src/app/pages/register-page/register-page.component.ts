import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent {
  authService = inject(AuthService);
  serverErrorMessage: string | null = null;
  
  form = new FormGroup({
    firstName: new FormControl(null, Validators.required),
    lastName: new FormControl(null, Validators.required),
    email: new FormControl(null, [Validators.required, this.emailValidator]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)])
  })
  constructor(private router: Router) {}

  onSubmit(){
    if(this.form.valid){
     console.log(this.form.value)
     //@ts-ignore
     this.authService.register(this.form.value).pipe(
      catchError(error => {
        if (error.status === 409) {
          this.serverErrorMessage = "User with this email already exists."; 
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

  closeRegister() {
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
