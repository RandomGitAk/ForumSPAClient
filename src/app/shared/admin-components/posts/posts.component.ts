import { Component } from '@angular/core';
import { Post, Posts } from '../../../../types';
import { PostsService } from '../../../services/posts.service';
import { AdminTableComponent } from "../../admin-table/admin-table.component";
import { PaginatorModule } from 'primeng/paginator';
import { SearchService } from '../../../services/search.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [AdminTableComponent, PaginatorModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent {
  private baseUrl = environment.apiUrl;
  constructor(private postService: PostsService, private searchService: SearchService){}
  data: Post[] = [];
  totalRecords: number = 0;
  rows: number = 5;
  searchPropertyName: string = "Title";
  searchTerm: string = '';

  columns = [
    { field: 'title', header: 'Title' },
    { field: 'user.firstName', header: 'User name' },
    { field: 'countLikes', header: 'Count likes' },
  ];

  fetchPosts(page: number, perPage: number) {
    this.postService.getPosts(`${this.baseUrl}/Posts`,{page, perPage, searchPropertyName: this.searchPropertyName, searchTerm: this.searchTerm,})
    .subscribe({
      next: (data: Posts) => {
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
      this.fetchPosts(0, this.rows);
    });
    this.fetchPosts(0, this.rows);
  }
  
  onEdit(user: any) {
  }

  onDelete(post: Post) {
    this.postService.deletePost(`${this.baseUrl}/Posts/${post.id}`).subscribe({
      next: () => {
        this.fetchPosts(0, this.rows); 
      },
      error: (error) => {
        console.error('Error deleting category:', error);
      }
    });
  }

  onPageChange(event: any) {
    this.fetchPosts(event.page, event.rows);
  }
}
