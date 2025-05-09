import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as AOS from 'aos';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading: boolean = false;
  rememberMe: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    // Check if we have saved credentials
    const savedUsername = localStorage.getItem('savedUsername');
    const savedPassword = localStorage.getItem('savedPassword');
    
    this.loginForm = this.fb.group({
      userName: [savedUsername || '', [Validators.required]],
      userPassword: [savedPassword || '', [Validators.required, Validators.minLength(5)]]
    });
    
    // If we have saved credentials, set rememberMe to true
    this.rememberMe = !!savedUsername && !!savedPassword;
  }

  ngOnInit(): void {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
      });
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill all required fields correctly',
        life: 5000
      });
      return;
    }

    this.loading = true;
    const user = this.loginForm.value;
    
    // Handle "Remember Me" functionality
    if (this.rememberMe) {
      // Save credentials to localStorage
      localStorage.setItem('savedUsername', user.userName);
      localStorage.setItem('savedPassword', user.userPassword);
    } else {
      // Remove any saved credentials
      localStorage.removeItem('savedUsername');
      localStorage.removeItem('savedPassword');
    }

    this.authService.login(user).subscribe({
      next: (data) => {
        this.authService.setToken(data.jwtToken);
        localStorage.setItem('id', data.user.id);
        localStorage.setItem('username', data.user.userName);
        localStorage.setItem('imgUrl', data.user.image);
        localStorage.setItem('email', data.user.email);
        localStorage.setItem('role', data.user.role[0].roleName);
        
        this.messageService.add({
          severity: 'success',
          summary: 'Login Successful',
          detail: 'Welcome back to EMart.lk!',
          life: 3000
        });

        setTimeout(() => {
          const role = localStorage.getItem('role');
          if (role === 'Admin') {
            this.router.navigate(['/admin/dash']);
          } else {
            this.router.navigate(['/home']);
          }
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Authentication Failed',
          detail: 'Invalid username or password. Please try again.',
          life: 5000
        });
      }
    });
  }

  // Helper method for social login (placeholder for future implementation)
  socialLogin(provider: string): void {
    // This would be implemented when you add social login functionality
    console.log(`Login with ${provider}`);
    this.messageService.add({
      severity: 'info',
      summary: 'Coming Soon',
      detail: `${provider} login will be available soon!`,
      life: 3000
    });
  }

  navigateToForgotPassword(): void {
    // You can perform any actions needed before navigation
    this.router.navigate(['/forgot-password']);
  }
  
}
