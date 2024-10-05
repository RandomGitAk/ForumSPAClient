import { Component } from '@angular/core';
import { Categories, Category } from '../../../../types';
import { CategoriesService } from '../../../services/categories.service';
import { AdminTableComponent } from "../../admin-table/admin-table.component";
import { PaginatorModule } from 'primeng/paginator';
import { SearchService } from '../../../services/search.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [AdminTableComponent, PaginatorModule, DialogModule, ButtonModule,DropdownModule, CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  private baseUrl = environment.apiUrl;
  constructor(private categoryService: CategoriesService,
    private searchService: SearchService
  ){}
  data: Category[] = [];
  totalRecords: number = 0;
  rows: number = 5;
  searchPropertyName: string = "Name";
  searchTerm: string = '';

  selectedCategory: Category | null  = null;
  newCategory: Category = { name: '', description: '' };
  displayEditModal: boolean = false;
  displayCreateModal: boolean = false;

  columns = [
    { field: 'name', header: 'Name' },
    { field: 'description', header: 'Description'},
  ];

  fetchCategories(page: number, perPage: number) {
    this.categoryService.getPagedCategories(`${this.baseUrl}/Categories/paged`,{page, perPage, searchPropertyName: this.searchPropertyName, searchTerm: this.searchTerm,})
    .subscribe({
      next: (data: Categories) => {
        this.data = data.items;
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
      this.fetchCategories(0, this.rows);
    });
    this.fetchCategories(0, this.rows);
  }

  onCreateNewItem() {
    this.displayCreateModal = true;
  }

  create() {
    this.categoryService.addCategory(`${this.baseUrl}/Categories`, this.newCategory).subscribe({
      next: (response) => {

        this.fetchCategories(0, this.rows); 
        this.displayCreateModal = false; 
        this.newCategory = { name: '', description: '' };
      },
      error: (error) => {
        console.error('Error creating category:', error);
      }
    });
  }
   onEdit(category: Category) {
    this.selectedCategory = { ...category };
    this.displayEditModal = true;
  }

  edit() {
    if (this.selectedCategory) {
      this.categoryService.updateCategory(`${this.baseUrl}/Categories/${this.selectedCategory.id}`,this.selectedCategory).subscribe({
        next: () => {
          this.fetchCategories(0, this.rows);
          this.displayEditModal = false; 
        },
        error: (error) => {
          console.error('Error updating user:', error);
        }
      });
    }
  }


  onDelete(category: Category) {
    this.categoryService.deleteCategory(`${this.baseUrl}/Categories/${category.id}`).subscribe({
      next: () => {
        this.fetchCategories(0, this.rows); 
      },
      error: (error) => {
        console.error('Error deleting category:', error);
      }
    });
  }

  onPageChange(event: any) {
    this.fetchCategories(event.page, event.rows);
  }
}
