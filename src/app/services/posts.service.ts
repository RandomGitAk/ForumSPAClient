import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { PaginationParams, Post, Posts } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private apiService: ApiService) {}

    getPosts = (url: string, params: PaginationParams): Observable<Posts> => {
      return this.apiService.get(url, {
        params,
        responseType: 'json',
      });
     }

   getPostById = (url: string): Observable<Post> => {
    return this.apiService.get(url, {
      responseType: 'json',
    });
    } 

    getUserPosts = (url: string, params: PaginationParams): Observable<Posts> => {
      return this.apiService.get(url, {
        params,
        responseType: 'json',
      });
    } 

    addPost(url: string, post: any): Observable<any> {
      return this.apiService.post(url, post);
    }

    updatePostReaction(url: string, isLike: boolean,  postId: number): Observable<Post> {
      return this.apiService.post(url, {isLike: isLike, postId: postId });
    }

    incrementPostViews(url: string): Observable<void> {
      return this.apiService.patch<void>(url, {});
    }

    deletePost(url: string): Observable<Post> {
      return this.apiService.delete(url);
    }
}