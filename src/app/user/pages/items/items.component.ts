import { Component, OnInit } from '@angular/core';
import { MessageService, TreeNode } from 'primeng/api';
import { debounceTime, Subject } from 'rxjs';
import { GiftItemsService } from '../../../services/items.service';
import { SharedDataService } from '../../../services/shared-data.service';
import { Router } from '@angular/router';

interface Country {
  name: string;
  code: string;
}

interface SortOption {
  name: string;
  value: string;
}


interface PriceRange {
  name: string;
  value: { min: number; max: number };
}

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss'
})
export class ItemsComponent implements OnInit {
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
  allItems: any[] = [];
  filteredItems: any[] = [];
  currentPage: number = 0;

  //--search-modal---
  category: any[] = [];

   // Filter options
   sortOptions: SortOption[] = [
    { name: 'Newest First', value: 'newest' },
    { name: 'Price: Low to High', value: 'priceLow' },
    { name: 'Price: High to Low', value: 'priceHigh' },
    { name: 'Alphabetical', value: 'alpha' },
  ];

  priceRanges: PriceRange[] = [
    { name: 'All Prices', value: { min: 0, max: 100000 } },
    { name: 'Under 1000 LKR', value: { min: 0, max: 1000 } },
    { name: 'Under 2000 LKR', value: { min: 0, max: 2000 } },
    { name: 'Under 5000 LKR', value: { min: 0, max: 5000 } },
    { name: '5000+ LKR', value: { min: 5000, max: 100000 } },
  ];

  selectedSortOption: SortOption = this.sortOptions[0]; // Default to 'Newest First'
  selectedPriceRange: PriceRange = this.priceRanges[0]; // Default to 'All Prices'
  inStockOnly: boolean = false;
  selectedCategory: TreeNode | null = null;

    // Pagination
    itemsPerPage: number = 12;
    totalItems: number = 0;
    categories: any[] = [];
    

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
    this.setupCategoryTree()
    
   }

   setupCategoryTree() {
    this.categories = [
      {
        label: 'Electronic Devices',
        key: 'electronic-devices',
        selectable: false,
        children: [
          { label: 'Cameras', key: 'cameras' },
          { label: 'Refurbished Devices', key: 'refurbished-devices' },
          { label: 'Mobiles', key: 'mobiles' },
          { label: 'Tablets', key: 'tablets' },
          { label: 'Desktops', key: 'desktops' },
          { label: 'Laptops', key: 'laptops' }
        ]
      },
      {
        label: 'Electronic Accessories',
        key: 'electronic-accessories',
        selectable: false,
        children: [
          { label: 'Headphones', key: 'headphones' },
          { label: 'Chargers', key: 'chargers' },
          { label: 'Power Banks', key: 'power-banks' },
          { label: 'Cables & Adapters', key: 'cables-adapters' }
        ]
      },
      {
        label: 'Babies & Toys',
        key: 'babies-toys',
        selectable: false,
        children: [
          { label: 'Baby Gear', key: 'baby-gear' },
          { label: 'Toys for Boys', key: 'toys-boys' },
          { label: 'Toys for Girls', key: 'toys-girls' },
          { label: 'Educational Toys', key: 'educational-toys' }
        ]
      },
      {
        label: 'Groceries & Pets',
        key: 'groceries-pets',
        selectable: false,
        children: [
          { label: 'Food Staples', key: 'food-staples' },
          { label: 'Beverages', key: 'beverages' },
          { label: 'Pet Food', key: 'pet-food' },
          { label: 'Household Supplies', key: 'household-supplies' }
        ]
      },
      {
        label: 'TV & Home Appliances',
        key: 'tv-home-appliances',
        selectable: false,
        children: [
          { label: 'Televisions', key: 'televisions' },
          { label: 'Washing Machines', key: 'washing-machines' },
          { label: 'Refrigerators', key: 'refrigerators' },
          { label: 'Air Conditioners', key: 'air-conditioners' }
        ]
      },
      {
        label: 'Health & Beauty',
        key: 'health-beauty',
        selectable: false,
        children: [
          { label: 'Skincare', key: 'skincare' },
          { label: 'Hair Care', key: 'hair-care' },
          { label: 'Makeup', key: 'makeup' },
          { label: 'Personal Care', key: 'personal-care' }
        ]
      },
      {
        label: 'Men\'s Fashion',
        key: 'mens-fashion',
        selectable: false,
        children: [
          { label: 'Shirts', key: 'shirts' },
          { label: 'Trousers', key: 'trousers' },
          { label: 'Shoes', key: 'shoes' },
          { label: 'Accessories', key: 'mens-accessories' }
        ]
      },
      {
        label: 'Women\'s Fashion',
        key: 'womens-fashion',
        selectable: false,
        children: [
          { label: 'Dresses', key: 'dresses' },
          { label: 'Handbags', key: 'handbags' },
          { label: 'Jewelry', key: 'jewelry' },
          { label: 'Shoes', key: 'womens-shoes' }
        ]
      },
      {
        label: 'Home & Lifestyle',
        key: 'home-lifestyle',
        selectable: false,
        children: [
          { label: 'Furniture', key: 'furniture' },
          { label: 'Bedding', key: 'bedding' },
          { label: 'Decor', key: 'decor' },
          { label: 'Lighting', key: 'lighting' }
        ]
      },
      {
        label: 'Automotive & Motorbike',
        key: 'automotive-motorbike',
        selectable: false,
        children: [
          { label: 'Car Accessories', key: 'car-accessories' },
          { label: 'Motorcycle Gear', key: 'motorcycle-gear' },
          { label: 'Car Electronics', key: 'car-electronics' },
          { label: 'Spare Parts', key: 'spare-parts' }
        ]
      },
      {
        label: 'Watches & Accessories',
        key: 'watches-accessories',
        selectable: false,
        children: [
          { label: 'Men\'s Watches', key: 'mens-watches' },
          { label: 'Women\'s Watches', key: 'womens-watches' },
          { label: 'Sunglasses', key: 'sunglasses' },
          { label: 'Wallets & Belts', key: 'wallets-belts' }
        ]
      },
      {
        label: 'Sports & Outdoor',
        key: 'sports-outdoor',
        selectable: false,
        children: [
          { label: 'Sportswear', key: 'sportswear' },
          { label: 'Fitness Equipment', key: 'fitness-equipment' },
          { label: 'Camping Gear', key: 'camping-gear' },
          { label: 'Bicycles', key: 'bicycles' }
        ]
      }
    ];    
  }

   clearFilters(): void {
    this.selectedSortOption = this.sortOptions[0];
    this.selectedPriceRange = this.priceRanges[0];
    this.inStockOnly = false;
    this.selectedCategory = null;
    this.searchTerm = '';
    this.currentPage = 0;
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.allItems];

    // Apply category filter if selected
    if (this.selectedCategory && this.selectedCategory.data !== 'all') {
      const categoryData = this.selectedCategory.data;
      // This is a simplified filter - you would need to implement proper category filtering
      result = result.filter((item) =>
        item.category.toLowerCase().includes(categoryData.split('-')[0])
      );
    }

    // Apply price range filter
    if (this.selectedPriceRange) {
      const { min, max } = this.selectedPriceRange.value;
      result = result.filter(
        (item) => item.unitPrice >= min && item.unitPrice <= max
      );
    }

    // Apply in-stock filter (simulated)
    if (this.inStockOnly) {
      result = result.filter((item) => Math.random() > 0.2); // Simulated for demo
    }

    // Apply search term filter
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    if (this.selectedSortOption) {
      switch (this.selectedSortOption.value) {
        case 'newest':
          // Assuming items have a date field - simulated for demo
          result.sort((a, b) => b.id - a.id);
          break;
        case 'priceLow':
          result.sort((a, b) => a.unitPrice - b.unitPrice);
          break;
        case 'priceHigh':
          result.sort((a, b) => b.unitPrice - a.unitPrice);
          break;
        case 'alpha':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
      }
    }

    // Update total for pagination
    this.totalItems = result.length;

    // Apply pagination
    const startIndex = this.currentPage * this.itemsPerPage;
    this.filteredItems = result.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }


  onFilterChange(): void {
    console.log('Filters changed:', {
      selectedSort: this.selectedSortOption,
      selectedPrice: this.selectedPriceRange,
      inStockOnly: this.inStockOnly
    });
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  goToProfile(itemId: string) {
    this.router.navigate(['/item', itemId]);
    console.log(this.fetchingItems);

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

  hasActiveFilters(): boolean {
    return !!(
      this.searchTerm || 
      this.selectedCategory || 
      this.selectedSortOption || 
      this.selectedPriceRange || 
      this.inStockOnly
    );
  }

  getRandomizedItems(items: any[]): any[] {
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm = value;
    this.searchSubject.next(value);
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
      detail: 'This item is already added in Cart!',
    });
  }

  giftAddedMsg() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Item successfully added to Cart!',
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
