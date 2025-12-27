import {PageCover} from "@/types/page/page";



export interface SliderResponse {
    sliders: SliderData[];
}

//slider

export  interface SliderData{
    id:number,
    slug:string,
    info:{
        title:string,
        description:string,
        covers:PageCover[],
    }
}