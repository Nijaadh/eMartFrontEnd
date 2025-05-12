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

  createOrders(cartBox: any): Observable<any> {
    // Set the responseType to 'text' as expected
    return this.http.post(this.baseUrl + 'create', cartBox, {
      responseType: 'json',
    });
  }

  getAllPendingOrders(): Observable<any> {
    return this.http.get(this.baseUrl + 'pending');
  }

  getAllProcessingOrders(): Observable<any> {
    return this.http.get(this.baseUrl + 'processing');
  }

  getAllShippedOrders(): Observable<any> {
    return this.http.get(this.baseUrl + 'shipped');
  }

  getAllDeliveredOrders(): Observable<any> {
    return this.http.get(this.baseUrl + 'delivered');
  }

  getAllOrdersList(): Observable<any> {
    return this.http.get(this.baseUrl + 'list');
  }

  updatePayment(cart: any): Observable<any> {
    return this.http.put(this.baseUrl + 'update-payment-status', cart, { responseType: 'json' });
  }

  updateOrderStatus(data: any): Observable<any> {
      return this.http.put(this.baseUrl + 'update-order-status', data, {
        responseType: 'json',
      });
    }
}
