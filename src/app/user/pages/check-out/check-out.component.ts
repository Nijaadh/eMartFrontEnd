import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { GiftBoxService } from '../../../services/cart.service';
import { CartItem } from '../../model/cart.item';
import { ShoppingCartService } from '../../services/shopping.cart/shopping-cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrl: './check-out.component.scss'
})
export class CheckOutComponent implements OnInit, OnDestroy {
  giftBoxitems: CartItem[] = [];
  giftboxCount: number = 0;
  totalPrice: number = 0;

  address: string = '';
  zip: string = '';
  
  submitted: boolean = false;
  giftBoxID: any;
  isLoading: boolean = false;
  
  private subscriptions: Subscription[] = [];

  item = {
    giftName: "Gift Order",
    createdAt: "",
    sendingDate: "",
    recieverAddress: "",
    zip: "",
    totalPrice: "",
    commonStatus: "ACTIVE",
    itemIds: [] as number[],
    userId: ""
  }

  // Image preview
  showModal: boolean = false;
  previewImage: string = '';

  constructor(
    private router: Router,
    private giftBoxService: GiftBoxService,
    private authService: AuthService,
    private messageService: MessageService,
    public shoppingCartService: ShoppingCartService
  ) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.item.userId = localStorage.getItem('id') || '';
    }
    
    // Subscribe to cart items
    this.subscriptions.push(
      this.shoppingCartService.getCartItems().subscribe(items => {
        this.giftBoxitems = items;
        this.calculateItemIds();
      })
    );
    
    // Subscribe to cart count
    this.subscriptions.push(
      this.shoppingCartService.getCartCount().subscribe(count => {
        this.giftboxCount = count;
      })
    );
    
    // Subscribe to cart total
    this.subscriptions.push(
      this.shoppingCartService.getCartTotal().subscribe(total => {
        this.totalPrice = total;
      })
    );
  }

  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // Method to open the image preview modal
  openImagePreview(image: string, event: Event): void {
    event.stopPropagation(); // Prevent event bubbling
    this.previewImage = image;
    this.showModal = true;
  }

  // Method to close the modal
  closeModal(): void {
    this.showModal = false;
  }

  removeItemFromArray(itemId: number): void {
    this.shoppingCartService.removeFromCart(itemId);
  }

  calculateItemIds(): void {
    this.item.itemIds = this.giftBoxitems.map(item => item.id);
  }

  saveReceiverInfo(): boolean {
    this.item.recieverAddress = this.address;
    this.item.zip = this.zip;
    
    // Set current date as sending date since we removed the date field
    const today = new Date();
    this.item.sendingDate = today.toISOString().split('T')[0];
    
    return true;
  }

  validateInputs(): boolean {
    this.submitted = true;
    
    if (!this.address) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please enter delivery address' });
      return false;
    }
    
    if (!this.zip) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please enter zip code' });
      return false;
    }
    
    return true;
  }

  saveGift(): void {
    // Validate form fields
    if (!this.validateInputs()) {
      return;
    }

    // Make sure we have items in cart
    if (this.giftBoxitems.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Your cart is empty!' });
      return;
    }

    this.isLoading = true;

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');

    this.item.createdAt = `${year}-${month}-${day}`;
    this.item.totalPrice = this.totalPrice.toString();
    
    // Save receiver details
    if (!this.saveReceiverInfo()) {
      this.isLoading = false;
      return;
    }

    this.giftBoxService.addCartItem(this.item).subscribe({
      next: response => {
        const id = response.payload;
        this.giftBoxID = id;
        localStorage.setItem('giftBoxID', id);
        localStorage.setItem('giftBoxPrice', this.totalPrice.toString());
        this.GiftBoxSaveSuccessMsg();
        
        // Clear cart after successful save
        if (id) {
          // this.shoppingCartService.clearCart();
          // Navigate to payment route after successful save
          this.router.navigate(['/payment']);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error:", error);
        this.GiftBoxSaveUnsuccessMsg();
        this.isLoading = false;
      }
    });
  }

  checkOut(): void {
    // Validate form fields first
    if (!this.validateInputs()) {
      return;
    }
    
    // If cart is empty, show error
    if (this.giftBoxitems.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Your cart is empty!' });
      return;
    }
    
    // If validation passes, proceed with checkout
    this.isLoading = true;
    this.saveGift();
  }

  GiftBoxSaveSuccessMsg(): void {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'GiftBox Successfully Saved!' });
  }

  GiftBoxSaveUnsuccessMsg(): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'GiftBox saving Unsuccessful!' });
  }
}