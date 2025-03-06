import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GiftItemsService {

  private api='http://localhost:8080/api/items';
  constructor(private http:HttpClient) { }

  getAllGiftItems(): Observable<any> {
    return this.http.get(this.api + "/getAll");
  }
  addGiftItem(product: any): Observable<any> {
    return this.http.post<any>(this.api+"/add", product);
  }

  deleteGiftItem(product: any): Observable<any> {
    return this.http.put<any>(this.api+"/delete", product);
  }
  getAllGiftBoxItems(product: number[]): Observable<any> {
    return this.http.post<any>(this.api+"/by-ids", product);
  }
  searchByName(name: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/search?name=${name}`);
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