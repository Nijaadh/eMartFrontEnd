import { Component, OnInit } from '@angular/core';
import { GiftItemsService } from '../../../services/gift-items.service';

 
@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent implements OnInit {
  fetchingItems: any[] = []; // For fetchingProduct
  constructor(private giftItemsService: GiftItemsService) { }
  ngOnInit(): void {
      this.fetchAllItems();
  }



  fetchAllItems(): void {
      this.giftItemsService.getAllGiftItems().subscribe(data => {
          if (!data || !data.payload) {
              console.error('Invalid data format:', data);
              return;
          }

          // Map and convert base64 image
          const items = data.payload.map((item: any) => ({
              ...item,
              image: item.image ? 'data:image/png;base64,' + item.image : ''
          }));

          // Randomize the items
          this.fetchingItems = this.getRandomizedItems(items);
      });
  }

  getRandomizedItems(items: any[]): any[] {
      for (let i = items.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [items[i], items[j]] = [items[j], items[i]];
      }
      return items;
  }
}
