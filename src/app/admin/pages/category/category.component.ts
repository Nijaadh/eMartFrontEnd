import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { GiftItemsService } from '../../../services/items.service';
import { Category, SubCategory } from '../../model/categoryModel';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent implements OnInit {
  category: MenuItem[] | undefined;
  home: MenuItem | undefined;
  visible: boolean = false;
  subModelVisible: boolean = false;
  categoryForm: FormGroup;
  subCategoryForm: FormGroup;
  fetchingCategories: any[] = [];
  fetchingSubCategories: any[] = [];

  constructor(
    private _apim: CategoryService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private giftItemsService: GiftItemsService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      commonStatus: ['ACTIVE'],
      image: ['', Validators.required],
    });

    this.subCategoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      commonStatus: ['ACTIVE'],
      image: ['', Validators.required],
      category: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.category = [
      { label: 'EMart' },
      { label: 'Admin' },
      { label: 'category' },
    ];

    this.home = { icon: 'pi pi-slack', routerLink: '/admin/category' };
    this.fetchAllCategories();
    this.fetchSubAllCategories();
  }

  addCategory() {
    if (this.categoryForm.invalid) {
      this.showError();
      return;
    }

    let Obj: Category = {
      name: this.categoryForm.value.name,
      description: this.categoryForm.value.description,
      image: this.categoryForm.value.image,
      commonStatus: this.categoryForm.value.commonStatus,
    };
    console.log(Obj);

    this._apim.addCategory(Obj).subscribe(
      (response) => {
        console.log('Product added:', response);
        this.show();
        this.visible = false;
        this.fetchAllCategories();
      },
      (error) => {
        console.log('Error in adding category, ', error);
      }
    );
  }

  addSubCategory() {
    if (this.subCategoryForm.invalid) {
      this.showError();
      return;
    }

    let Obj: SubCategory = {
      name: this.subCategoryForm.value.name,
      description: this.subCategoryForm.value.description,
      image: this.subCategoryForm.value.image,
      commonStatus: this.subCategoryForm.value.commonStatus,
      categoryId: this.subCategoryForm.value.category,
    };
    console.log("sub");
    console.log(Obj);

    this._apim.addSubCategory(Obj).subscribe(
      (response) => {
        console.log('Product added:', response);
        this.visible = false;
        this.fetchSubAllCategories();
      },
      (error) => {
        console.log('Error in adding category, ', error);
        this.fetchSubAllCategories();
      }
    );
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

  fetchSubAllCategories(): void {
    this._apim.getAllSubCategories().subscribe((data: any) => {
      console.log(data);
      this.fetchingSubCategories = data.payload.map((subCategory: any) => ({
        ...subCategory,
      }));
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
      this.fetchAllCategories();
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.categoryForm.patchValue({
        image: reader.result?.toString().split(',')[1] || '',
      });
    };
  }

  showDialog() {
    this.visible = true;
  }

  showSubCategoryDialog() {
    this.subModelVisible = true;
  }

  toggleDescription(item: any) {
    item.showFullDescription = !item.showFullDescription;
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
