import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { GiftItemsService } from '../../../services/gift-items.service';
import { CategoryService } from '../../../services/category.service';
import { Item } from '../../model/itemModel';
import { error } from 'console';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  fetchingItems: any[] = []; // For fetchingProduct
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  productForm: FormGroup;
  selectedCategory: number = 0;
  selectedSubCategory: number = 0;
  fetchingCategories: any[] = [];
  fetchingSubCategories: any[] = [];
  visible: boolean = false;

  constructor(
    private _apim: CategoryService,
    private giftItemsService: GiftItemsService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      unitPrice: ['', Validators.required],
      commonStatus: ['ACTIVE'],
      description: ['', Validators.required],
      category: ['', Validators.required],
      subCategory: ['', Validators.required],
      image: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.fetchAllItems();
    this.fetchAllCategories();
    this.items = [
      { label: 'EMart' },
      { label: 'Admin' },
      { label: 'Products' },
    ];
    this.home = { icon: 'pi pi-slack', routerLink: '/admin/dash' };
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.productForm.patchValue({
        image: reader.result?.toString().split(',')[1] || '',
      });
    };
  }

  addProduct() {
    if (this.productForm.invalid) {
      this.showError();
      return;
    }
    let product = this.productForm.value;
    let Obj: Item = {
      id: '',
      name: product.name,
      unitPrice: product.unitPrice,
      commonStatus: product.commonStatus,
      description: product.description,
      subCategoryId: product.subCategory,
      category: product.category,
      image: product.image,
    };

    console.log(Obj);

    this.giftItemsService.addGiftItem(Obj).subscribe(
      (response) => {
        console.log('Product added:', response);
        this.show();
        this.productForm.reset();
        this.visible = false;
        this.fetchAllItems();
      },
      (error) => {
        this.showError();
      }
    );
  }

  onCategoryeSelectionChange(event: any): void {
    this.selectedCategory = event.target.value;
    this.fetchSubCategoriesByCategoryId(this.selectedCategory);
  }

  onSubCategoryeSelectionChange(event: any): void {
    this.selectedSubCategory = event.target.value;
  }

  fetchAllItems(): void {
    this.fetchingItems = [];
    this.giftItemsService.getAllGiftItems().subscribe((data) => {
      // Assuming data.payload contains the array of products
      this.fetchingItems = data.payload.map((item: any) => ({
        ...item,
        image: item.image ? 'data:image/png;base64,' + item.image : '', // Convert base64 to image URL
      }));
    });
  }

  fetchAllCategories(): void {
    this._apim.getAllCategories().subscribe((data: any) => {
      // Assuming data.payload contains the array of products
      this.fetchingCategories = data.payload.map((category: any) => ({
        ...category,
        // image: item.image ? 'data:image/png;base64,' + item.image : '', // Convert base64 to image URL
      }));
    });
  }

  onCategorySelectionChange(event: any): void {
    this.selectedCategory = event.target.value;
    console.log('Selected Category ID:', this.selectedCategory);
    this.fetchSubCategoriesByCategoryId(this.selectedCategory)
  }
  

  fetchSubCategoriesByCategoryId(id: number): void {
    this.fetchingSubCategories = [];
    this._apim.getSubCategoriesByCategoryId(id).subscribe((data: any) => {
      this.fetchingSubCategories = data.payload[0].map((subCategory: any) => ({
        ...subCategory,
      }));

      console.log(this.fetchingSubCategories);
      console.log(data);
    });
  }

  deleteProduct(pId: any) {
    const product = {
      id: pId,
      commonStatus: 'DELETED',
    };
    this.giftItemsService.deleteGiftItem(product).subscribe((response) => {
      console.log(response);
      this.detete();
      this.fetchAllItems();
    });
  }
  toggleDescription(item: any) {
    item.showFullDescription = !item.showFullDescription;
  }

  showDialog() {
    this.visible = true;
  }

  Refresh() {
    this.fetchAllItems();
  }

  show() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Product added Successfully!',
    });
  }

  detete() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Product deletion Successfully!',
    });
  }
  showError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Product added Unsuccessfully!',
    });
  }
}
