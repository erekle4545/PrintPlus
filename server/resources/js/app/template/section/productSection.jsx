import React, { useContext, useState } from "react";
import useHttp from "../../store/hooks/http/useHttp";
import { useQuery } from "react-query";
import AddToCart from "../../components/cart/addToCart";
import { ThumbImage } from "../../store/hooks/useMix";
import { errorAlerts } from "../../store/hooks/global/useAlert";
import { Context } from "../../store/context/context";
import Pagination from "@mui/material/Pagination";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function ProductSection() {
    const http = useHttp();
    const { state } = useContext(Context);
    const [postPagination, setPostPagination] = useState(1);

    const getProducts = (text, paginate) => {
        return http.get(`home-production?page=${paginate}`, {
            params: {
                keyword: text,
            },
        }).then(res => res.data);
    };

    const { data, error, isLoading } = useQuery(['home-production', state?.search, postPagination], () => getProducts(state?.search, postPagination));

    if (error) {
        errorAlerts(error.response.status, error.message, error.response.data.message);
    }

    const productionList = () => {
        if (isLoading) return <div className='p-5 text-center'>იტივრთება ....</div>;
        if (data && data.data) {
            return data.data.map(item => (
                <div className='col-xl-4 col-md-6 col-sm-12 mob-product-cont' key={item.id}>
                    <div className='product-card'>
                        <div className='product-img-cont'>
                            <div className='position-absolute p-1 text-left d-xl-none '>
                                {item.status === 2 ? <div className="badge  bg-danger ">არ არის მარაგში</div> : null}
                            </div>
                            <Link to={`/product/${item.slug}/${item.id}`}>
                                <img
                                    src={`${process.env.REACT_APP_FILE_URL}/${item.covers?.filter(image => image.cover_type === 1)[0]?.output_path}`}
                                    alt=''
                                    loading="lazy" // აქ ემატება lazy loading
                                />
                            </Link>
                        </div>
                        <div className='d-flex justify-content-between align-items-center'>
                            <div className='mt-2'>
                                <h6  className='title_font pt-1' style={{color:'#777676'}}>{item.title}</h6>
                                <h5 className='title_font' >{item.price} ₾</h5>
                            </div>
                            <div>
                                {item.status === 1 && <AddToCart item={{
                                    id: item.id,
                                    img: ThumbImage(item?.covers, 1),
                                    title: item.title,
                                    price: item.price
                                }} qty={1} disabled={item.status === 2}/>}
                            </div>
                        </div>
                    </div>
                </div>
            ));
        }
        return null;
    };

    const handleChangePagination = (e, value) => {
        setPostPagination(value);
    };

    return (
        <div className='col-xl-9 right-section-cont'>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Orqidea.ge - გამოხატე გრძნობები სიტყვების გარეშე</title>
                <meta name="description" content="გამოხატე გრძნობები სიტყვების გარეშე!" />
                <meta name="keywords" content="ორქიდეა, ყვავილები, yvavilebi, orqidea, orqidea.ge" />
                <meta name="author" content="orqidea.ge" />
            </Helmet>
            <div className='row product-list-container mob-btm-space'>
                {productionList()}
                <div className='d-flex justify-content-center'>
                    <Pagination count={data?.last_page} hidden={isLoading} onChange={handleChangePagination} color="standard" />
                </div>
            </div>
        </div>
    );
}
