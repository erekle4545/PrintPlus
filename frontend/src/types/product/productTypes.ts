
export interface Product {
    id: number;
    category_id: number;
    status: number;
    base_price: number;
    sale_price: number;
    info:ProductInfo,
    category:any,
    extras:Extras[],
    sizes:Sizes[],
    colors:Colors[],
    materials:Materials[]

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
    base_price:number
}

export interface Materials{
    id:number,
    name:string,
    width:number,
    height:number,
    value:string,
    base_price:number
}


export interface Colors{
    id:number,
    name:string,
    value:string,
    colors:object,
    base_price:number
}


export interface Extras{
    id:number,
    name:string,
    value:string,
    colors:object,
    base_price:number
}


