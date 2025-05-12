import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = environment.apiUrl + 'admin/';
  
  constructor(private http: HttpClient) { }
  
  /**
   * Fetches all dashboard data from the API
   * @returns Observable with dashboard data
   */
  getAllDashboardData(): Observable<any> {
    return this.http.get(`${this.baseUrl}dashboard-data`);
  }
}