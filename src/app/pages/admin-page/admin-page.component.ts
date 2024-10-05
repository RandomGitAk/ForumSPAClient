import { Component } from '@angular/core';
import { AdminSidebarComponent } from "../../shared/admin-sidebar/admin-sidebar.component";
import { AdminTableComponent } from "../../shared/admin-table/admin-table.component";
import { UsersComponent } from '../../shared/admin-components/users/users.component';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [AdminSidebarComponent, AdminTableComponent, UsersComponent,  RouterModule],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss'
})
export class AdminPageComponent {

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.redirectBasedOnRole();
  }
  redirectBasedOnRole() {
    const userRole = this.authService.getRoleFromClaims(); 

    if (userRole === 'Admin') {
      this.router.navigate(['admin/users']); 
    } else if (userRole === 'Moderator') {
      this.router.navigate(['admin/categories']); 
    } else {
      this.router.navigate(['admin/categories']); 
    }
  }
}
