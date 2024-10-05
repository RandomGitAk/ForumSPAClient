import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostsService } from '../../services/posts.service';
import { CategoriesService } from '../../services/categories.service';
import { Post, Posts } from '../../../types';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArticleMainComponent } from "../../shared/article-helpers/article-main/article-main.component";
import { PaginatorModule } from 'primeng/paginator';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-create-post-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, ArticleMainComponent, PaginatorModule,FroalaEditorModule,FroalaViewModule],
  templateUrl: './create-post-page.component.html',
  styleUrl: './create-post-page.component.scss'
})
export class CreatePostPageComponent implements OnInit  {
  private baseUrl = environment.apiUrl;
    form = new FormGroup({
    title: new FormControl('', Validators.required),
    content: new FormControl('', Validators.required),
    categoryId: new FormControl('', Validators.required)
  });
  categories: any[] = [];
  posts: Post[] = [];
  totalRecords: number = 0;
  rows: number = 5;
  searchPropertyName: string = "Title";
  searchTerm: string = '';

  constructor(private postService: PostsService, private categoryService: CategoriesService) {}

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchUserPosts(0, this.rows);
  }

  fetchCategories() {
    this.categoryService.getCategories(`${this.baseUrl}/Categories`).subscribe(categories => {
      this.categories = categories;
    });
  }

  fetchUserPosts(page: number, perPage: number) {
    this.postService.getUserPosts(`${this.baseUrl}/Posts/userPosts`, { page, perPage, searchPropertyName: this.searchPropertyName, searchTerm: this.searchTerm}).subscribe({
      next: (data: Posts) => {
        this.posts = data.items;
        this.totalRecords = data.total;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const newPost = {
        title: this.form.value.title,
        content: this.form.value.content,
        categoryId: this.form.value.categoryId,
      };

      this.postService.addPost(`${this.baseUrl}/Posts`,newPost).subscribe(() => {
        this.fetchUserPosts(0, this.rows); 
        this.form.reset();
      });
    }
  }

  onPageChange(event: any) {
    this.fetchUserPosts(event.page, event.rows);
  }
}
