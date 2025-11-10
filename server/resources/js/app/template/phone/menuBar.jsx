import React, {useContext, useState} from "react";
import {ArrowDownwardRounded, ArrowUpwardRounded, CabinSharp, Home, ShoppingCart} from "@mui/icons-material";
import {Context} from "../../store/context/context";
import {Button} from "@mui/material";
import {Link, useLocation, useNavigate} from "react-router-dom";
import Sidebar from "../section/sidebar";

export default function MenuBar(){
    const location = useLocation();
    const navigate = useNavigate()
    const [open,setOpen] = useState(false)
    const {state} = useContext(Context)
    const {cart} = state;
    const itemPrice = cart?cart.reduce((a, c) => {
        return  a + c.qty * c.price
    }, 0):0;

    if(location.pathname !== '/orders/create') {
        return <div className='mob-menu-bar-container'>
            <div className='d-flex justify-content-between align-items-center'>
                <div className='title_font'>
                    <button className=" btn btn-warning title_font" onClick={() => navigate('/')}><Home/>
                    </button>
                </div>
                <div className={`mob-cart-icon-box text-center align-content-center ${open === true?'active-bg-mob-cart-bt':null}`}
                     onClick={() => open === true ? setOpen(false) : setOpen(true)}>
                    <div className=' '>
                        {open ?<ArrowDownwardRounded  fontSize='small' />:<ArrowUpwardRounded fontSize='small'/>}
                        <div className=''><ShoppingCart/><span className='mob-cart-count'>{cart?.length}</span>
                        </div>
                        {cart?.length?<p> {itemPrice} ₾</p>:null}
                    </div>
                </div>
                <div>
                    <button disabled={cart?.length === 0} className=" btn btn-warning title_font" onClick={() => navigate('/orders/create')}>შეკვეთა</button>
                </div>
            </div>
            {open === true && <div className='mt-3 mob-menu-content-cart'><Sidebar pageType='phoneMenuBar'/></div>}
        </div>
    }else{
        return  null
    }
}
