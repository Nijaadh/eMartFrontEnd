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