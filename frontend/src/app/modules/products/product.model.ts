export interface Product{
    id:number;
    userId:number;
    name:string;
    description:string;
}
export interface CreateProductRequest{
    name:string;
    description:string;
    userId:number;
}