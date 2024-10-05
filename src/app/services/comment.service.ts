import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { PostComment, UserComment } from '../../types';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl = environment.apiUrl;
  constructor(private apiService: ApiService) {}

  addComment(url: string, comment: PostComment): Observable<UserComment> {
    return this.apiService.post<UserComment>(url, comment);
  }

  getComments(postId: number): Observable<UserComment[]> {
    return this.apiService.get<UserComment[]>(`${this.baseUrl}/Comments/posts/${postId}/comments`,{});
  }

  addCommentLike(url: string, commentId: number): Observable<UserComment> {
    return this.apiService.post(url, { commentId: commentId });
  }
  removeCommentLike(url: string,): Observable<UserComment> {
    return this.apiService.delete(url);
  }
}
