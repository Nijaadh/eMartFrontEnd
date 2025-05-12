import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  private apiUrl = environment.currencyConversionUrl;
  private accessKey = environment.accessKey;

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
