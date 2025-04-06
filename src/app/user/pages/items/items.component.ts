import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService, TreeNode } from 'primeng/api';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { GiftItemsService } from '../../../services/items.service';
import { SharedDataService } from '../../../services/shared-data.service';
import { Router } from '@angular/router';
import { CartItem } from '../../model/cart.item';
import { ShoppingCartService } from '../../services/shopping.cart/shopping-cart.service';

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
  styleUrl: './items.component.scss',
})
export class ItemsComponent implements OnInit, OnDestroy {
  giftBox!: Country[];
  selectedGifts!: Country[];

  fetchingItems: any[] = [];
  visible: boolean = false;
  
  // Cart related
  cartCount: number = 0;
  cartItems: CartItem[] = [];
  cartTotal: number = 0;
  private cartSubscription: Subscription | null = null;

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
    private router: Router,
    private cartService: ShoppingCartService
  ) {
    this.searchSubject.pipe(debounceTime(300)).subscribe((searchText) => {
      this.fetchSearchResults(searchText);
    });
  }

  ngOnInit(): void {
    this.fetchAllItems();
    this.setupCategoryTree();
    
    // Subscribe to cart updates
    this.cartSubscription = this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
    });
    
    this.cartService.getCartCount().subscribe(count => {
      this.cartCount = count;
    });
    
    this.cartService.getCartTotal().subscribe(total => {
      this.cartTotal = total;
    });
  }
  
  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  setupCategoryTree() {
    // Same as original code
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
          { label: 'Laptops', key: 'laptops' },
        ],
      },
      // ... rest of categories remain the same
    ];
  }

  clearFilters(): void {
    // Same as original code
    this.selectedSortOption = this.sortOptions[0];
    this.selectedPriceRange = this.priceRanges[0];
    this.inStockOnly = false;
    this.selectedCategory = null;
    this.searchTerm = '';
    this.currentPage = 0;
    this.applyFilters();
  }

  applyFilters(): void {
    // Same as original code
  }

  onFilterChange(): void {
    console.log('Filters changed:', {
      selectedSort: this.selectedSortOption,
      selectedPrice: this.selectedPriceRange,
      inStockOnly: this.inStockOnly,
    });
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  goToProfile(itemId: string) {
    this.router.navigate(['/item', itemId]);
  }

  // New cart methods
  addToCart(item: any) {
    this.cartService.addToCart(item);
    this.clearMsg();
    this.itemAddedMsg();
  }

  showCart() {
    this.visible = true;
  }

  removeFromCart(itemId: number) {
    this.cartService.removeFromCart(itemId);
    this.messageService.add({
      severity: 'info',
      summary: 'Removed',
      detail: 'Item removed from cart',
    });
  }

  incrementQuantity(itemId: number) {
    this.cartService.incrementQuantity(itemId);
  }

  decrementQuantity(itemId: number) {
    this.cartService.decrementQuantity(itemId);
  }

  updateQuantity(item: CartItem, event: Event) {
    const input = event.target as HTMLInputElement;
    const quantity = parseInt(input.value, 10);
    
    if (!isNaN(quantity)) {
      this.cartService.updateQuantity(item.id, quantity);
    }
  }

  proceedToCheckout() {
    // Save cart data to shared service if needed
    this.sharedDataService.setData(this.cartItems);
    this.router.navigate(['/check-out']);
  }

  toggleDescription(item: any) {
    item.showFullDescription = !item.showFullDescription;
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

  itemAddedMsg() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Item successfully added to Cart!',
    });
  }
  
  itemAlreadyAddedMsg() {
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Item quantity increased in cart!',
    });
  }
  
  emptyCartMsg() {
    this.messageService.add({
      severity: 'warn',
      summary: 'Warn',
      detail: 'Your cart is empty!',
    });
  }
}