import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from '../../services/user.service';
import * as AOS from 'aos';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [MessageService]
})
export class RegisterComponent implements OnInit {
  imagePreviewUrl: string | ArrayBuffer | null = null;
  emailExists: boolean = false;
  unameExists: boolean = false;
  loading: boolean = false;
  termsAccepted: boolean = false;
  
  // Phone number validation pattern for Sri Lankan numbers
  // Accepts formats: 07XXXXXXXX or +947XXXXXXXX
  phonePattern: string = '^(07\\d{8}|\\+947\\d{8})$';
  
  user: any = {
    userName: '',
    address: '',
    email: '',
    tel: '',
    image: '',
    password: ''
  };

  constructor(
    private userService: UserService, 
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50
    });
  }

  onEmailChange() {
    if (this.user.email) {
      this.userService.checkEmailExists(this.user.email).subscribe(
        (exists: boolean) => {
          this.emailExists = exists;
          if (this.emailExists) {
            this.messageService.add({
              severity: 'warn',
              summary: 'Email Unavailable',
              detail: 'This email is already registered',
              life: 3000
            });
          }
        },
        (error) => {
          console.error('Error checking email', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to verify email availability',
            life: 3000
          });
        }
      );
    }
  }

  onUserNameChange() {
    if (this.user.userName) {
      this.userService.checkUserNameExists(this.user.userName).subscribe(
        (exists: boolean) => {
          this.unameExists = exists;
          if (this.unameExists) {
            this.messageService.add({
              severity: 'warn',
              summary: 'Username Unavailable',
              detail: 'This username is already taken',
              life: 3000
            });
          }
        },
        (error) => {
          console.error('Error checking Username', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to verify username availability',
            life: 3000
          });
        }
      );
    }
  }

  register() {
    // Validate form
    if (!this.user.userName || !this.user.email || !this.user.password) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill all required fields',
        life: 5000
      });
      return;
    }

    if (!this.termsAccepted) {
      this.messageService.add({
        severity: 'error',
        summary: 'Terms Required',
        detail: 'Please accept the Terms of Service and Privacy Policy',
        life: 5000
      });
      return;
    }

    if (this.emailExists || this.unameExists) {
      this.messageService.add({
        severity: 'error',
        summary: 'Registration Error',
        detail: 'Please fix the highlighted issues before proceeding',
        life: 5000
      });
      return;
    }

    // Validate phone number format
    const phoneRegex = new RegExp(this.phonePattern);
    if (this.user.tel && !phoneRegex.test(this.user.tel)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Phone Number',
        detail: 'Please enter a valid phone number (07XXXXXXXX or +947XXXXXXXX)',
        life: 5000
      });
      return;
    }

    this.loading = true;
    
    this.userService.addUser(this.user).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.payload != null) {
          this.messageService.add({
            severity: 'success',
            summary: 'Registration Successful',
            detail: 'Your account has been created successfully!',
            life: 5000
          });
          
          // Navigate to login page after a short delay
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else if (response.errorMessages != null) {
          this.messageService.add({
            severity: 'error',
            summary: 'Registration Failed',
            detail: response.errorMessages || 'Unable to complete registration',
            life: 5000
          });
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Registration error:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Registration Failed',
          detail: 'An unexpected error occurred. Please try again later.',
          life: 5000
        });
      }
    });
  }

  // This function is called when an image is selected
  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        this.messageService.add({
          severity: 'error',
          summary: 'File Too Large',
          detail: 'Profile image must be less than 2MB',
          life: 3000
        });
        return;
      }
      
      // Validate file type
      if (!file.type.match(/image\/(jpeg|jpg|png|gif)/)) {
        this.messageService.add({
          severity: 'error',
          summary: 'Invalid File Type',
          detail: 'Please select a valid image file (JPEG, PNG, GIF)',
          life: 3000
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.image = e.target.result.split(',')[1]; // Extract the base64 encoded string
        this.imagePreviewUrl = reader.result;
      };
      reader.readAsDataURL(file); // Read file as data URL
    }
  }
}
