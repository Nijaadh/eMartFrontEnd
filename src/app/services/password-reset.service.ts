import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // This is a mock method for UI development - will be replaced with actual API calls
  verifyIdentifier(type: string, value: string): Observable<any> {
    // Mock response for UI development
    const mockResponses: any = {
      username: {
        found: true,
        email: 'mo******@g.com',
        phone: '+9474******98'
      },
      email: {
        found: true,
        username: 'john_doe',
        phone: '07756*****98'
      },
      phone: {
        found: true,
        username: 'jane_smith',
        email: 'ja******@g.com'
      }
    };

    // Simulate API delay
    return of(mockResponses[type] || { found: false }).pipe(delay(1000));
  }

  // Mock method to send verification code
  sendVerificationCode(method: string, destination: string): Observable<any> {
    // This will be replaced with actual API call
    return of({ success: true, message: `Code sent to ${method}` }).pipe(delay(1500));
  }

  // Mock method to verify OTP
  verifyOTP(identifier: string, otp: string): Observable<any> {
    // This will be replaced with actual API call
    return of({ 
      valid: otp === '123456', // For testing, assume 123456 is valid
      message: otp === '123456' ? 'OTP verified successfully' : 'Invalid OTP'
    }).pipe(delay(1000));
  }

  // Mock method to reset password
  resetPassword(identifier: string, newPassword: string): Observable<any> {
    // This will be replaced with actual API call
    return of({ 
      success: true, 
      message: 'Password reset successfully' 
    }).pipe(delay(1500));
  }
}
