import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = environment.apiUrl + 'user/';

  constructor(private http: HttpClient) {}

  addUser(user: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'register', user);
  }

  checkEmailExists(email: string): Observable<boolean> {
    const params = new HttpParams().set('email', email);
    return this.http.get<boolean>(this.baseUrl + 'check-email', { params });
  }
  
  checkUserNameExists(username: string): Observable<boolean> {
    const params = new HttpParams().set('userName', username);
    return this.http.get<boolean>(this.baseUrl + 'check-username', { params });
  }

  getAllUser(): Observable<any> {
    return this.http.get(this.baseUrl + 'getAll');
  }
}
