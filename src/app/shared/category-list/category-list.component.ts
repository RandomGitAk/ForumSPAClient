import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../../../types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent {
  @Input() categories: Category[] = [];
  @Output() categorySelected = new EventEmitter<number>();

  selectedCategoryId: number | null = null;

  constructor(private router: Router) {}

  onCategoryClick(id: number) {
    this.selectedCategoryId = id; 
    localStorage.setItem('selectedCategoryId', id.toString()); 
    this.router.navigate(['/'], { queryParams: { categoryId: id } });
    this.categorySelected.emit(id);
  }

  resetCategory() {
    this.selectedCategoryId = null;
    localStorage.removeItem('selectedCategoryId');
    this.router.navigate(['/']); 
  }

  ngOnInit(): void {
    const storedCategoryId = localStorage.getItem('selectedCategoryId');
    if (storedCategoryId) {
      this.selectedCategoryId = +storedCategoryId;
    }
  }
}
