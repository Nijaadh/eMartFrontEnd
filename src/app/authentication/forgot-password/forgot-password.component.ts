import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  providers: [MessageService]
})
export class ForgotPasswordComponent implements OnInit {
  // Define currentStep as a number, not just 1
  currentStep: number = 1;
  loading: boolean = false;
  
  // Forms
  identifierForm: FormGroup;
  otpForm: FormGroup;
  newPasswordForm: FormGroup;
  
  // Dialogs
  displayOtpDialog: boolean = false;
  displayNewPasswordDialog: boolean = false;
  
  // User data
  userInfo: any = null;
  selectedContactMethod: 'email' | 'phone' = 'email';
  
  // Options for identification dropdown
  identifierTypes = [
    { label: 'Username', value: 'username' },
    { label: 'Email Address', value: 'email' },
    { label: 'Phone Number', value: 'phone' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {
    // Initialize forms
    this.identifierForm = this.fb.group({
      identifierType: ['email', Validators.required],
      identifierValue: ['', Validators.required]
    });
    
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
    
    this.newPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Any initialization logic
  }
  
  // Password match validator
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      return { mismatch: true };
    }
    
    return null;
  }
  
  // Step 1: Verify user identifier
  verifyIdentifier(): void {
    if (this.identifierForm.invalid) {
      this.identifierForm.markAllAsTouched();
      return;
    }
    
    this.loading = true;
    
    // In a real application, you would call your auth service here
    // For demo purposes, we'll simulate a successful response
    setTimeout(() => {
      this.loading = false;
      
      // Mock user data
      this.userInfo = {
        id: '123456',
        username: 'johndoe',
        email: 'j***e@example.com',
        phone: '+94 7** *** 456'
      };
      
      // Move to step 2
      this.currentStep = 2;
    }, 1500);
    
    // Example of actual service call:
    /*
    this.authService.findAccount(this.identifierForm.value).subscribe({
      next: (response) => {
        this.loading = false;
        this.userInfo = response.user;
        this.currentStep = 2;
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Account Not Found',
          detail: 'We couldn\'t find an account with that information.'
        });
      }
    });
    */
  }
  
  // Step 2: Send verification code
  sendVerificationCode(method: 'email' | 'phone'): void {
    this.selectedContactMethod = method;
    this.loading = true;
    
    // In a real application, you would call your auth service here
    // For demo purposes, we'll simulate a successful response
    setTimeout(() => {
      this.loading = false;
      this.displayOtpDialog = true;
      
      this.messageService.add({
        severity: 'info',
        summary: 'Code Sent',
        detail: `Verification code has been sent to your ${method}.`
      });
    }, 1500);
    
    // Example of actual service call:
    /*
    this.authService.sendVerificationCode(this.userInfo.id, method).subscribe({
      next: (response) => {
        this.loading = false;
        this.displayOtpDialog = true;
        this.messageService.add({
          severity: 'info',
          summary: 'Code Sent',
          detail: `Verification code has been sent to your ${method}.`
        });
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Failed to Send Code',
          detail: 'There was an error sending the verification code. Please try again.'
        });
      }
    });
    */
  }
  
  // Resend OTP
  resendOTP(): void {
    this.sendVerificationCode(this.selectedContactMethod);
  }
  
  // Verify OTP
  verifyOTP(): void {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }
    
    this.loading = true;
    
    // In a real application, you would call your auth service here
    // For demo purposes, we'll simulate a successful response
    setTimeout(() => {
      this.loading = false;
      this.displayOtpDialog = false;
      this.displayNewPasswordDialog = true;
      this.currentStep = 3;
    }, 1500);
    
    // Example of actual service call:
    /*
    this.authService.verifyOTP(this.userInfo.id, this.otpForm.value.otp).subscribe({
      next: (response) => {
        this.loading = false;
        this.displayOtpDialog = false;
        this.displayNewPasswordDialog = true;
        this.currentStep = 3;
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Invalid Code',
          detail: 'The verification code you entered is invalid or has expired.'
        });
      }
    });
    */
  }
  
  // Reset password
  resetPassword(): void {
    if (this.newPasswordForm.invalid) {
      this.newPasswordForm.markAllAsTouched();
      return;
    }
    
    this.loading = true;
    
    // In a real application, you would call your auth service here
    // For demo purposes, we'll simulate a successful response
    setTimeout(() => {
      this.loading = false;
      this.displayNewPasswordDialog = false;
      
      this.messageService.add({
        severity: 'success',
        summary: 'Password Reset',
        detail: 'Your password has been reset successfully. You can now log in with your new password.'
      });
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 3000);
    }, 1500);
    
    // Example of actual service call:
    /*
    this.authService.resetPassword(
      this.userInfo.id, 
      this.newPasswordForm.value.password
    ).subscribe({
      next: (response) => {
        this.loading = false;
        this.displayNewPasswordDialog = false;
        
        this.messageService.add({
          severity: 'success',
          summary: 'Password Reset',
          detail: 'Your password has been reset successfully. You can now log in with your new password.'
        });
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Reset Failed',
          detail: 'There was an error resetting your password. Please try again.'
        });
      }
    });
    */
  }
  
  // Go back to previous step
  goBack(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  
  // Get masked information for privacy
  getMaskedInfo(type: 'email' | 'phone'): string {
    if (!this.userInfo) return '';
    
    return type === 'email' ? this.userInfo.email : this.userInfo.phone;
  }
}
