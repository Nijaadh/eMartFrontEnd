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

  getAllGiftItems(): Observable<any> {
    return this.http.get(this.baseUrl + "getAll");
  }
  addGiftItem(item:Item): Observable<any> {
    return this.http.post<any>(this.baseUrl+"add", item);
  }

  deleteGiftItem(product: any): Observable<any> {
    return this.http.put<any>(this.baseUrl+"delete", product);
  }
  getAllGiftBoxItems(product: number[]): Observable<any> {
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