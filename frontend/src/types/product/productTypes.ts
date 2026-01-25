import {PageCover} from "@/types/page/page";

export interface Product {
    id: number;
    category_id: number;
    status: number;
    price: number;
    sale_price: number;
    info:ProductInfo,
    category:any,
    extras:Extras[],
    sizes:Sizes[],
    colors:Colors[],
    materials:Materials[],
    print_types:PrintTypes[],
    product_attributes:{
        extras:Extras[],
        sizes:Sizes[],
        colors:Colors[],
        materials:Materials[],
        print_types:PrintTypes[],
    }

}

export interface ProductInfo {
    id: number;
    products_id: number;
    language_id: number;
    description: string;
    name: string;
    slug: string;
    text: string;
    covers:Cover[]
}
export interface Cover{
    output_path:string,
    path:string,
    cover_type:number
}


export interface Sizes{
    id:number,
    name:string,
    width:number,
    height:number,
    value:string,
    base_price:number,
    pivot:any
}

export interface Materials{
    id:number,
    name:string,
    base_price:number,
    covers:PageCover[],
    pivot:any
}

export interface Colors{
    id:number,
    name:string,
    value:string,
    colors:object,
    base_price:number,
    pivot:any
}


export interface Extras{
    id:number,
    name:string,
    value:string,
    colors:object,
    base_price:number,
    pivot:any
}

export interface PrintTypes{
    id:number,
    name:string,
    base_price:number,
    pivot:any
}

