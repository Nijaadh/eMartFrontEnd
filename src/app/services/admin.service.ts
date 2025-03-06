import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private api = "http://localhost:8080/api/admin/";
  constructor(private http: HttpClient) { }

  getUserCount(): Observable<any> {
    return this.http.get(this.api + "user/count");
  }
  getItemCount(): Observable<any> {
    return this.http.get(this.api + "item/count");
  }
  getNewgiftCount(): Observable<any> {
    return this.http.get(this.api + "gift/count-new-gifts");
  }
  getAcceptedGiftCount(): Observable<any> {
    return this.http.get(this.api + "gift/count-processing-gifts");
  }
  getDeliveredGiftCount(): Observable<any> {
    return this.http.get(this.api + "gift/count-delivered-gifts");
  }
  getTotalIncome(): Observable<any> {
    return this.http.get(this.api + "gift/total-price-paid-gifts");
  }
  getTotalIncomelast12Months(): Observable<any> {
    return this.http.get(this.api + "last-year-monthly-total-price");
  }
}
