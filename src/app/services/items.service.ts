import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../admin/model/itemModel';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GiftItemsService {

  private baseUrl = environment.apiUrl + 'items/';
  constructor(private http:HttpClient) { }

  getAllItems(): Observable<any> {
    return this.http.get(this.baseUrl + "getAll");
  }
  addItem(item:Item): Observable<any> {
    return this.http.post<any>(this.baseUrl+"add", item);
  }

  updateItem(item:Item): Observable<any> {
    return this.http.put<any>(this.baseUrl+"update", item);
  }

  deleteItem(product: any): Observable<any> {
    return this.http.put<any>(this.baseUrl+"delete", product);
  }

  getAllItemsbyId(product: number[]): Observable<any> {
    return this.http.post<any>(this.baseUrl+"by-ids", product);
  }

  searchByName(name: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}search?name=${name}`);
  }

  convertImageUrl(item: any): any {
    if (item.image) {
      return {
        ...item,
        image: `data:image/png;base64,${item.image}` // Convert base64 image to URL
      };
    }
    return item;
  }
}