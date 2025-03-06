import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private api='http://localhost:8080/api/user';

  constructor(private http:HttpClient) { }

  addUser(user: any): Observable<any> {
    return this.http.post<any>(this.api+"/register", user);
  }

  checkEmailExists(email: string): Observable<boolean> {
    const params = new HttpParams().set('email', email);
    return this.http.get<boolean>(this.api+"/check-email", { params });
  }
  checkUserNameExists(username: string): Observable<boolean> {
    const params = new HttpParams().set('userName', username);
    return this.http.get<boolean>(this.api+"/check-username", { params });
  }

  getAllUser(): Observable<any> {
    return this.http.get(this.api + "/getAll");
  }
}
