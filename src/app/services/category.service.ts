import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import {
  Category,
  DeleteCategory,
  SubCategory,
  UpCategory,
  UpSubCategory,
} from '../admin/model/categoryModel';

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

  getSubCategoriesByCategoryId(id: Number): Observable<any> {
    return this.http.get(this.baseUrl + 'subcategories/by-category/' + id);
  }

  deleteCategory(DeleteCategory: DeleteCategory): Observable<any> {
    console.log(DeleteCategory);
    return this.http.put(this.baseUrl + 'categories/delete', DeleteCategory, {
      withCredentials: true,
    });
  }
  deleteSubCategory(DeleteCategory: DeleteCategory): Observable<any> {
    console.log(DeleteCategory);
    return this.http.put(
      this.baseUrl + 'subcategories/delete',
      DeleteCategory,
      {
        withCredentials: true,
      }
    );
  }

  getSubCategoryById(id: number): Observable<any> {
    return this.http.get(this.baseUrl + 'subcategories/' + id);
  }

  getCategoryById(id: number): Observable<any> {
    return this.http.get(this.baseUrl + 'categories/' + id);
  }

  updateCategory(category: UpCategory): Observable<any> {
    return this.http.put(this.baseUrl + 'categories/update', category, {
      withCredentials: true,
    });
  }
  updateSubCategory(subCategory: UpSubCategory): Observable<any> {
    return this.http.put(this.baseUrl + 'subcategories/update', subCategory, {
      withCredentials: true,
    });
  }
}
