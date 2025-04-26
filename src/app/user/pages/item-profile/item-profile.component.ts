import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GiftItemsService } from '../../../services/items.service';
import { SharedDataService } from '../../../services/shared-data.service';
import { ShoppingCartService } from '../../services/shopping.cart/shopping-cart.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-item-profile',
  templateUrl: './item-profile.component.html',
  styleUrl: './item-profile.component.scss',
})
export class ItemProfileComponent implements OnInit {
  productId: string = '';
  items: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private _apim: GiftItemsService,
    private messageService: MessageService,
    private sharedDataService: SharedDataService,
    private router: Router,
    private cartService: ShoppingCartService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    console.log('Product ID:', this.productId);

    this._apim.getItemById(this.productId).subscribe(
      (data) => {
        let itemss = data.payload.map((item: any) => ({
          ...item[0],
          image: `data:image/png;base64,${item[0].image}`, // Convert base64 to image URL
        }));
        // Ensure `items` is an array
        this.items = itemss;
        console.log('Fetched items:', this.items);
      },
      (error) => {
        console.error('Error fetching items:', error);
      }
    );
  }

  calculatePrice(unitPrice: any, discount: any): string {
    const price = Number(unitPrice);
    const discountValue = Number(discount);
    if (discountValue > 0) {
      return (price - (price * discountValue) / 100).toFixed(2);
    }
    return price.toFixed(2);
  }

  getOriginalPrice(unitPrice: any): string {
    return Number(unitPrice).toFixed(2);
  }

  addToCart(item: any) {
    this.cartService.addToCart(item);
    this.clearMsg();
    this.itemAddedMsg();
    console.log('Item added to cart:', item);
  }

  clearMsg() {
    this.messageService.clear();
  }

  itemAddedMsg() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Item successfully added to Cart!',
    });
  }
}
