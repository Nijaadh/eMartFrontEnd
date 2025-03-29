import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private baseUrl = environment.apiUrl+'admin/';

  constructor(private http: HttpClient) {}

  getUserCount(): Observable<any> {
    return this.http.get(this.baseUrl + 'user/count');
  }
  getItemCount(): Observable<any> {
    return this.http.get(this.baseUrl + 'item/count');
  }
  getNewgiftCount(): Observable<any> {
    return this.http.get(this.baseUrl + 'gift/count-new-gifts');
  }
  getAcceptedGiftCount(): Observable<any> {
    return this.http.get(this.baseUrl + 'gift/count-processing-gifts');
  }
  getDeliveredGiftCount(): Observable<any> {
    return this.http.get(this.baseUrl + 'gift/count-delivered-gifts');
  }
  getTotalIncome(): Observable<any> {
    return this.http.get(this.baseUrl + 'gift/total-price-paid-gifts');
  }
  getTotalIncomelast12Months(): Observable<any> {
    return this.http.get(this.baseUrl + 'last-year-monthly-total-price');
  }
}
