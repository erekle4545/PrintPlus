import React from 'react';
import {LocalFlorist, Loyalty} from "@mui/icons-material";
import {animations} from "react-animation";
import useHttp from "../../store/hooks/http/useHttp";
import {useQuery} from "react-query";
import {Link} from "react-router-dom";
import AddToCart from "../cart/addToCart";
import {ThumbImage} from "../../store/hooks/useMix";

export default function PromoBox() {
    const http = useHttp();
    const getProduct = (text) => {
        return  http.get(`promo-product`,{
            params:{
                keyword:text,
            }
        }).then((res)=>{
            return res.data
        })
    }
    const { data: item,error, isLoading  } = useQuery(['promo-product'],()=> getProduct())

    return <>
        {isLoading?null:<div className='promo-box'  style={{animation: animations.fadeIn}}>
        <h3 className=' mb-4 text-center title_font'><Loyalty /> შეთავაზება </h3>
        <div className="product-card ms-3 me-3 p-2">
            <div className="product-img-cont">
                <div className="position-absolute p-1 text-left">
                    {item?.status === 2?<div className="badge  bg-danger " >არ არის მარაგში</div>:null}
                </div>
                <Link to={`/product/details/${item?.id}`} >
                    <img src={process.env.REACT_APP_FILE_URL+'/'+item?.covers?.filter(image=> image.cover_type ===1  )?.[0].output_path} alt=''/>
                </Link>
            </div>
            <div className='d-flex justify-content-between align-items-center'>
                <div className='pt-2'>
                    <h6 className='title_font pt-1'>
                        {item?.title}
                    </h6>
                    <h5 className='title_font text-danger'>
                        {item?.price} ₾
                    </h5>
                </div>
                <div>
                    {item?.status === 1 && <AddToCart item={{
                        id: item?.id,
                        img: ThumbImage(item?.covers, 1),
                        title: item?.title,
                        price: item?.price,
                    }}
                      qty={1}
                      disabled={item?.status === 2}
                    />}
                </div>
            </div>
        </div>
        <div>
            &nbsp;
        </div>
    </div>}
    </>
}
