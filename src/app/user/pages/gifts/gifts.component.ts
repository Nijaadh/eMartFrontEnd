import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GiftItemsService } from '../../../services/gift-items.service';
import { SharedDataService } from '../../../services/shared-data.service';
import { debounceTime, Subject } from 'rxjs';
interface Country {
  name: string;
  code: string;
}
@Component({
  selector: 'app-gifts',
  templateUrl: './gifts.component.html',
  styleUrl: './gifts.component.scss',
})
export class GiftsComponent implements OnInit {
  giftBox!: Country[];
  selectedGifts!: Country[];

  fetchingItems: any[] = [];
  visible: boolean = false;
  //GiftBox
  giftBoxItems: number[] = [];
  giftBoxItemsDetails: any[] = [];
  giftboxCount: number = 0;

  searchTerm: string = '';
  items: any[] = [];
  isModalVisible = false;
  private searchSubject = new Subject<string>();

  //--search-modal---
  category: any[] = [];

  constructor(
    private giftItemsService: GiftItemsService,
    private messageService: MessageService,
    private sharedDataService: SharedDataService,
    private router: Router
  ) {
    this.searchSubject.pipe(debounceTime(300)).subscribe((searchText) => {
      this.fetchSearchResults(searchText);
    });
  }

  ngOnInit(): void {
    this.fetchAllItems();
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem('giftBoxID');
      localStorage.removeItem('giftBoxPrice');
    }

  //   this.category = [
  //     {
  //       label: 'Products',
  //       icon: 'pi pi-box',
  //       category: [
  //         [
  //           {
  //             label: 'Living Room',
  //             items: [
  //               { label: 'Accessories' },
  //               { label: 'Armchair' },
  //               { label: 'Coffee Table' },
  //               { label: 'Couch' },
  //               { label: 'TV Stand' },
  //             ],
  //           },
  //         ],
  //         [
  //           {
  //             label: 'Kitchen',
  //             items: [
  //               { label: 'Bar stool' },
  //               { label: 'Chair' },
  //               { label: 'Table' },
  //             ],
  //           },
  //           {
  //             label: 'Bathroom',
  //             items: [{ label: 'Accessories' }],
  //           },
  //         ],
  //         [
  //           {
  //             label: 'Bedroom',
  //             items: [
  //               { label: 'Bed' },
  //               { label: 'Chaise lounge' },
  //               { label: 'Cupboard' },
  //               { label: 'Dresser' },
  //               { label: 'Wardrobe' },
  //             ],
  //           },
  //         ],
  //         [
  //           {
  //             label: 'Office',
  //             items: [
  //               { label: 'Bookcase' },
  //               { label: 'Cabinet' },
  //               { label: 'Chair' },
  //               { label: 'Desk' },
  //               { label: 'Executive Chair' },
  //             ],
  //           },
  //         ],
  //       ],
  //     },
  //     {
  //       label: 'Electronics',
  //       icon: 'pi pi-mobile',
  //       items: [
  //         [
  //           {
  //             label: 'Computer',
  //             items: [
  //               { label: 'Monitor' },
  //               { label: 'Mouse' },
  //               { label: 'Notebook' },
  //               { label: 'Keyboard' },
  //               { label: 'Printer' },
  //               { label: 'Storage' },
  //             ],
  //           },
  //         ],
  //         [
  //           {
  //             label: 'Home Theather',
  //             items: [
  //               { label: 'Projector' },
  //               { label: 'Speakers' },
  //               { label: 'TVs' },
  //             ],
  //           },
  //         ],
  //         [
  //           {
  //             label: 'Gaming',
  //             items: [
  //               { label: 'Accessories' },
  //               { label: 'Console' },
  //               { label: 'PC' },
  //               { label: 'Video Games' },
  //             ],
  //           },
  //         ],
  //         [
  //           {
  //             label: 'Appliances',
  //             items: [
  //               { label: 'Coffee Machine' },
  //               { label: 'Fridge' },
  //               { label: 'Oven' },
  //               { label: 'Vaccum Cleaner' },
  //               { label: 'Washing Machine' },
  //             ],
  //           },
  //         ],
  //       ],
  //     },
  //     {
  //       label: 'Foods',
  //       icon: 'pi pi-trophy',
  //       items: [
  //         [
  //           {
  //             label: 'Football',
  //             items: [
  //               { label: 'Kits' },
  //               { label: 'Shoes' },
  //               { label: 'Shorts' },
  //               { label: 'Training' },
  //             ],
  //           },
  //         ],
  //         [
  //           {
  //             label: 'Running',
  //             items: [
  //               { label: 'Accessories' },
  //               { label: 'Shoes' },
  //               { label: 'T-Shirts' },
  //               { label: 'Shorts' },
  //             ],
  //           },
  //         ],
  //         [
  //           {
  //             label: 'Swimming',
  //             items: [
  //               { label: 'Kickboard' },
  //               { label: 'Nose Clip' },
  //               { label: 'Swimsuits' },
  //               { label: 'Paddles' },
  //             ],
  //           },
  //         ],
  //         [
  //           {
  //             label: 'Tennis',
  //             items: [
  //               { label: 'Balls' },
  //               { label: 'Rackets' },
  //               { label: 'Shoes' },
  //               { label: 'Training' },
  //             ],
  //           },
  //         ],
  //       ],
  //     },
  //     {
  //       label: 'Sports',
  //       icon: 'pi pi-clock',
  //       items: [
  //         [
  //           {
  //             label: 'Football',
  //             items: [
  //               { label: 'Kits' },
  //               { label: 'Shoes' },
  //               { label: 'Shorts' },
  //               { label: 'Training' },
  //             ],
  //           },
  //         ],
  //         [
  //           {
  //             label: 'Running',
  //             items: [
  //               { label: 'Accessories' },
  //               { label: 'Shoes' },
  //               { label: 'T-Shirts' },
  //               { label: 'Shorts' },
  //             ],
  //           },
  //         ],
  //         [
  //           {
  //             label: 'Swimming',
  //             items: [
  //               { label: 'Kickboard' },
  //               { label: 'Nose Clip' },
  //               { label: 'Swimsuits' },
  //               { label: 'Paddles' },
  //             ],
  //           },
  //         ],
  //         [
  //           {
  //             label: 'Tennis',
  //             items: [
  //               { label: 'Balls' },
  //               { label: 'Rackets' },
  //               { label: 'Shoes' },
  //               { label: 'Training' },
  //             ],
  //           },
  //         ],
  //       ],
  //     },
  //   ];
   }

  sendArray() {
    localStorage.setItem('item', JSON.stringify(this.giftBoxItems));
    this.sharedDataService.setData(this.giftBoxItems);
    this.router.navigate(['/check-out']);
  }
  showDialog() {
    this.visible = true;
  }

  toggleDescription(item: any) {
    item.showFullDescription = !item.showFullDescription;
  }

  addToGiftBox(id: number) {
    //Add items for giftBox
    if (!this.giftBoxItems.includes(id)) {
      this.giftBoxItems.push(id);
      this.giftboxCount = this.giftBoxItems.length;
      this.clearMsg();
      this.giftAddedMsg();
      console.log(`Item ${id} added. Total items: ${this.giftboxCount}`);
    } else {
      this.giftAlreadyAddedMsg();
    }
  }

  removeItemFromArray(item: number): void {
    const index = this.giftBoxItems.indexOf(item);

    if (index !== -1) {
      // Item exists in the array, so remove it
      this.giftBoxItems.splice(index, 1);
      this.getGiftBoxItems();
      this.giftboxCount = this.giftBoxItems.length;
      console.log(`Item ${item} removed. Updated array:`, this.giftBoxItems);
    } else {
      console.log(`Item ${item} not found in the array.`);
    }
  }

  getGiftBoxItems(): void {
    //Get GiftBox items details
    //console.log("ffff" + this.giftBoxItems);
    if (this.giftBoxItems.length == 0) {
      this.emptyGiftBoxMsg();
      //this.clearMsg();
    } else {
      this.giftItemsService.getAllGiftBoxItems(this.giftBoxItems).subscribe(
        (data: any) => {
          if (data.status) {
            this.giftBoxItemsDetails = data.payload[0].map((item: any) => ({
              ...item,
              image: item.image ? 'data:image/png;base64,' + item.image : '',
            }));
            // this.giftBoxItemsDetails = data.payload[0];
            console.log(this.giftBoxItemsDetails);
          } else {
            console.error(data.errorMessages);
          }
        },
        (error) => {
          console.error('Error fetching items:', error);
        }
      );

      this.showDialog();
    }
  }

  fetchAllItems(): void {
    this.giftItemsService.getAllGiftItems().subscribe((data) => {
      if (!data || !data.payload) {
        console.error('Invalid data format:', data);
        return;
      }

      // Map and convert base64 image
      const items = data.payload.map((item: any) => ({
        ...item,
        image: item.image ? 'data:image/png;base64,' + item.image : '',
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

  onSearch() {
    this.searchSubject.next(this.searchTerm); // Send search term to Subject
  }

  fetchSearchResults(searchText: string) {
    if (searchText.trim() === '') {
      this.items = []; // Clear items if input is empty
      this.isModalVisible = false;
      return;
    }

    this.giftItemsService.searchByName(searchText).subscribe(
      (data) => {
        this.items = data.map((item) =>
          this.giftItemsService.convertImageUrl(item)
        ); // Convert images
        this.isModalVisible = true; // Show the modal when data is fetched
      },
      (error) => {
        console.error('Error fetching items:', error);
      }
    );
  }

  closeModal() {
    this.isModalVisible = false; // Close the modal
  }

  clearMsg() {
    this.messageService.clear();
  }
  giftAlreadyAddedMsg() {
    this.messageService.add({
      severity: 'info',
      summary: 'info',
      detail: 'This item is already added in gift box!',
    });
  }

  giftAddedMsg() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Item successfully added to gift Box!',
    });
  }
  emptyGiftBoxMsg() {
    this.messageService.add({
      severity: 'warn',
      summary: 'Warn',
      detail: 'GiftBox is empty!',
    });
  }
}
