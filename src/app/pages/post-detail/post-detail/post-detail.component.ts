import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Category, Post } from '../../../../types';
import { PostsService } from '../../../services/posts.service';
import { CategoriesService } from '../../../services/categories.service';
import { CategoryListComponent } from '../../../shared/category-list/category-list.component';
import { CommentsComponent } from '../../../shared/comments/comments.component';
import { PostDatePipe } from '../../../pipes/post-date.pipe';
import { FroalaViewModule } from 'angular-froala-wysiwyg';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, CategoryListComponent, PostDatePipe, CommentsComponent, FroalaViewModule],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss'
})
export class PostDetailComponent implements OnInit {
  private baseUrl = environment.apiUrl;
  post: Post | null = null;
  categories: Category[] = []; 

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    private categoriesService: CategoriesService,
  ) {
  }

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      const lastViewed = localStorage.getItem(`post_${postId}_viewed`);
      const now = new Date().getTime();

      if (!lastViewed || now - parseInt(lastViewed) > 1800000) { 
        this.postsService.incrementPostViews(`${this.baseUrl}/Posts/${postId}/views`).subscribe({
          next: () => {
            console.log('View count incremented');
            localStorage.setItem(`post_${postId}_viewed`, now.toString());
          },
          error: (error) => {
            console.error('Error incrementing view count', error);
          }
        });
      }
  

      this.postsService.getPostById(`${this.baseUrl}/Posts/${postId}`).subscribe({
        next: (data: Post) => {
          this.post = data; 
        },
        error: (error) => {
          console.error(error);
        }
      });
    }

    this.fetchCategories();
  }

  fetchCategories() {
    this.categoriesService.getCategories(`${this.baseUrl}/Categories`).subscribe(categories => {
      this.categories = categories;
    });
  }
  
  onUpvote() {
    if (this.post && this.post.userReaction !== 'Like') {
      this.post.userReaction = 'Like';

      this.postsService.updatePostReaction(`${this.baseUrl}/PostLikes/`,true, this.post.id!).subscribe({
        next: () => {
          if (this.post!.id) {
            this.refreshPost(this.post!.id.toString()); 
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }

  onDownvote() {
    if (this.post && this.post.userReaction !== 'Dislike') {
      this.post.userReaction = 'Dislike';

      this.postsService.updatePostReaction(`${this.baseUrl}/PostLikes/`,false, this.post.id!).subscribe({
        next: () => {
          if (this.post!.id) {
            this.refreshPost(this.post!.id.toString()); 
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }

  private refreshPost(postId :string) {
    if (this.post) {
      this.postsService.getPostById(`${this.baseUrl}/Posts/${postId}`).subscribe({
        next: (data: Post) => {
          this.post = data; 
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }
}