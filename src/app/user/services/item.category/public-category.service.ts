import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicCategoryService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<any> {
      return this.http.get(this.baseUrl + 'categories/with-subcategories');
    }
}
