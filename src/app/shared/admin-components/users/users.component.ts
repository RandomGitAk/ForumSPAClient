import { Component, OnInit } from '@angular/core';
import { AdminTableComponent } from "../../admin-table/admin-table.component";
import { UserService } from '../../../services/user.service';
import { Role, User, Users } from '../../../../types';
import { PaginatorModule } from 'primeng/paginator';
import { SearchService } from '../../../services/search.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { RoleService } from '../../../services/role.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [AdminTableComponent, PaginatorModule, DialogModule, ButtonModule,DropdownModule,CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  private baseUrl = environment.apiUrl;
  constructor(private userService: UserService,  private searchService: SearchService, private roleService: RoleService){}
  data: User[] = [];
  totalRecords: number = 0;
  rows: number = 5;
  searchPropertyName: string = "Email";
  searchTerm: string = '';

  selectedUser: User | null  = null;
  displayEditModal: boolean = false;
  selectedRole!: Role ;
  roles: Role[] = [];


  columns = [
    { field: 'fullName', header: 'Full name' },
    { field: 'email', header: 'Email'},
    { field: 'role.name', header: 'Role' },
  ];

  fetchUsers(page: number, perPage: number) {
    this.userService.getUsers(`${this.baseUrl}/Users`,{page, perPage, searchPropertyName: this.searchPropertyName, searchTerm: this.searchTerm,})
    .subscribe({
      next: (data: Users) => {
        this.data = data.items.map(user => ({
          ...user,
          fullName: `${user.firstName} ${user.lastName}`,
          role: user.role 
        }));
        this.totalRecords = data.total;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  ngOnInit() {
    this.searchService.searchTerm$.subscribe(term => {
      this.searchTerm = term;
      this.fetchUsers(0, this.rows);
    });
    this.fetchUsers(0, this.rows);
  }

  onEdit(user: User) {
    this.selectedUser = { ...user };
    this.roleService.getRoles(`${this.baseUrl}/Roles`).subscribe({
      next: (roles) => {
        this.roles = roles; 
        this.selectedRole = user.role; 
      },
      error: (err) => {
        console.error('Error fetching roles:', err);
      }
    });
    this.displayEditModal = true;
  }

  saveUser() {
    if (this.selectedUser && this.selectedRole) {
      const roleId = this.selectedRole.id;
      this.userService.updateUserRole(`${this.baseUrl}/Users/${this.selectedUser.id}`, roleId).subscribe({
        next: () => {
          this.fetchUsers(0, this.rows);
          this.displayEditModal = false;
        },
        error: (error) => {
          console.error('Error updating user:', error);
        }
      });
    }
  }

 
  onDelete(user: User) {
    this.userService.deleteUser(`${this.baseUrl}/Users/${user.id}`).subscribe({
      next: () => {
        this.fetchUsers(0, this.rows); 
      },
      error: (error) => {
        console.error('Error deleting category:', error);
      }
    });
  }

  onPageChange(event: any) {
    this.fetchUsers(event.page, event.rows);
  }
}
