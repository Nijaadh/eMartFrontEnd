import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { GiftItemsService } from '../../../services/gift-items.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  fetchingItems: any[] = []; // For fetchingProduct
  items: MenuItem[] | undefined
  home: MenuItem | undefined;

  productForm: FormGroup;

  // category dropdown
  categories: string[] = ['Electronics', 'Books', 'Foods', 'Stationeries'];

  constructor(
    private giftItemsService: GiftItemsService,
    private messageService: MessageService,
    private fb: FormBuilder,
  ) {
    this.productForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      unitPrice: ['', Validators.required],
      commonStatus: ['ACTIVE'],
      description: ['', Validators.required],
      category: ['', Validators.required],
      image: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchAllItems();
    this.items = [
      { label: 'GiftWave' },
      { label: 'Admin' },
      { label: 'Products' }
    ];
    this.home = { icon: 'pi pi-slack', routerLink: '/admin/dash' };
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.productForm.patchValue({ image: reader.result?.toString().split(',')[1] || '' });
    };
  }

  addProduct() {
    // alert("hello");
    // console.log("jhiu"+this.productForm.value);
    if (this.productForm.invalid) {
      this.showError();
      return;
    }

    const product = this.productForm.value;

    this.giftItemsService.addGiftItem(product).subscribe(response => {
      console.log('Product added:', response);
      this.show();
      this.fetchAllItems();
    });
  }
  fetchAllItems(): void {
    this.giftItemsService.getAllGiftItems().subscribe(data => {
      // Assuming data.payload contains the array of products
      this.fetchingItems = data.payload.map((item: any) => ({
        ...item,
        image: item.image ? 'data:image/png;base64,' + item.image : '' // Convert base64 to image URL
      }));
    });
  }

  deleteProduct(pId: any) {
    const product = {
      id: pId,
      commonStatus: "DELETED"
    }
    this.giftItemsService.deleteGiftItem(product).subscribe(response => {
      console.log(response);
      this.detete();
      this.fetchAllItems();
    });

  }
  toggleDescription(item: any) {
    item.showFullDescription = !item.showFullDescription;
  }
  show() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product added Successfully!' });
  }
  detete() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product deletion Successfully!' });
  }
  showError() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Product added Unsuccessfully!' });
  }
}
