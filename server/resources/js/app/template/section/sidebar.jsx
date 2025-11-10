import React, {useContext, useEffect, useState} from 'react';
import {ShoppingCartRounded} from "@mui/icons-material";
import {NavLink, useNavigate} from "react-router-dom";
import {useQuery} from "react-query";
import useHttp from "../../store/hooks/http/useHttp";
import {Context} from "../../store/context/context";
import {ThumbImage} from "../../store/hooks/useMix";
import {animations} from "react-animation";
import PromoBox from "../../components/promo/promoBox";

export default function Sidebar({pageType,size,templateName}) {
    const http = useHttp();
    const [count, setCount] = useState(1)
    let {state,dispatch} = useContext(Context)
    const {cart} = state;
    const storageCartItems = JSON.parse(localStorage.getItem('cart'));
    const navigate = useNavigate();
    const itemPrice = cart?cart.reduce((a, c) => {
        return  a + c.qty * c.price
    }, 0):0;

    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const stickyDiv = document.getElementById('stickyDiv');
            const rect = stickyDiv.getBoundingClientRect();
            setIsSticky(rect.top === 60);
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleInputChange = (e) => {
        const inputValue = parseInt(e.target.value)
        if (isNaN(inputValue)) {
            setCount('')
        } else {
            setCount(Math.max(1, inputValue))
        }
    }

    const itemsPrice = cart?cart.reduce((a, c) => {
        if (c.price){ return  a + c.qty * c.price}else{return  a + c.qty * c.price}
    }, 0):0;

    const onRemove = (item) => {
        dispatch({type: 'CART', payload:  cart.filter((x) => x.id !== item.id)});
        localStorage.setItem("cart",JSON.stringify(cart.filter((x) => x.id !== item.id)));
    };


    const onMin =(item)=>{
        const exist = cart.find((x) => x.id === item.id);
        if (exist.qty === 1) {
            // dispatch({type: 'CART', payload:  cart.filter((x) => x.product_id !== item.product_id)});
            // localStorage.setItem("items",JSON.stringify(cart.filter((x) => x.product_id !== item.product_id)));
        } else {
            dispatch({type: 'CART', payload:cart.map((x) =>
                    x.id === item.id ? { ...exist, qty: exist.qty - 1 } : x
                )});
            localStorage.setItem("cart",JSON.stringify(
                cart.map((x) =>
                    x.id === item.id ? { ...exist, qty: exist.qty - 1 } : x
                )
            ));
        }
    }

    const onPlus = (item)=>{
        localStorage.setItem("cart",JSON.stringify(cart));
        const exist = cart.find(x=>x.id ===item.id);
        if(exist){
            dispatch({type: 'CART', payload:  cart.map((x)=>x.id ===item.id ? {...exist,qty:exist.qty +1 }:x)});
            localStorage.setItem("cart",JSON.stringify(
                cart.map((x)=>x.id ===item.id ? {...exist,qty:exist.qty +1 }:x)
            ));
        }else{
            dispatch({type: 'CART', payload:  [...cart,{...item,qty:1}]});
            localStorage.setItem("cart",JSON.stringify(
                [...cart,{...item,qty:1}]
            ));
        }
    }

    const productList = () => {
        return cart.map((item,index)=>{
            return <div  key={index} className='sidebar-card-container row' style={{animation: animations.bounceIn }}>
                {!templateName&&<button onClick={() => onRemove(item)} className='cansel-cart-item btn btn-warning'>x</button>}
                <div className='col-xl-4 col-4 col-sm-4  p-3'>
                    <img src={process.env.REACT_APP_FILE_URL+item.img} alt="" width='100%'/>
                </div>
                <div className='col-xl-8 col-8 col-sm-8 title_font p-3'>
                    <h6 className='cart-item-title'>{item?.title}</h6>
                    <div className='d-flex justify-content-between'>
                        <h6>{item.price} ₾</h6>
                    </div>
                    <div>
                        <div className="quantity-box">
                            <button type='button' onClick={() => onMin(item)}>
                                -
                            </button>
                            <input disabled={true}  type="text"   value={item.qty} />
                            <button type='button' onClick={() => onPlus(item)}>
                                +
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        })
    }


    /**
     * Category
     */
    // const { data: data, error, isLoading } = useQuery('sidebar-category',()=>{
    //     return  http.get('category').then((res)=>{
    //         return res.data.data
    //     })
    // });
    // const categoryList = () => {
    //     return data&&data.map((item,index)=>{
    //         return <li key={index}><NavLink to={`/category/${item.slug}/${item.id}`}>{item.title}</NavLink></li>
    //       })
    // }

    // get cart item
    const getCartItem = () => {
        let arrDat = []
        JSON.parse(localStorage.getItem('cart'))?.map(item=> arrDat.push(item.id))
        http.post('cart',{
            product_id:arrDat,
        }).then((response)=>{
            if(response.status === 200){
                let arrData = []
                JSON.parse(localStorage.getItem('cart')).map(e=>{
                    response.data.data.map(i=> {
                        if(i.id === e.id){
                            arrData.push({...i,img:ThumbImage(i.covers,1),qty:e.qty?e.qty:1})
                        }
                    })
                })
                dispatch({type:'CART',payload:arrData});
            }
        }).catch((err)=>{
            console.log(err.response)
        })
    }

    useEffect(()=>{
        getCartItem()
    },[])

    return <div  className={`col-xl-${size?size:'3'}   sidebar-container pb-2 ${pageType !=='phoneMenuBar' && !templateName?'hidden-for-mob':null }`} >
        <div
            id="stickyDiv"
            style={{
                position: 'sticky',
                top: 80,
            }}
        >
            {JSON.parse(localStorage.getItem('cart'))?.length > 0 ? <><h3
            className=' title_font text-white ms-3 mt-4' > {templateName ?? <>
                <ShoppingCartRounded/> კალათა {cart.length}</>} </h3><div style={{overflowY:"auto",maxHeight:'60vh'}}>{productList()}</div></> : <PromoBox/>}
            {cart.length > 0 && pageType !== 'phoneMenuBar' &&
                <div className='sidebar-card-container sum-cart-congrats-container'
                     style={{animation: animations.bounceIn}}>
                    <div className='p-3 d-flex justify-content-between align-items-center'>
                        <span className='title_font'>სულ: {itemPrice} ₾</span>
                        {pageType !== 'createOrder' &&
                            <button onClick={() => navigate('/orders/create')} className=' btn btn-sm btn-warning title_font'>
                                გაფორმება
                            </button>}
                    </div>
                </div>}
        </div>
        {/*{isLoading ? null : pageType !== 'createOrder' && <div style={{ display: isSticky ? 'none' : 'block'}} className='sidebar-categories '>*/}
        {/*    <h6 className='title_font'>კატეგორიები</h6>*/}
        {/*    <ul className='sidebar-category-list'>*/}
        {/*        {categoryList()}*/}
        {/*    </ul>*/}
        {/*</div>}*/}

    </div>
}
