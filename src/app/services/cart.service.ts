import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GiftBoxService {
  private baseUrl = environment.apiUrl + 'gift';

  constructor(private http: HttpClient) {}

  // addGiftItem(giftBox: any): Observable<any> {
  //   return this.http.post<any>(this.api + "/create", giftBox, { responseType: 'text' });
  // }
  addCartItem(cartBox: any): Observable<any> {
    // Set the responseType to 'text' as expected
    return this.http.post(this.baseUrl + 'create', cartBox, {
      responseType: 'json',
    });
  }
  updatePayment(cart: any): Observable<any> {
    return this.http.put(this.baseUrl + 'paid', cart, { responseType: 'json' });
  }

  getcartsByUserId(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}getAllByUser/${userId}`);
  }

  getAllCartBoxNew(): Observable<any> {
    return this.http.get(this.baseUrl + 'getAllNew');
  }
  getAllCartBoxAccepted(): Observable<any> {
    return this.http.get(this.baseUrl + 'getAllAcc');
  }
  getAllCartBoxDelivered(): Observable<any> {
    return this.http.get(this.baseUrl + 'getAllDeli');
  }
  updateCommonStatus(data: any): Observable<any> {
    return this.http.put(this.baseUrl + 'status', data, {
      responseType: 'json',
    });
  }
}
