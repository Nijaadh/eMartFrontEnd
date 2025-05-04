import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { GiftItemsService } from '../../../services/items.service';
import { CategoryService } from '../../../services/category.service';
import { Item } from '../../model/itemModel';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  fetchingItems: any[] = [];
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  productForm: FormGroup;
  selectedCategory: any = null;
  fetchingCategories: any[] = [];
  fetchingSubCategories: any[] = [];
  visible: boolean = false;
  isUpdate: boolean = false;
  previewImage: string | null = null;

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
      itemCount: ['', Validators.required],
      reOrderLevel: ['', Validators.required],
      discount: ['', Validators.required],
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
    const file = event.files[0]; // Updated to match PrimeNG's p-fileUpload component
    if (!file) return;
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64Image = reader.result?.toString().split(',')[1] || '';
      this.productForm.patchValue({
        image: base64Image
      });
      // Set preview image for UI display
      this.previewImage = 'data:image/png;base64,' + base64Image;
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
      itemCount: product.itemCount,
      discount: product.discount,
      reOrderLevel: product.reOrderLevel,
    };

    this.giftItemsService.addItem(Obj).subscribe(
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

  onCategorySelectionChange(event: any): void {
    const categoryId = event.value;
    console.log('Selected Category ID:', categoryId);
    if (categoryId) {
      this.fetchSubCategoriesByCategoryId(categoryId);
    } else {
      this.fetchingSubCategories = [];
      this.productForm.get('subCategory')?.setValue(null);
    }
  }

  fetchAllItems(): void {
    this.fetchingItems = [];
    this.giftItemsService.getAllItems().subscribe((data) => {
      // Assuming data.payload contains the array of products
      this.fetchingItems = data.payload.map((item: any) => ({
        ...item,
        image: item.image ? 'data:image/png;base64,' + item.image : '', // Convert base64 to image URL
      }));
    });
  }

  fetchAllCategories(): void {
    this._apim.getAllCategories().subscribe((data: any) => {
      // Assuming data.payload contains the array of categories
      this.fetchingCategories = data.payload.map((category: any) => ({
        ...category,
      }));
    });
  }

  fetchSubCategoriesByCategoryId(id: number): void {
    this.fetchingSubCategories = [];
    this._apim.getSubCategoriesByCategoryId(id).subscribe((data: any) => {
      if (data.payload && data.payload[0]) {
        this.fetchingSubCategories = data.payload[0].map((subCategory: any) => ({
          ...subCategory,
        }));
      }
      console.log('Fetched subcategories:', this.fetchingSubCategories);
    });
  }

  deleteProduct(pId: any) {
    const product = {
      id: pId,
      commonStatus: 'DELETED',
    };
    this.giftItemsService.deleteItem(product).subscribe((response) => {
      console.log(response);
      this.detete();
      this.fetchAllItems();
    });
  }

  fetchProduct(pId: any) {
    this.visible = true;
    this.isUpdate = true;
    this.giftItemsService.getAllItemsbyId([pId]).subscribe((data) => {
      const item = data.payload[0][0];
      
      // Set selected category and load subcategories
      this.selectedCategory = item.categoryId;
      this.fetchSubCategoriesByCategoryId(item.categoryId);
      
      this.productForm.patchValue({
        id: item.id,
        name: item.name,
        unitPrice: item.unitPrice,
        commonStatus: item.commonStatus,
        description: item.description,
        subCategory: item.subCategoryId,
        category: item.categoryId,
        image: item.image,
        itemCount: item.itemCount,
        discount: item.discount,
        reOrderLevel: item.reOrderLevel,
      });
      
      // Set preview image if available
      this.previewImage = item.image ? 'data:image/png;base64,' + item.image : null;
    });
  }

  updateProduct() {
    if (this.productForm.invalid) {
      this.showError();
      return;
    }
    let product = this.productForm.value;
    let Obj: Item = {
      id: product.id,
      name: product.name,
      unitPrice: product.unitPrice,
      commonStatus: product.commonStatus,
      description: product.description,
      subCategoryId: product.subCategory,
      category: product.category,
      image: product.image,
      itemCount: product.itemCount,
      discount: product.discount,
      reOrderLevel: product.reOrderLevel,
    };

    console.log(Obj);

    this.giftItemsService.updateItem(Obj).subscribe(
      (response) => {
        console.log('Product updated:', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Product updated successfully!',
        });
        this.productForm.reset();
        this.visible = false;
        this.fetchAllItems();
      },
      (error) => {
        this.showError();
      }
    );
  }

  cancelDialog() {
    this.visible = false;
    this.isUpdate = false;
    this.productForm.reset();
    this.previewImage = null;
  }

  Refresh() {
    this.fetchAllItems();
  }

  show() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Product added successfully!',
    });
  }

  detete() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Product deleted successfully!',
    });
  }

  showError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Operation failed. Please try again.',
    });
  }
}