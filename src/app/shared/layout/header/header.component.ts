import { Component } from '@angular/core';
import { SearchService } from '../../../services/search.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule,RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  searchTerm: string = '';
  isLoggedIn: boolean = false;
  userEmail: string | null = null;

  constructor(private searchService: SearchService,
    private authService: AuthService
  ) {
  }

  isAdminOrEditor(): boolean {
    const userRole = this.authService.getRoleFromClaims();
    return userRole === 'Admin' || userRole === 'Moderator';
  }

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe((status: boolean) => {
      this.isLoggedIn = status;

      if (this.isLoggedIn) {
        this.userEmail = this.authService.getEmailFromToken();
      }
    });

    if (this.authService.isAuth) {
      this.userEmail = this.authService.getEmailFromToken();
      this.isLoggedIn = true;
    }
  }

  onLogout(): void {
    this.authService.logout();
  }
  onSearch() {
    this.searchService.setSearchTerm(this.searchTerm);
  }
}
