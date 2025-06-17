import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import {
  Category,
  SubCategory,
  DeleteCategory,
  UpCategory,
  UpSubCategory,
} from '../../../model/categoryModel';
import { CategoryService } from '../../../../services/category.service';

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
  isSubUpdate: boolean = false;
  isUpdate: boolean = false;

  constructor(
    private _apim: CategoryService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: [''], // Removed Validators.required
      commonStatus: ['ACTIVE'],
      image: [''], // Removed Validators.required
    });

    this.subCategoryForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: [''], // Removed Validators.required
      commonStatus: ['ACTIVE'],
      image: [''], // Removed Validators.required
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
    // Add debugging
    console.log('Category Form valid:', this.categoryForm.valid);
    console.log('Category Form errors:', this.categoryForm.errors);
    Object.keys(this.categoryForm.controls).forEach(key => {
      const control = this.categoryForm.get(key);
      console.log(`${key}: valid=${control?.valid}, value=${control?.value}, errors=`, control?.errors);
    });

    if (this.categoryForm.invalid) {
      this.showError();
      return;
    }

    let Obj: Category = {
      name: this.categoryForm.value.name,
      description: this.categoryForm.value.description || '', // Provide default empty string
      image: this.categoryForm.value.image || '', // Provide default empty string
      commonStatus: this.categoryForm.value.commonStatus,
    };
    console.log(Obj);

    this._apim.addCategory(Obj).subscribe(
      (response) => {
        this.categoryForm.reset();
        this.show('Category added Successfully!');
        this.visible = false;
        this.fetchAllCategories();
      },
      (error) => {
        console.log('Error in adding category, ', error);
      }
    );
  }

  addSubCategory() {
    // Add debugging
    console.log('Sub Category Form valid:', this.subCategoryForm.valid);
    console.log('Sub Category Form errors:', this.subCategoryForm.errors);
    Object.keys(this.subCategoryForm.controls).forEach(key => {
      const control = this.subCategoryForm.get(key);
      console.log(`${key}: valid=${control?.valid}, value=${control?.value}, errors=`, control?.errors);
    });

    if (this.subCategoryForm.invalid) {
      this.showError();
      return;
    }

    let Obj: SubCategory = {
      name: this.subCategoryForm.value.name,
      description: this.subCategoryForm.value.description || '', // Provide default empty string
      image: this.subCategoryForm.value.image || '', // Provide default empty string
      commonStatus: this.subCategoryForm.value.commonStatus,
      categoryId: this.subCategoryForm.value.category,
    };

    this._apim.addSubCategory(Obj).subscribe(
      (response) => {
        this.subCategoryForm.reset();
        this.show('Sub Category added Successfully!');
        this.subModelVisible = false;
        this.fetchSubAllCategories();
      },
      (error) => {
        console.log('Error in adding category, ', error);
        this.fetchSubAllCategories();
      }
    );
  }

  fetchAllCategories(): void {
    this.fetchingCategories = [];
    this._apim.getAllCategories().subscribe((data: any) => {
      // Assuming data.payload contains the array of products
      this.fetchingCategories = data.payload.map((category: any) => ({
        ...category,
        // image: item.image ? 'data:image/png;base64,' + item.image : '', // Convert base64 to image URL
      }));
    });
  }

  fetchSubAllCategories(): void {
    this.fetchingSubCategories = [];
    this._apim.getAllSubCategories().subscribe((data: any) => {
      this.fetchingSubCategories = data.payload.map((subCategory: any) => ({
        ...subCategory,
      }));
    });
  }

  deleteCategory(pId: any) {
    let Obj: DeleteCategory = {
      id: pId,
      commonStatus: 'DELETED',
    };

    this._apim.deleteCategory(Obj).subscribe((response) => {
      console.log(response);
      this.detete();
      this.fetchAllCategories();
    });
  }

  deleteSubCategory(pId: any) {
    let Obj: DeleteCategory = {
      id: pId,
      commonStatus: 'DELETED',
    };

    this._apim.deleteSubCategory(Obj).subscribe((response) => {
      console.log(response);
      this.detete();
      this.fetchSubAllCategories();
      this.fetchAllCategories();
    });
  }

  fetchCategory(CId: any) {
    this.isUpdate = true;
    this.visible = true;
    this._apim.getCategoryById(CId).subscribe((data: any) => {
      const category = data.payload[0];
      this.categoryForm.patchValue({
        id: category.id,
        name: category.name,
        description: category.description || '', // Handle null/undefined values
        image: category.image || '', // Handle null/undefined values
      });
    });
  }

  fetchSubCategory(CId: any) {
    this.isSubUpdate = true;
    this.subModelVisible = true;
    this._apim.getSubCategoryById(CId).subscribe((data: any) => {
      const subCategory = data.payload[0];
      this.subCategoryForm.patchValue({
        id: subCategory.id,
        name: subCategory.name,
        description: subCategory.description || '', // Handle null/undefined values
        image: subCategory.image || '', // Handle null/undefined values
        category: subCategory.categoryId,
      });
    });
  }

  updateCategory() {
    // Add debugging
    console.log('Update Category Form valid:', this.categoryForm.valid);
    console.log('Update Category Form errors:', this.categoryForm.errors);
    Object.keys(this.categoryForm.controls).forEach(key => {
      const control = this.categoryForm.get(key);
      console.log(`${key}: valid=${control?.valid}, value=${control?.value}, errors=`, control?.errors);
    });

    if (this.categoryForm.invalid) {
      this.showError();
      return;
    }

    let Obj: UpCategory = {
      id: this.categoryForm.value.id,
      name: this.categoryForm.value.name,
      description: this.categoryForm.value.description || '', // Provide default empty string
      image: this.categoryForm.value.image || '', // Provide default empty string
      commonStatus: this.categoryForm.value.commonStatus,
    };

    this._apim.updateCategory(Obj).subscribe(
      (response) => {
        this.categoryForm.reset();
        this.show('Category updated Successfully!');
        this.visible = false;
        this.isUpdate = false;
        this.fetchAllCategories();
      },
      (error) => {
        console.log('Error in updating category, ', error);
      }
    );
  }

  updateSubCategory() {
    // Add debugging
    console.log('Update Sub Category Form valid:', this.subCategoryForm.valid);
    console.log('Update Sub Category Form errors:', this.subCategoryForm.errors);
    Object.keys(this.subCategoryForm.controls).forEach(key => {
      const control = this.subCategoryForm.get(key);
      console.log(`${key}: valid=${control?.valid}, value=${control?.value}, errors=`, control?.errors);
    });

    if (this.subCategoryForm.invalid) {
      this.showError();
      return;
    }

    let Obj: UpSubCategory = {
      id: this.subCategoryForm.value.id,
      name: this.subCategoryForm.value.name,
      description: this.subCategoryForm.value.description || '', // Provide default empty string
      image: this.subCategoryForm.value.image || '', // Provide default empty string
      commonStatus: this.subCategoryForm.value.commonStatus,
      categoryId: this.subCategoryForm.value.category,
    };

    this._apim.updateSubCategory(Obj).subscribe(
      (response) => {
        console.log('subCategory updated:', response);
        this.subCategoryForm.reset();
        this.show('Sub category updated Successfully!');
        this.subModelVisible = false;
        this.isSubUpdate = false;
        this.fetchSubAllCategories();
        this.fetchAllCategories();
      },
      (error) => {
        console.log('Error in updating sub category, ', error);
      }
    );
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) {
      // If no file selected, set empty string (which is now valid)
      return;
    }
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64Image = reader.result?.toString().split(',')[1] || '';
      
      // Update both forms since we don't know which dialog is open
      if (this.visible) {
        this.categoryForm.patchValue({
          image: base64Image
        });
      }
      
      if (this.subModelVisible) {
        this.subCategoryForm.patchValue({
          image: base64Image
        });
      }
    };
  }

  showDialog() {
    this.visible = true;
    this.isUpdate = false;
  }

  showSubCategoryDialog() {
    this.subModelVisible = true;
    this.isSubUpdate = false;
  }

  toggleDescription(item: any) {
    item.showFullDescription = !item.showFullDescription;
  }

  show(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
    });
  }

  detete() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Category deletion Successfully!',
    });
  }

  showError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Please fill in all required fields!',
    });
  }
}
