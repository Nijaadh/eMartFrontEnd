import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  
  private baseUrl = environment.apiUrl+ 'orders/';

  constructor(private http: HttpClient) {}

  getAllPendingOrders(): Observable<any> {
    return this.http.get(this.baseUrl + 'pending');
  }



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
