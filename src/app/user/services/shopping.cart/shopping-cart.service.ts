import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../../model/cart.item';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private cartItems: CartItem[] = [];
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  private cartCountSubject = new BehaviorSubject<number>(0);
  private cartTotalSubject = new BehaviorSubject<number>(0);

  constructor() {
    // Load cart from localStorage on service initialization
    this.loadCartFromStorage();
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItemsSubject.asObservable();
  }

  getCartCount(): Observable<number> {
    return this.cartCountSubject.asObservable();
  }

  getCartTotal(): Observable<number> {
    return this.cartTotalSubject.asObservable();
  }

  addToCart(item: any): void {
    const existingItemIndex = this.cartItems.findIndex(cartItem => cartItem.id === item.id);
    
    if (existingItemIndex > -1) {
      // Item already exists, increment quantity
      this.cartItems[existingItemIndex].quantity += 1;
    } else {
      // Add new item with quantity 1
      const cartItem: CartItem = {
        id: item.id,
        name: item.name,
        unitPrice: item.unitPrice,
        image: item.image,
        quantity: 1,
        description: item.description
      };
      this.cartItems.push(cartItem);
    }
    
    this.updateCart();
  }

  removeFromCart(itemId: number): void {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    this.updateCart();
  }

  updateQuantity(itemId: number, quantity: number): void {
    const index = this.cartItems.findIndex(item => item.id === itemId);
    
    if (index > -1) {
      if (quantity <= 0) {
        // If quantity is 0 or negative, remove the item
        this.removeFromCart(itemId);
      } else {
        // Update quantity
        this.cartItems[index].quantity = quantity;
        this.updateCart();
      }
    }
  }

  incrementQuantity(itemId: number): void {
    const index = this.cartItems.findIndex(item => item.id === itemId);
    if (index > -1) {
      this.cartItems[index].quantity += 1;
      this.updateCart();
    }
  }

  decrementQuantity(itemId: number): void {
    const index = this.cartItems.findIndex(item => item.id === itemId);
    if (index > -1) {
      if (this.cartItems[index].quantity > 1) {
        this.cartItems[index].quantity -= 1;
        this.updateCart();
      } else {
        // If quantity becomes 0, remove the item
        this.removeFromCart(itemId);
      }
    }
  }

  clearCart(): void {
    this.cartItems = [];
    this.updateCart();
  }

  private updateCart(): void {
    // Update observables
    this.cartItemsSubject.next([...this.cartItems]);
    
    // Update cart count (sum of all quantities)
    const itemCount = this.cartItems.reduce((count, item) => count + item.quantity, 0);
    this.cartCountSubject.next(itemCount);
    
    // Update cart total
    const total = this.cartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    this.cartTotalSubject.next(total);
    
    // Save to localStorage
    this.saveCartToStorage();
  }

  private saveCartToStorage(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    }
  }

  private loadCartFromStorage(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const storedCart = localStorage.getItem('cartItems');
      if (storedCart) {
        this.cartItems = JSON.parse(storedCart);
        this.updateCart();
      }
    }
  }
}