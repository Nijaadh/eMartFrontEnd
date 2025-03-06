import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  private apiUrl = 'http://api.exchangeratesapi.io/v1/latest';
  private accessKey = 'a03a895c06b17882dc091ebfb6bcb612';

  constructor(private http: HttpClient) {}

  getUsdToLkrRate(): Observable<{ rate: number; date: string }> {
    const url = `${this.apiUrl}?access_key=${this.accessKey}&symbols=LKR,USD`;
    return this.http.get<any>(url).pipe(
      map(response => {
        const eurToLkr = response.rates.LKR;
        const eurToUsd = response.rates.USD;
        // Calculate USD to LKR
        const usdToLkr = eurToLkr / eurToUsd;
        const date=response.date;
      
        return {rate:usdToLkr,date:date};
      })
    );
  }
}
