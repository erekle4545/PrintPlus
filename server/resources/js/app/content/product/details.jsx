import React, { useRef, useState } from 'react';
import Sidebar from "../../template/section/sidebar";
import {useQuery} from "react-query";
import useHttp from "../../store/hooks/http/useHttp";
import {useParams} from "react-router-dom";

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import parse from 'html-react-parser';


// import required modules
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import AddToCart from "../../components/cart/addToCart";
import {ThumbImage} from "../../store/hooks/useMix";
import {Helmet} from "react-helmet";
import {animations} from "react-animation";
export default function Details() {
    const [thumbsSwiper, setThumbsSwiper] = useState();
    const [getQty, setGetQty] = useState(1);

    const params = useParams();
    const http = useHttp();
    const getProduct = (id) => {
        return  http.get(`products/${id}`).then((res)=>{
            return res.data;
        })
    }
    const { data: data,error, isLoading  } = useQuery(['product-details',params.id],()=>getProduct(params.id))



    const thumbImage = () => {
        return data?.data?.covers.sort((a, b) => a.cover_type < b.cover_type ? -1 : (a.cover_type > b.cover_type ? 1 : 0)).map((image,number)=> {
            return <SwiperSlide key={number}><img width='100%'
                        src={process.env.REACT_APP_FILE_URL + '/' + image.output_path}
                        alt=''/></SwiperSlide>
        })
    }



    const plus = ()=>{
        setGetQty(  getQty + 1);
    }
    const min = ()=>{
        if(getQty >= 2){
            setGetQty( getQty - 1);
        }
    }


    return <div className='row product-detail-cont'  >
        <Helmet>
            <meta charSet="utf-8"/>
            <title>{data?.data?.title}</title>
            <meta name="description" content={data?.data?.title}/>
            <meta name="keywords" content={data?.data?.comment}/>
            <meta name="author" content="orqidea.ge"/>
            <link rel="canonical" href={`https://orqidea.ge/product/details/${data?.data.id}`}/>
        </Helmet>
        <div className='col-xl-9 ' >
            {isLoading ? <div className='text-center p-4 text_font'>იტვირთება...</div> :
                <div className='row '>
                    <div className='col-xl-6 col-sm-12 p-0 detail-gallery-cont'>
                        <Swiper
                            style={{
                                '--swiper-navigation-color': '#000',
                                '--swiper-pagination-color': '#000',
                            }}
                            loop={true}
                            spaceBetween={10}
                            navigation={true}
                            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                            modules={[FreeMode, Navigation, Thumbs]}
                            className="mySwiper2"
                        >
                            {thumbImage()}

                        </Swiper>
                        {data?.data?.covers.length > 1 &&<div className='mt-2 gallery-thumbs'>
                            <Swiper
                                onSwiper={setThumbsSwiper}
                                loop={true}
                                spaceBetween={10}
                                slidesPerView={4}
                                freeMode={true}
                                watchSlidesProgress={true}
                                modules={[FreeMode, Navigation, Thumbs]}
                                className="mySwiper"
                            >
                                {thumbImage()}
                            </Swiper>
                        </div>}
                    </div>
                    <div className='col-xl-6'>

                        <h2 className='font_form_title product-detail-title'>{data?.data?.title}</h2>

                        <p>
                            {data?.data?.text?parse(data?.data?.text):data?.data?.comment}
                        </p>
                        <h3 className='font_form_title text-danger'>{data?.data?.price} ₾</h3>
                        {data?.data.status === 2 ? <div className="badge  bg-danger ">არ არის მარაგში</div> :
                            <div className="quantity-box">
                                <button type='button' onClick={min}>
                                    -
                                </button>
                                <input disabled={true} type="text" value={getQty}/>
                                <button type='button' onClick={plus}>
                                    +
                                </button>
                            </div>
                        }


                        <div className='mt-3 mb-5 '>
                            {data?.data?.status === 1 && <AddToCart item={{
                                id: data?.data.id,
                                img: ThumbImage(data?.data?.covers, 1),
                                title: data?.data.title,
                                price: data?.data.price,
                                // colors:Array.isArray(selectedColor) && selectedColor.length === 0 ?[{color:item.color?.[0].color,id:item.id}]: selectedColor.filter(e => e.id === item.id)
                            }}
                                qty={getQty}
                                disabled={data?.data.status === 2}
                                label='კალათში დამატება'
                            />}
                        </div>
                        <br/>
                        <br/>
                    </div>
                </div>}
        </div>
        <Sidebar/>
    </div>
}
