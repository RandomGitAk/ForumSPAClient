import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categories, Category, PaginationParams } from '../../types';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  constructor(private http: HttpClient,private apiService: ApiService) {}

  getCategories(url: string): Observable<Category[]> {
    return this.http.get<Category[]>(url);
  }

  getPagedCategories = (url: string, params: PaginationParams): Observable<Categories> => {
    return this.apiService.get(url, {
      params,
      responseType: 'json',
    });
   }
  
  addCategory(url: string, post: any): Observable<any> {
    return this.apiService.post(url, post);
  }
  updateCategory(url: string, updatedCategory: Category): Observable<Category> {
    return this.apiService.put(url, updatedCategory);
  }
  
  deleteCategory(url: string): Observable<Category> {
    return this.apiService.delete(url);
  }
}