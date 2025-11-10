import React, { useContext, useState } from 'react';
import Sidebar from "../../template/section/sidebar";
import ProductSection from "../../template/section/productSection";
import useHttp from "../../store/hooks/http/useHttp";
import { useQuery } from "react-query";
import AddToCart from "../../components/cart/addToCart";
import { ThumbImage } from "../../store/hooks/useMix";
import { Link, useParams } from "react-router-dom";
import { animations } from "react-animation";
import { Context } from "../../store/context/context";
import Pagination from "@mui/material/Pagination";

export default function FilterCategory() {
    const http = useHttp();
    const { state } = useContext(Context);
    const params = useParams();
    const [postPagination, setPostPagination] = useState(1);

    const getProducts = (id, search, paginate) => {
        return http.get(`home-production?page=${paginate}`, {
            params: {
                keyword: search,
                category_id: id
            }
        }).then((res) => {
            return res.data;
        });
    };

    const { data, error, isLoading } = useQuery(['category-production', params.category_id, state?.search, postPagination], () =>
        getProducts(params.category_id, state?.search, postPagination)
    );

    const productionList = () => {
        if (isLoading) return <div className='text-center p-4 text_font'>იტვირთება...</div>;
        if (error) return <div className='text-center p-4 text_font'>შექმნილია პრობლემა, გთხოვთ სცადოთ ისევ.</div>;
        if (data?.data?.length === 0) return <div className='text-center p-4 text_font'>კატეგორია ცარიელია</div>;

        return data.data.map((item) => (
            <div className='col-xl-4 col-md-6 col-sm-12' style={{ animation: animations.fadeIn }} key={item.id}>
                <div className='product-card'>
                    <div className='product-img-cont'>
                        <div className='position-absolute p-1 text-left d-xl-none '>
                            {item.status === 2 ? <div className="badge  bg-danger ">არ არის მარაგში</div> : null}
                        </div>
                        <Link to={`/product/details/${item.id}`}>
                            <img
                                src={`${process.env.REACT_APP_FILE_URL}/${item.covers?.filter(image => image.cover_type === 1)[0]?.output_path}`}
                                alt=''
                                loading="lazy" // Lazy loading
                            />
                        </Link>
                    </div>
                    <div className='d-flex justify-content-between align-items-center'>
                        <div className='mt-2'>
                            <h6 className='title_font pt-1' style={{color: '#777676'}}>{item.title}</h6>
                            <h5 className='title_font'>{item.price} ₾</h5>
                        </div>
                        <div>
                            {item.status === 1 && <AddToCart item={{
                                id: item.id,
                                img: ThumbImage(item?.covers, 1),
                                title: item.title,
                                price: item.price,
                            }} qty={1} disabled={item.status === 2}/>}

                        </div>
                    </div>
                </div>
            </div>
        ));
    };

    const handleChangePagination = (e, value) => {
        setPostPagination(value);
    };

    return (
        <div className='row' style={{ animation: animations.fadeIn }}>
            <Sidebar />
            <div className='col-xl-9'>
                <div className='row product-list-container mob-btm-space'>
                    {productionList()}
                    <div className='d-flex justify-content-center'>
                        <Pagination count={data?.last_page} onChange={handleChangePagination} hidden={isLoading} color="standard" />
                    </div>
                </div>
            </div>
        </div>
    );
}
