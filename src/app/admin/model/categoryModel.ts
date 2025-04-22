export interface Category{
    name:string;
    description:string;
    image:string;
    commonStatus:string;
}

export interface SubCategory{
    name:string;
    description:string;
    image:string;
    commonStatus:string;
    categoryId:string;
}

export interface UpCategory{
    id:number;
    name:string;
    description:string;
    image:string;
    commonStatus:string;
}

export interface UpSubCategory{
    id:number;
    name:string;
    description:string;
    image:string;
    commonStatus:string;
    categoryId:string;
}

export interface DeleteCategory{
    id:number;
    commonStatus:string;
}