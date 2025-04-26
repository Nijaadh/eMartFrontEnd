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
  inStockOnly: boolean = false;
  mobileFiltersVisible = false;
  screenIsSmall = false;

  //--search-modal---
  category: any[] = [];

  // Filter options
  sortOptions: SortOption[] = [
    { name: 'Default', value: 'default' },
    { name: 'Newest First', value: 'newest' },
    { name: 'Price: Low to High', value: 'priceLow' },
    { name: 'Price: High to Low', value: 'priceHigh' },
    { name: 'Alphabetical', value: 'alpha' },
  ];

  priceRanges: PriceRange[] = [
    { name: 'All Prices', value: { min: 0, max: Number.MAX_SAFE_INTEGER } },
    { name: 'Under 1000 LKR', value: { min: 0, max: 1000 } },
    { name: 'Under 2000 LKR', value: { min: 0, max: 2000 } },
    { name: 'Under 5000 LKR', value: { min: 0, max: 5000 } },
    { name: '5000+ LKR', value: { min: 5000, max: Number.MAX_SAFE_INTEGER } },
  ];

  selectedSortOption: SortOption = this.sortOptions[0]; // Default to 'Newest First'
  selectedPriceRange: PriceRange = this.priceRanges[0]; // Default to 'All Prices'
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

    this.checkScreenSize();
    window.addEventListener('resize', () => {
      this.checkScreenSize();
    });

    // Subscribe to cart updates
    this.cartSubscription = this.cartService
      .getCartItems()
      .subscribe((items) => {
        this.cartItems = items;
      });

    this.cartService.getCartCount().subscribe((count) => {
      this.cartCount = count;
    });

    this.cartService.getCartTotal().subscribe((total) => {
      this.cartTotal = total;
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  checkScreenSize() {
    this.screenIsSmall = window.innerWidth < 1024; // 'lg' breakpoint
    if (!this.screenIsSmall) {
      this.mobileFiltersVisible = false; // Always show filters on desktop
    }
  }

  toggleMobileFilters() {
    this.mobileFiltersVisible = !this.mobileFiltersVisible;
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
    ];
  }

  loadItems() {
    this.filteredItems = [...this.fetchingItems];
    this.totalItems = this.filteredItems.length;
  }

  applyFilters(): void {
    if (!this.fetchingItems || this.fetchingItems.length === 0) {
      return;
    }

    // If we're using the default option and no other filters are active,
    // just show all items without any sorting or filtering
    if (
      this.selectedSortOption.value === 'default' &&
      !this.searchTerm &&
      !this.selectedCategory &&
      this.selectedPriceRange === this.priceRanges[0] &&
      !this.inStockOnly
    ) {
      this.filteredItems = [...this.fetchingItems];
      this.totalItems = this.filteredItems.length;
      return;
    }

    let filtered = [...this.fetchingItems];

    // Apply search term
    if (this.searchTerm.trim() !== '') {
      const lowerSearch = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name?.toLowerCase().includes(lowerSearch) ||
          item.description?.toLowerCase().includes(lowerSearch)
      );
    }

    // Apply category filter
    if (this.selectedCategory) {
      const selectedKey = this.selectedCategory.key;
      const isParentCategory =
        this.selectedCategory.children &&
        this.selectedCategory.children.length > 0;

      filtered = filtered.filter((item) => {
        // If it's a parent category, match by categoryName
        if (isParentCategory) {
          return item.categoryName === selectedKey;
        }
        // If it's a child category, match by subCategoryName
        else {
          return item.subCategoryName === selectedKey;
        }
      });
    }

    // Apply price range filter
    if (
      this.selectedPriceRange &&
      this.selectedPriceRange !== this.priceRanges[0]
    ) {
      const { min, max } = this.selectedPriceRange.value;
      filtered = filtered.filter((item) => {
        // Convert to number since item.unitPrice might be a string
        const price = parseFloat(item.unitPrice);
        return (
          price >= min && (max === Number.MAX_SAFE_INTEGER || price <= max)
        );
      });
    }
    // Apply in-stock filter
    if (this.inStockOnly) {
      filtered = filtered.filter(
        (item) => item.itemCount && item.itemCount > 0
      );
    }

    // Apply sorting only if not using default
    if (this.selectedSortOption.value !== 'default') {
      switch (this.selectedSortOption.value) {
        case 'priceLow':
          filtered.sort(
            (a, b) => parseFloat(a.unitPrice) - parseFloat(b.unitPrice)
          );
          break;
        case 'priceHigh':
          filtered.sort(
            (a, b) => parseFloat(b.unitPrice) - parseFloat(a.unitPrice)
          );
          break;
        case 'alpha':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'newest':
          filtered.sort((a, b) => {
            // Parse ids to numbers for numeric comparison
            const idA = parseInt(a.id, 10);
            const idB = parseInt(b.id, 10);

            // Sort descending (higher/newer ids first)
            return idB - idA;
          });
          break;
      }
    }

    this.filteredItems = filtered;
    this.totalItems = filtered.length;
    console.log('Filtered items:', this.filteredItems.length);
  }

  clearFilters(): void {
    // Find the default sort option
    const defaultOption = this.sortOptions.find(
      (option) => option.value === 'default'
    );
    this.selectedSortOption = defaultOption || this.sortOptions[0];
    this.selectedPriceRange = this.priceRanges[0];
    this.inStockOnly = false;
    this.selectedCategory = null;
    this.searchTerm = '';
    this.currentPage = 0;

    // Reset to show all items
    this.filteredItems = [...this.fetchingItems];
    this.totalItems = this.filteredItems.length;
  }

  onFilterChange(): void {
    console.log('Filters changed:', {
      selectedSort: this.selectedSortOption,
      selectedPrice: this.selectedPriceRange,
      inStockOnly: this.inStockOnly,
      category: this.selectedCategory ? this.selectedCategory.key : 'none',
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
    this.giftItemsService.getAllItems().subscribe((data) => {
      if (!data || !data.payload) {
        console.error('Invalid data format:', data);
        return;
      }

      const items = data.payload.map((item: any) => ({
        ...item,
        image: item.image ? 'data:image/png;base64,' + item.image : '',
      }));

      // Store all items in fetchingItems
      this.fetchingItems = items;

      // Initialize filteredItems with all items
      this.filteredItems = [...this.fetchingItems];
      this.totalItems = this.filteredItems.length;

      console.log('Total items loaded:', this.fetchingItems.length);

      // Only apply filters if there are active filters
      if (this.hasActiveFilters()) {
        this.applyFilters();
      }
    });
  }

  hasActiveFilters(): boolean {
    return !!(
      this.searchTerm.trim() !== '' ||
      this.selectedCategory !== null ||
      (this.selectedSortOption &&
        this.selectedSortOption.value !== 'default') ||
      (this.selectedPriceRange &&
        this.selectedPriceRange !== this.priceRanges[0]) ||
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
    this.applyFilters(); // Apply filters immediately when search term changes
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
