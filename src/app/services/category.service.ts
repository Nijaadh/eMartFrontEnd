import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Category, SubCategory } from '../admin/model/categoryModel';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  addCategory(category: Category): Observable<any> {
    return this.http.post(this.baseUrl + 'categories/add', category, {
      withCredentials: true,
    });
  }

  getAllCategories(): Observable<any> {
    return this.http.get(this.baseUrl + 'categories/getAll');
  }

  addSubCategory(subCategory: SubCategory): Observable<any> {
    return this.http.post(this.baseUrl + 'subcategories/add', subCategory, {
      withCredentials: true,
    });
  }

  //get sub categories
  getAllSubCategories(): Observable<any> {
    return this.http.get(this.baseUrl + 'subcategories/getAll');
  }

  getSubCategoriesByCategoryId(id:Number): Observable<any> {
    return this.http.get(this.baseUrl + 'subcategories/by-category/'+id);
  }
}
