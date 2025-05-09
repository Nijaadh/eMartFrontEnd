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
      description: ['', Validators.required],
      commonStatus: ['ACTIVE'],
      image: ['', Validators.required],
    });

    this.subCategoryForm = this.fb.group({
      id: [''],
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
      description: this.subCategoryForm.value.description,
      image: this.subCategoryForm.value.image,
      commonStatus: this.subCategoryForm.value.commonStatus,
      categoryId: this.subCategoryForm.value.category,
    };

    this._apim.addSubCategory(Obj).subscribe(
      (response) => {
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
        description: category.description,
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
        description: subCategory.description,
        categoryId: subCategory.categoryId,
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
      description: this.categoryForm.value.description,
      image: this.categoryForm.value.image,
      commonStatus: this.categoryForm.value.commonStatus,
    };

    this._apim.updateCategory(Obj).subscribe(
      (response) => {
        this.categoryForm.reset();
        this.show('category updated Successfully!');
        this.visible = false;
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
      description: this.subCategoryForm.value.description,
      image: this.subCategoryForm.value.image,
      commonStatus: this.subCategoryForm.value.commonStatus,
      categoryId: this.subCategoryForm.value.categoryId,
    };

    this._apim.updateSubCategory(Obj).subscribe(
      (response) => {
        console.log('subCategory updated:', response);
        this.subCategoryForm.reset();
        this.show(' sub category updated Successfully!');
        this.visible = false;
        this.fetchAllCategories();
      },
      (error) => {
        console.log('Error in adding category, ', error);
      }
    );
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
      detail: 'category deletion Successfully!',
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
