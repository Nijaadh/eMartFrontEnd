import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiUrl + 'login';
  private loginUrl = 'http://localhost:8080/login';
  private tokenKey = 'jwtToken';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private router: Router
  ) {}

  // Login method
  login(user: any): Observable<any> {
    return this.http.post<any>(this.loginUrl, user);
  }

  // Save token
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    // Check if the code is running in the browser
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('jwtToken');
    }
    return null; // Return null when running on the server
  }

  // Function to check if the user is authenticated (i.e., token exists)
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token; // Returns true if token exists, otherwise false
  }

  // Logout function (optional) to remove the token and log out the user
  logout(): void {
    // Check if the code is running in the browser
    if (isPlatformBrowser(this.platformId)) {
      // localStorage.removeItem('jwtToken');
      localStorage.clear();
    }
  }
}
