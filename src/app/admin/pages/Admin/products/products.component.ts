import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import { GiftItemsService } from '../../../../services/items.service';
import { CategoryService } from '../../../../services/category.service';
import { Item } from '../../../model/itemModel';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  // Data properties
  fetchingItems: any[] = [];
  fetchingCategories: any[] = [];
  fetchingSubCategories: any[] = [];
  selectedCategory: any = null;
  
  // UI state properties
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  visible: boolean = false;
  isUpdate: boolean = false;
  previewImage: string | null = null;
  loading: boolean = false;
  submitting: boolean = false;
  
  // Dashboard metrics
  totalItems: number = 0;
  itemsInStock: number = 0;
  lowStockItems: any[] = [];
  
  // Form
  productForm: FormGroup;

  constructor(
    private _apim: CategoryService,
    private giftItemsService: GiftItemsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
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
    this.loading = true;
    this.setupBreadcrumb();
    this.fetchAllItems();
    this.fetchAllCategories();
  }

  setupBreadcrumb(): void {
    this.items = [
      { label: 'EMart' },
      { label: 'Admin' },
      { label: 'Products' },
    ];
    this.home = { icon: 'pi pi-home', routerLink: '/admin/dash' };
  }

  onFileSelected(event: any) {
    const file = event.files[0];
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

  clearImage(): void {
    this.previewImage = null;
    this.productForm.get('image')?.setValue(null);
  }

  addProduct() {
    if (this.productForm.invalid) {
      this.validateAllFormFields();
      this.showError('Please fill in all required fields');
      return;
    }

    this.submitting = true;
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

    this.giftItemsService.addItem(Obj).subscribe({
      next: (response) => {
        console.log('Product added:', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Product added successfully!',
          life: 3000
        });
        this.productForm.reset();
        this.visible = false;
        this.previewImage = null;
        this.fetchAllItems();
      },
      error: (error) => {
        console.error('Error adding product:', error);
        this.showError('Failed to add product. Please try again.');
      },
      complete: () => {
        this.submitting = false;
      }
    });
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
    this.loading = true;
    this.fetchingItems = [];
    
    this.giftItemsService.getAllItems().subscribe({
      next: (data) => {
        // Assuming data.payload contains the array of products
        this.fetchingItems = data.payload.map((item: any) => ({
          ...item,
          image: item.image ? 'data:image/png;base64,' + item.image : '', // Convert base64 to image URL
        }));
        
        // Calculate dashboard metrics
        this.totalItems = this.fetchingItems.length;
        this.itemsInStock = this.fetchingItems.filter(item => item.itemCount > 0).length;
        
        // Get low stock items
        this.lowStockItems = this.fetchingItems
          .filter(item => item.itemCount <= item.reOrderLevel)
          .map(item => ({
            name: item.name,
            category: item.catagoryName,
            currentStock: item.itemCount,
            reorderLevel: item.reOrderLevel
          }));
      },
      error: (error) => {
        console.error('Error fetching items:', error);
        this.showError('Failed to load products. Please try again.');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  fetchAllCategories(): void {
    this._apim.getAllCategories().subscribe({
      next: (data: any) => {
        // Assuming data.payload contains the array of categories
        this.fetchingCategories = data.payload.map((category: any) => ({
          ...category,
        }));
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
        this.showError('Failed to load categories. Please try again.');
      }
    });
  }

  fetchSubCategoriesByCategoryId(id: number): void {
    this.fetchingSubCategories = [];
    this._apim.getSubCategoriesByCategoryId(id).subscribe({
      next: (data: any) => {
        if (data.payload && data.payload[0]) {
          this.fetchingSubCategories = data.payload[0].map((subCategory: any) => ({
            ...subCategory,
          }));
        }
        console.log('Fetched subcategories:', this.fetchingSubCategories);
      },
      error: (error) => {
        console.error('Error fetching subcategories:', error);
        this.showError('Failed to load subcategories. Please try again.');
      }
    });
  }

  deleteProduct(pId: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this product? This action cannot be undone.',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;
        const product = {
          id: pId,
          commonStatus: 'DELETED',
        };
        
        this.giftItemsService.deleteItem(product).subscribe({
          next: (response) => {
            console.log('Product deleted:', response);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Product deleted successfully!',
              life: 3000
            });
            this.fetchAllItems();
          },
          error: (error) => {
            console.error('Error deleting product:', error);
            this.showError('Failed to delete product. Please try again.');
          },
          complete: () => {
            this.loading = false;
          }
        });
      }
    });
  }

  fetchProduct(pId: any) {
    this.loading = true;
    this.visible = true;
    this.isUpdate = true;
    
    this.giftItemsService.getAllItemsbyId([pId]).subscribe({
      next: (data) => {
        const item = data.payload[0][0];
        
        // Set selected category and load subcategories
        this.selectedCategory = item.category;
        this.fetchSubCategoriesByCategoryId(item.category);
        
        this.productForm.patchValue({
          id: item.id,
          name: item.name,
          unitPrice: item.unitPrice,
          commonStatus: item.commonStatus,
          description: item.description,
          subCategory: item.subCategory,
          category: item.category,
          image: item.image,
          itemCount: item.itemCount,
          discount: item.discount,
          reOrderLevel: item.reOrderLevel,
        });
        
        // Set preview image if available
        this.previewImage = item.image ? 'data:image/png;base64,' + item.image : null;
      },
      error: (error) => {
        console.error('Error fetching product:', error);
        this.showError('Failed to load product details. Please try again.');
        this.visible = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  updateProduct() {
    if (this.productForm.invalid) {
      this.validateAllFormFields();
      this.showError('Please fill in all required fields');
      return;
    }

    this.submitting = true;
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

    this.giftItemsService.updateItem(Obj).subscribe({
      next: (response) => {
        console.log('Product updated:', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Product updated successfully!',
          life: 3000
        });
        this.productForm.reset();
        this.visible = false;
        this.previewImage = null;
        this.fetchAllItems();
      },
      error: (error) => {
        console.error('Error updating product:', error);
        this.showError('Failed to update product. Please try again.');
      },
      complete: () => {
        this.submitting = false;
      }
    });
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

  // Helper methods
  validateAllFormFields(formGroup: FormGroup = this.productForm) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else {
        control?.markAsTouched({ onlySelf: true });
      }
    });
  }

  showError(message: string = 'Operation failed. Please try again.') {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 5000
    });
  }
}
