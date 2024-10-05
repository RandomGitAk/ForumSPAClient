import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../../types';
import { UserService } from '../../services/user.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [FormsModule,ToastModule],
  providers: [MessageService],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent implements OnInit {
  private baseUrl = environment.apiUrl;
  constructor(private userService:UserService, private messageService: MessageService) {}
  firstName: string | null = null;
  lastName: string  | null = null;
  email: string  | null = null;
  profilePicture: string  | null = null;
  selectedFile: File | null = null;

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.userService.getMe(`${this.baseUrl}/Auth/me`).subscribe({
      next: (user: User) => {
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        console.log('user.lastName', user);
        this.profilePicture = user.image;
      },
      error: (error) => {
        console.error('Unable to retrieve user data', error);
      },
      complete: () => {
        console.log('User profile loaded successfully');
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePicture = e.target.result;  
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfile(): void {
    const formData = new FormData();
    formData.append('firstName', this.firstName ?? '');
    formData.append('lastName', this.lastName ?? '');

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.userService.updateUserInfo(`${this.baseUrl}/Users`, formData).subscribe({
      next: (response) => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Profile Updated', 
          detail: 'Your profile has been successfully updated.' 
        });
      },
      error: (error) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Update Failed', 
          detail: 'There was an error updating your profile.' 
        });
      }
    });
  }
}
