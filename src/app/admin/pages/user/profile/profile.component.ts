import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GiftItemsService } from '../../../../services/items.service';
import { MessageService } from 'primeng/api';
import { SharedDataService } from '../../../../services/shared-data.service';
import { ShoppingCartService } from '../../../../user/services/shopping.cart/shopping-cart.service';
import { UserService } from '../../../../services/user.service';

interface UserData {
  id: string;
  userName: string;
  address: string;
  email: string;
  tel: string;
  image: string;
  password: string | null;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  UserId: any;
  selectedTeam: UserData | any = {};
  isUpdating: boolean = false;
  showImagePreview: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private _apim: GiftItemsService,
    private messageService: MessageService,
    private sharedDataService: SharedDataService,
    private router: Router,
    private cartService: ShoppingCartService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.UserId = this.route.snapshot.paramMap.get('id') || '';
    console.log('User ID:', this.UserId);

    this.loadUserData();
  }

  loadUserData(): void {
    this.userService.getUserById(this.UserId).subscribe(
      (data) => {
        this.selectedTeam = data.payload[0] || {};
        console.log('Fetched user:', this.selectedTeam);
      },
      (error) => {
        console.error('Error fetching user:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load user data'
        });
      }
    );
  }

  updateUser(): void {
    if (!this.selectedTeam) {
      return;
    }

    this.isUpdating = true;

    // Prepare user data for update
    const userData: UserData = {
      id: this.selectedTeam.id,
      userName: this.selectedTeam.userName,
      address: this.selectedTeam.address,
      email: this.selectedTeam.email,
      tel: this.selectedTeam.tel,
      image: this.selectedTeam.image,
      password: this.selectedTeam.password
    };

  //   // Call your update service method here
    this.userService.updateUser(userData).subscribe(
      (response) => {
        this.isUpdating = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User updated successfully!'
        });
        
        // Optionally navigate back or refresh data
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1500);
      },
      (error) => {
        this.isUpdating = false;
        console.error('Error updating user:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update user. Please try again.'
        });
      }
    );
   }

   goBack(): void{
    this.router.navigate(['/home']);
   }

  cancelUpdate(): void {
    // Reload original data or navigate back
     this.router.navigate(['/home']);
    this.loadUserData();

  }

  previewImage(): void {
    this.showImagePreview = true;
  }

  onImageError(): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Image Error',
      detail: 'Failed to load image. Please check the URL.'
    });
    this.showImagePreview = false;
  }
}