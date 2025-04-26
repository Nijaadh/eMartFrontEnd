import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  // Featured products data (if needed for carousel)
  featuredProducts = [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 129.99,
      image: '/assets/products/headphones.jpg',
      category: 'Electronics'
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 199.99,
      image: '/assets/products/smartwatch.jpg',
      category: 'Electronics'
    },
    {
      id: 3,
      name: 'Running Shoes',
      price: 89.99,
      image: '/assets/products/shoes.jpg',
      category: 'Fashion'
    },
    {
      id: 4,
      name: 'Coffee Maker',
      price: 79.99,
      image: '/assets/products/coffeemaker.jpg',
      category: 'Home & Kitchen'
    }
  ];
  
  // Categories data
  categories = [
    {
      name: 'Electronics',
      icon: 'pi pi-desktop',
      color: 'blue',
      description: 'Latest gadgets & devices'
    },
    {
      name: 'Fashion',
      icon: 'pi pi-shopping-bag',
      color: 'green',
      description: 'Trendy clothes & accessories'
    },
    {
      name: 'Home & Kitchen',
      icon: 'pi pi-home',
      color: 'amber',
      description: 'Everything for your home'
    },
    {
      name: 'Beauty & Health',
      icon: 'pi pi-heart',
      color: 'purple',
      description: 'Self-care essentials'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // Initialize AOS animation library
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: false,
      mirror: false,
      offset: 120
    });
    
    // Clear any stored gift box data
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem('giftBoxID');
      localStorage.removeItem('giftBoxPrice');
    }
  }
}
