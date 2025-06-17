import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
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
    private confirmationService: ConfirmationService, // Add this line
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: [''],
      commonStatus: ['ACTIVE'],
      image: [''],
    });

    this.subCategoryForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: [''],
      commonStatus: ['ACTIVE'],
      image: [''],
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
      description: this.categoryForm.value.description || '',
      image: this.categoryForm.value.image || '',
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
    if (this.subCategoryForm.invalid) {
      this.showError();
      return;
    }

    let Obj: SubCategory = {
      name: this.subCategoryForm.value.name,
      description: this.subCategoryForm.value.description || '',
      image: this.subCategoryForm.value.image || '',
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
      this.fetchingCategories = data.payload.map((category: any) => ({
        ...category,
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
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this category? This action cannot be undone.',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      accept: () => {
        let Obj: DeleteCategory = {
          id: pId,
          commonStatus: 'DELETED',
        };

        this._apim.deleteCategory(Obj).subscribe({
          next: (response) => {
            console.log(response);
            this.fetchAllCategories();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Category deleted successfully!',
              life: 3000
            });
          },
          error: (error) => {
            console.error('Error deleting category:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete category. Please try again.',
              life: 3000
            });
          }
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'Category deletion cancelled',
          life: 2000
        });
      }
    });
  }

  deleteSubCategory(pId: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this sub category? This action cannot be undone.',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      accept: () => {
        let Obj: DeleteCategory = {
          id: pId,
          commonStatus: 'DELETED',
        };

        this._apim.deleteSubCategory(Obj).subscribe({
          next: (response) => {
            console.log(response);
            this.fetchSubAllCategories();
            this.fetchAllCategories();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Sub category deleted successfully!',
              life: 3000
            });
          },
          error: (error) => {
            console.error('Error deleting sub category:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete sub category. Please try again.',
              life: 3000
            });
          }
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'Sub category deletion cancelled',
          life: 2000
        });
      }
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
        description: category.description || '',
        image: category.image || '',
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
        description: subCategory.description || '',
        image: subCategory.image || '',
        category: subCategory.categoryId,
      });
    });
  }

  updateCategory() {
    if (this.categoryForm.invalid) {
      this.showError();
      return;
    }

    let Obj: UpCategory = {
      id: this.categoryForm.value.id,
      name: this.categoryForm.value.name,
      description: this.categoryForm.value.description || '',
      image: this.categoryForm.value.image || '',
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
    if (this.subCategoryForm.invalid) {
      this.showError();
      return;
    }

    let Obj: UpSubCategory = {
      id: this.subCategoryForm.value.id,
      name: this.subCategoryForm.value.name,
      description: this.subCategoryForm.value.description || '',
      image: this.subCategoryForm.value.image || '',
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
      return;
    }
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64Image = reader.result?.toString().split(',')[1] || '';
      
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

  showError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Please fill in all required fields!',
    });
  }
}
