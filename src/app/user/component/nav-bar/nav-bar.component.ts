import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { GiftBoxService } from '../../../services/gift-box.service';
import { SharedDataService } from '../../../services/shared-data.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent implements OnInit {
  menuActive: boolean = false;
  sidebarVisible: boolean = false;

  isLoggedIn: boolean = false;
  userImageUrl: string = '';
  //get user details for variable
  username: any = 'Username';
  imageUrl: any = '';
  email: any = '';
  gifts: any[] = [];
  errorMessage: string = '';
  visible: boolean = false;
  items: MenuItem[] | undefined;
  giftboxCount: number = 0;
  giftBoxItems: number[] = [];
  giftBoxItemsDetails: any[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService,
    private router: Router,
    private giftBoxService: GiftBoxService,
    private sharedDataService: SharedDataService
  ) {
    if (typeof window !== 'undefined') {
      this.username = localStorage.getItem('username');
      this.imageUrl = `data:image/png;base64,${localStorage.getItem('imgUrl')}`;
      this.email = localStorage.getItem('email');
    }
  }
  ngOnInit() {
    if (this.username) {
      this.isLoggedIn = true;
      this.userImageUrl = this.imageUrl; // Set the image URL
    } else {
      this.isLoggedIn = false;
    }

    this.items = this.isLoggedIn
      ? [
          {
            label: this.username,
            items: [
              {
                label: 'My Account',
                icon: 'pi pi-user',
                command: () => {
                  this.sidebarVisible = true;
                },
              },
              {
                label: 'Logout',
                icon: 'pi pi-sign-out',
                command: () => {
                  this.logout();
                },
              },
            ],
          },
        ]
      : [
          {
            label: 'Login',
            icon: 'pi pi-sign-in',
            routerLink: '/login',
          },
          {
            label: 'Register',
            icon: 'pi pi-user-plus',
            routerLink: '/register',
          },
        ];

    if (isPlatformBrowser(this.platformId)) {
      const userId = localStorage.getItem('id');
      if (userId) {
        this.fetchGiftsByUserId(userId);
      }
    }
  }

  toggleMenu() {
    this.menuActive = !this.menuActive;
  }


  fetchGiftsByUserId(userId: string) {
    // const storedUserId = localStorage.getItem('id');
    // if (!storedUserId) {
    //   throw new Error('User ID not found in localStorage.');
    // }
    // const userId: string = storedUserId;

    this.giftBoxService.getGiftsByUserId(userId).subscribe({
      next: (response) => {
        if (response.status) {
          this.gifts = response.payload[0];
          console.log('Hutto::::::' + response.payload[0]);
        } else {
          this.errorMessage = 'No active gifts found for this user.';
        }
      },
      error: (err) => {
        this.errorMessage = 'Error fetching gift details.';
        console.error('Error fetching gifts: ', err);
      },
    });
  }

  logout() {
    // Perform logout logic here
    // this.authService.logout();
    localStorage.clear();
    window.location.reload();
    this.router.navigate(['/home']); // Redirect to login page
    this.isLoggedIn = false;
    console.log('Logout');
  }

  showDialog() {
    this.visible = true;
  }

  sendArray() {
    localStorage.setItem('item', JSON.stringify(this.giftBoxItems));
    this.sharedDataService.setData(this.giftBoxItems);
    this.router.navigate(['/check-out']);
  }

  removeItemFromArray(item: number): void {
    const index = this.giftBoxItems.indexOf(item);

    if (index !== -1) {
      // Item exists in the array, so remove it
      this.giftBoxItems.splice(index, 1);
      this.giftboxCount = this.giftBoxItems.length;
      console.log(`Item ${item} removed. Updated array:`, this.giftBoxItems);
    } else {
      console.log(`Item ${item} not found in the array.`);
    }
  }
}
