import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-item-profile',
  templateUrl: './item-profile.component.html',
  styleUrl: './item-profile.component.scss',
})
export class ItemProfileComponent implements OnInit {
  productId: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    // Fetch product by ID

    console.log('Product ID:', this.productId);
  }
}
