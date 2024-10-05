import { Component } from '@angular/core';
import { ArticleMainComponent } from "../../shared/article-helpers/article-main/article-main.component";
import { PostsService } from '../../services/posts.service';
import { Category, Post, Posts } from '../../../types';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { SearchService } from '../../services/search.service';
import { CategoryListComponent } from "../../shared/category-list/category-list.component";
import { CategoriesService } from '../../services/categories.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ArticleMainComponent, CommonModule, PaginatorModule, CategoryListComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private baseUrl = environment.apiUrl;
  constructor(private postsService: PostsService,
    private searchService: SearchService,
    private categoriesService: CategoriesService,  
    private route: ActivatedRoute ) {}

  posts: Post[] = [];
  totalRecords: number = 0;
  rows: number = 5;
  searchPropertyName: string = "Title";
  searchTerm: string = '';
  selectedCategoryId: number = 0;
  categories: Category[] = []; 

  onPageChange(event: any) {
    this.fetchPosts(event.page, event.rows);
  }

  fetchPosts(page: number, perPage: number) {
    this.postsService
      .getPosts(`${this.baseUrl}/Posts`, { page, perPage, searchPropertyName: this.searchPropertyName, searchTerm: this.searchTerm, categoryId: this.selectedCategoryId })
      .subscribe({
        next: (data: Posts) => {
          this.posts = data.items;
          this.totalRecords = data.total;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  
  fetchCategories() {
    this.categoriesService.getCategories(`${this.baseUrl}/Categories`).subscribe(categories => {
      this.categories = categories;
    });
  }

  onCategorySelected(categoryId: number) {
    this.selectedCategoryId = categoryId;
    this.fetchPosts(0, this.rows); 
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const categoryId = params['categoryId'];
      if (categoryId) {
        this.selectedCategoryId = +categoryId;
      }else {
        this.selectedCategoryId = 0;
      }
      this.fetchPosts(0, this.rows); 
    });

    this.searchService.searchTerm$.subscribe(term => {
      this.searchTerm = term;
      this.fetchPosts(0, this.rows);
    });
    this.fetchCategories();
  }
}
