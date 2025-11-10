import React, {useContext, useEffect, useState,useRef} from "react";
import {useAlert} from "react-alert";
import {Context} from "../../store/context/context";
import {Link, useNavigate, useParams} from "react-router-dom";
import useHttp from "../../store/hooks/http/useHttp";
import { useForm } from 'react-hook-form';
//ui
import Switch  from '@mui/material/Switch';
import * as XLSX from 'xlsx';

// end ui
//start mix
import {slugGenerate, ThumbImage} from "../../store/hooks/useMix";
import { errorAlerts} from "../../store/hooks/global/useAlert";
import UseFileManager from "../../store/hooks/global/useFileManager";
import CircularProgress from "@mui/material/CircularProgress";
import UseButtonBar from "../../store/hooks/global/useButtonBar";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Sidebar from "../../template/section/sidebar";
import useFetch from "../../store/hooks/requests/useFetch";
import TextField from "@mui/material/TextField";
import {animations} from "react-animation";
import moment from "moment";

const CreateOrder = () => {

    // use Hooks
    let http = useHttp();
    let params = useParams();
    const alerts = useAlert()
    let navigate = useNavigate();
    let {state,dispatch} = useContext(Context);
    const {data:customerData, error:error,loading:loadingCustomer} = useFetch('customers','data');
    // Editor
    const editor = useRef(null)
    const [text, setText] = useState('')
    const config = {
        readonly: false // all options from https://xdsoft.net/jodit/doc/
    }
    //END Editor
    const [tabs,setTabs] = useState({
        tab_1:true,
        tab_2:false
    })
    // form data

    // select dropdown & page status material ui
    const [pageStatus, setPageStatus] = useState(true);
    const [customerAdd, setCustomerAdd] = useState(false);
    const [addSuccess, setAddSuccess] = useState(false);
    const [refresh, setRefresh] = useState('');

    const [orderItems, setOrderItems] = useState([]);
    const [getCustomerIdDb, setGetCustomerIdDb] = useState(null);
    const [orderPrice, setOrderPrice] = useState(null);
    const [loading, setLoading] = useState(false);
    const [paymentMethodState,setPaymentMethodState] = useState(0);

    const [selectedPageTemplate, setSelectedPageTemplate] = useState('');
    const [selectedDeliveryTypes, setSelectedDeliveryTypes] = useState('');
    const [deliveryPrices, setDeliveryPrices] = useState([]);
    const [deliveryTypes, setDeliveryTypes] = useState('');
    const {register,handleSubmit,setValue,formState: { errors },watch,reset } = useForm();
    const resets = ()=>{
        reset({
            social_name:'',
            surname:'',
            phone:'',
            address:'',
            comments:'',
            facebook_correspondence:''
        }, {
            keepErrors: false,
            keepDirty: true,
            keepIsSubmitted: false,
            keepTouched: false,
            keepIsValid: false,
            keepSubmitCount: false,
        });
        setText('');
    }
    // End form Data
    const handleChangeSelectTemplate = (e) => {
        setSelectedPageTemplate(e.target.value);
    };
    const handleChangeDeliveryType = (e) => {
        setSelectedDeliveryTypes(e.target.value);
    };
    //Get Config Options
    const getPageConfig = () => {
        http.get('orders/options').then((response)=>{
            if(response.status === 200){
                setDeliveryTypes(response.data.data.delivery_time)
                setDeliveryPrices(response.data.data.delivery_prices)
                // setPageTemplate(response.data.data.delivery_time)

            }
        }).catch(err=>{
            console.log(err.response)
        })
        if(!params.id){
            resets()
        }
    }

    // get edit Data
    const getEditData = () => {
        setLoading(true)
        http.get(`orders/${params.id}`).then((response)=>{
            if(response.status === 200){

                if(params.id){
                    setOrderPrice(response.data.data.price)
                    setOrderItems(response.data.data.order_items)
                    setValue('social_name', response.data.data.social_name);
                    setValue('surname', response.data.data.surname);
                    setValue('phone', response.data.data.phone);
                    setValue('address', response.data.data.address);
                    setValue('comments', response.data.data.comments);
                    setValue('delivery_date', response.data.data.delivery_date);
                    setValue('facebook_correspondence', response.data.data.facebook_correspondence);
                    // setText(response.data.data.description)
                    setSelectedPageTemplate(response.data.data.payment_state)
                    setSelectedDeliveryTypes(response.data.data.delivery_time)
                    if(response.data.data.status === 1){
                        setPageStatus(true)
                    }else{
                        setPageStatus(false)
                    }
                    setGetCustomerIdDb(response.data.data.customer_id)
                    const coversData = response.data.data.covers
                }
            }
        }).catch(err=>{
            console.log(err.response)
        }).finally(() => {
            setLoading(false)
        });
    }



    // create form
    const create = (data) => {

        // create
        http.post('create/web/order',
            {
                ...data,
                cart:state?.cart,
                customer_add:customerAdd,
                status:pageStatus === true?1:2,
                cover_id:Array.isArray(state.selected_covers)?state.selected_covers.map(item=>item.id):null,
                cover_type:Array.isArray(state.selected_covers)?state.selected_covers.map(item=>item.coverType):null,
                delivery_time:selectedDeliveryTypes,
                customer_id:getCustomerIdDb,
                data:'0',
                payment_method:paymentMethodState,
                price:orderPrice?orderPrice:deliveryPriceCalculator()
            }
        ).then((response)=>{
            if(response.status === 200){
                setCustomerAdd(false)
                dispatch({type:'CART',payload:[]})
                localStorage.setItem('cart',JSON.stringify([]));
                setAddSuccess(true)
                alerts.success('თქვენი შეკვეთა დაფიქსირებულია!')
                navigate(response.data.return_url)
            }
        }).catch(err=>{
            console.log(err.response)
            errorAlerts(err.response.status,err.response.statusText,err.response.data.errors)
        });

    }


    // Page Load use Effect
    useEffect(()=>{

        getPageConfig()
        if(params.id){
            // getEditData()
        }else{
            setValue('delivery_date',moment().format('YYYY-MM-DD') );

        }
        deliveryPriceCalculator()
    },[addSuccess,params.id])


    useEffect(()=> {

    },[refresh])

    const defaultProps = {

        options: Array.isArray(customerData)?customerData.sort((a, b) => a.surname < b.surname ? -1 : (a.surname > b.surname ? 1 : 0)):[],
        getOptionLabel: (option) => {
            return   option.surname+' | '+option.phone
        },


    }



    const cartUpdate = (item,order_id) => {
        http.post('cart/update',{
            item:item,
            order_id:params.id
        }).then((response)=>{
            setRefresh(response.data)
        }).catch((err)=>{
            console.log(err.response)

        })
    }
    // add new product in  order
    const addNewProduct  = (item,order_id) => {
        http.post('cart/update',{
            item:item,
            order_id:parseInt(params.id),
            add_new:1
        }).then((response)=>{
            setRefresh(response.data)
            // cart nulled
            dispatch({type:'CART',payload:[]})
            localStorage.setItem('cart',JSON.stringify([]));
        }).catch((err)=>{
            console.log(err.response)

        })
    }
    //delete item from order item
    const deleteCart = (id,item) => {
        http.delete(`cart/delete/${id}`).then((response)=>{
            if(response.status === 200)
            setOrderItems(orderItems.filter((x) => x.id !== item.id));

        }).catch((err)=>{
            console.log(err.response)

        })

    }
    //plus order item
    const onPlus = (item)=>{
        const exist = orderItems.find(x=>x.id ===item.id);
        if(exist){
            setOrderItems(orderItems.map((x)=>x.id ===item.id ? {...exist,qty:exist.qty +1 }:x));
            cartUpdate(orderItems.map((x)=>x.id ===item.id ? {...exist,qty:exist.qty +1 }:x));
        }else{
            setOrderItems( [...orderItems,{...item,qty:1}]);
            cartUpdate([...orderItems,{...item,qty:1}]);
        }
    }
    // min order item
    const onMin =(item)=>{
        const exist = orderItems.find((x) => x.id === item.id);
        if (exist.qty === 1) {
            // dispatch({type: 'CART', payload:  cart.filter((x) => x.product_id !== item.product_id)});
            // localStorage.setItem("items",JSON.stringify(cart.filter((x) => x.product_id !== item.product_id)));
        } else {
            setOrderItems(orderItems.map((x) =>
                    x.id === item.id ? { ...exist, qty: exist.qty - 1 } : x
            ));
            cartUpdate(orderItems.map((x) =>
                x.id === item.id ? { ...exist, qty: exist.qty - 1 } : x
            ));

        }
    }
    // total price order items
    const itemPrice = orderItems?orderItems.reduce((a, c) => {
        return  a + c.qty * c.price
    }, 0):0;

    const itemPriceCart = state?.cart?state?.cart.reduce((a, c) => {
        return  a + c.qty * c.price
    }, 0):0;
    const deliveryPriceCalculator = ()=>{
        if(params.id){
            if(parseInt(selectedDeliveryTypes) === 1  && itemPrice < deliveryPrices[0]?.conditional){
                return itemPrice +  deliveryPrices[1].price
            }else if(parseInt(selectedDeliveryTypes) === 2  && itemPrice < deliveryPrices[0]?.conditional){
                return itemPrice +  deliveryPrices[2].price
            }else{
                return itemPrice;
            }
        }else{
            if(parseInt(selectedDeliveryTypes) === 1  && itemPriceCart < deliveryPrices[0]?.conditional){
                return itemPriceCart +  deliveryPrices[1].price
            }else if(parseInt(selectedDeliveryTypes) === 2  && itemPriceCart < deliveryPrices[0]?.conditional){
                return itemPriceCart +  deliveryPrices[2].price
            }else{
                return itemPriceCart;
            }
        }
    }


    const deliveryPriceCalculatorOnlyPrice = ()=>{
        if(parseInt(selectedDeliveryTypes) === 1  && itemPrice < deliveryPrices[0].conditional){
            return  deliveryPrices[1].price
        }else if(parseInt(selectedDeliveryTypes) === 2  && itemPrice < deliveryPrices[0].conditional){
            return  deliveryPrices[2].price
        }else{
            return null;
        }
    }
    const orderItemList = ()=>{
        return orderItems&&orderItems.map((item,index)=>{
            return <div key={index} className='row m-1'
                        style={{animation: animations.bounceIn, backgroundColor: '#e5e3e3', borderRadius: '0.5rem'}}>
                <button type='button' onClick={() => deleteCart(item.id,item)} className='cansel-cart-item  btn btn-warning'>x</button>

                <div className='col-xl-4 p-3 '>
                    <img src={process.env.REACT_APP_FILE_URL + ThumbImage(item.product.covers, 1)} alt="" width='100%'/>
                </div>
                <div className='col-xl-8 title_font p-3'>
                    <h6 className='cart-item-title'>{item?.product.title}</h6>
                    <div className='d-flex justify-content-between'>
                        <div className='col-xl-12 title_font'>
                            <h6 className='cart-item-title'>{item?.title}</h6>
                            <div>
                                <div className='d-flex justify-content-between'>
                                    <h6>{item.price} ₾</h6>
                                </div>
                                <div className="quantity-box">
                                    <button type='button' onClick={() => onMin(item)}>
                                        -
                                    </button>
                                    <input disabled={true} type="text" value={item.qty}/>
                                    <button type='button' onClick={() => onPlus(item)}>
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="quantity-box">
                            {item.qty} ცალი
                        </div>
                    </div>
                </div>
            </div>
        });
    }



    return (
        <>
            <div className="col-md-12 col-xl-12 bg-w p-0">
            <div className="">
                    <form className="row" onSubmit={handleSubmit(create)}>
                        <div className="col-md-9 col-xl-9" >
                            <div className="card">
                                <div className="card-header lite-background">
                                    <div className="row justify-content-between">
                                        <div className="col-md-12  d-flex align-items-center justify-content-between">
                                            <h5 className="card-title mb-0">
                                                {params.id?'რედაქტორება':'შეკვეთის გაფორმება '}
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                                <div className={"tab-pane "} style={{display:tabs.tab_1 === true?'block':'none'}}>
                                    {loading && params.id?<div className='text-center p-5'><CircularProgress /><p>Loading Data...</p></div>:<div className="card-body">
                                        {/*Start 2 Section*/}
                                        <div className='row'>
                                            {/*1 Section*/}
                                            <div className="col-xl-12 col-md-12 col-sm-12">


                                                <div className="mb-3">
                                                    <label htmlFor="inputEmail4"
                                                           className='pb-2 font_form_text '>მიმღების სახელი და
                                                        გვარი</label>
                                                    <input type="text" className="form-control p-2 font_form_text"
                                                           id="inputEmail4"
                                                           placeholder={'მიმღების სახელი'}
                                                           {...register('surname', {
                                                               required: "ველის შევსება აუცილებელია",
                                                           })}
                                                    />
                                                    {errors.surname && <div  className='text-danger font_form_text'>{errors.surname.message}</div>}
                                                </div>

                                                <div className="mb-3">
                                                    <label htmlFor="inputEmail4"
                                                           className='pb-2 font_form_text '>მიმღების ტელეფონი</label>
                                                    <input type="text" className="form-control p-2 font_form_text"
                                                           id="inputEmail4"
                                                           placeholder={'5** *** ***'}
                                                           {...register('phone', {
                                                               required: "ველის შევსება აუცილებელია",
                                                           })}
                                                    />
                                                    {errors.phone && <div
                                                        className='text-danger font_form_text'>{errors.phone.message}</div>}
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="inputEmail4"
                                                           className='pb-2 font_form_text font-weight-bold'>მიმღების
                                                        მისამართი</label>
                                                    <input type="text" className="form-control p-2 font_form_text"
                                                           id="inputEmail4"
                                                           placeholder={'ქუჩა, კორპუსი, ბინა, კარის ნომერი'}
                                                           {...register('address', {
                                                               required: "ველის შევსება აუცილებელია",
                                                           })}
                                                    />
                                                    {errors.address && <div
                                                        className='text-danger font_form_text'>{errors.address.message}</div>}
                                                </div>

                                                <div className="mb-3">
                                                    <label htmlFor="page_template "
                                                           className='pb-2 font_form_text font-weight-bold'>მიწოდების
                                                        დრო
                                                        ტიპი</label>
                                                    <FormControl sx={{width: '100%', padding: '0.2px'}} size="small">
                                                        <InputLabel
                                                            id="demo-simple-select-autowidth-label">დრო</InputLabel>
                                                        <Select
                                                            required
                                                            labelId="demo-simple-select-autowidth-label"
                                                            id="page_template"
                                                            value={selectedDeliveryTypes}
                                                            onChange={handleChangeDeliveryType}
                                                            label="მიწოდების ტიპი"

                                                        >
                                                            {deliveryTypes && deliveryTypes.map((item, index) => {
                                                                return <MenuItem key={index}
                                                                                 value={item.id}>{item.name}</MenuItem>
                                                            })}
                                                        </Select>
                                                    </FormControl>
                                                </div>

                                                <div className="mb-3">
                                                    <label htmlFor="page_template "
                                                           className='pb-2 font_form_title font-weight-bold'> ჩაბარების
                                                        თარიღი</label>
                                                    <TextField
                                                        {...register('delivery_date', {
                                                            required: "ჩაბარების თარიღი",
                                                        })}
                                                        size='small'
                                                        id="date"
                                                        label="თარიღი"
                                                        type="date"
                                                        sx={{width: '100%'}}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                    {errors.start_date && <div
                                                        className='form-error-messages-text font_form_text'>{errors.start_date.message}</div>}

                                                </div>
                                                {/*user*/}

                                                <div className="mb-3">
                                                    <label htmlFor="inputEmail4"
                                                           className='pb-2 font_form_text '>შემკვეთის სახელი და
                                                        გვარი</label>
                                                    <input type="text" className="form-control p-2 font_form_text"
                                                           id="inputEmail4"
                                                           placeholder={'შემკვეთის სახელი'}
                                                           {...register('user_surname', {
                                                               required: "ველის შევსება აუცილებელია",
                                                           })}
                                                    />
                                                    {errors.user_surname && <div
                                                        className='text-danger font_form_text'>{errors.user_surname.message}</div>}
                                                </div>

                                                <div className="mb-3">
                                                    <label htmlFor="inputEmail4"
                                                           className='pb-2 font_form_text '>შემკვეთის ტელეფონი</label>
                                                    <input type="text" className="form-control p-2 font_form_text"
                                                           id="inputEmail4"
                                                           placeholder={'5** *** ***'}
                                                           {...register('user_phone', {
                                                               required: "ველის შევსება აუცილებელია",
                                                           })}
                                                    />
                                                    {errors.user_phone && <div   className='text-danger font_form_text'>{errors.user_phone.message}</div>}
                                                </div>
                                                {/*end user*/}

                                                <div className="mb-3">
                                                    <label htmlFor="inputAddress"
                                                           className='pb-2 font_form_text font-weight-bold'>ბარათის
                                                        ტექსტი</label>
                                                    <textarea className="form-control p-2 font_form_text"
                                                              id="inputAddress"
                                                              placeholder='ტექსტი'
                                                              {...register('card_text', {
                                                                  // required:"გვერდის აღწერა",

                                                              })}></textarea>
                                                    {errors.comments && <div   className='text-danger font_form_text'>{errors.comments.message}</div>}
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="inputAddress"
                                                           className='pb-2 font_form_text font-weight-bold'>შენიშვნა</label>
                                                    <textarea className="form-control p-2 font_form_text"
                                                              id="inputAddress"
                                                              placeholder='კომენტარი'
                                                              {...register('comments', {
                                                                  // required:"გვერდის აღწერა",
                                                              })}></textarea>
                                                    {errors.comments && <div className='text-danger font_form_text'>{errors.comments.message}</div>}
                                                </div>

                                            </div>
                                            {/*End first Section*/}

                                        </div>
                                    </div>}
                                </div>
                                {/*Meta Tags */}

                                {/*End meta Tags */}
                            </div>
                        </div>
                        <div className={`col-md-3 col-xl-3 bg-w my-left-side-toolbar mb-4`}>


                            {JSON.parse(localStorage.getItem('cart'))?.length > 0 && <>
                                <div className="card m-cart-order" style={{background: "#f9f9f9"}}>
                                    <Sidebar size='12' pageType='createOrder' templateName='თქვენი შეკვეთა'/>
                                </div>
                            </>}

                            <div className="card  lite-background mt-3">
                                <h6 className='title_font ms-3 mt-3'>გადახდის მეთოდები</h6>
                                 <div className='p-3 title_font'>
                                    <input id='method-1' type='radio' name='2'  required={true}
                                        onChange={(e)=> {
                                            if(e.target.checked) setPaymentMethodState(1);

                                        }}
                                    />
                                    <label htmlFor='method-1'>&nbsp; გადარიცხვა</label>
                                </div>
                                {/*<div className='p-3 title_font'>*/}
                                {/*    <input id='method-2' type='radio' name='2' required={true}*/}
                                {/*           onChange={(e)=> {*/}
                                {/*               if(e.target.checked)  setPaymentMethodState(2);*/}
                                {/*           }}*/}
                                {/*    />*/}
                                {/*    <label htmlFor='method-2'>&nbsp; ბარათით VISA/MASTER CARD</label>*/}
                                {/*</div>*/}
                                <div className="card-header " style={{borderBottom: "1px dashed #a2a2a2"}}>
                                    <UseButtonBar manualDisable={!params.id && state?.cart?.length === 0}/>
                                </div>

                            </div>
                            {/*    Show added info */}
                        </div>
                    </form>
            </div>
            </div>
        </>
    )
}
export default CreateOrder;
