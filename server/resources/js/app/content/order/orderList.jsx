import React, {useEffect, useState} from "react";

import useHttp from "../../store/hooks/http/useHttp";
import IconButton from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import {Link, useNavigate} from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import {deleteAlert, errorAlerts} from "../../store/hooks/global/useAlert";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Pagination from '@mui/material/Pagination';
import {RouteLinks} from "../../store/hooks/useRouteLinks";
import CircularProgress from "@mui/material/CircularProgress";
import DatePickerStartEnd from "../../store/hooks/components/datePickerStartEnd";
import {ExportExcel} from "../../store/hooks/global/export";

const OrderList = () => {
    let http = useHttp();
    let navigate = useNavigate();
    const [data,setData] = useState([])
    const [selectedConfigOptionStatus, setSelectedConfigOptionStatus] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState(null);
    const [pagination, setPagination] = useState([]);
    const [datePicker, setDatePicker] = useState([]);
    const [checkbox, setCheckbox] = useState([]);
    const [postPagination, setPostPagination] = useState(1);
    const [selectedDeliveryType, setSelectedDeliveryType] = useState('');
    const [selectedPaymentState, setSelectedPaymentState] = useState('');
    const [selectedUser, setSelectedUser] = useState('');

    const [totalPage, setTotalPage] = useState(0);
    const [options,setOptions]= useState({
        statuses:[],
        paymentStates:[],
        deliveryTypes:[],
        deliveryPrices:[]

    })
    const [loading, setLoading] = useState({
        pageList:false
    });
    const getData = () => {
        setLoading({
            pageList:true
        })
        http.get(`orders?page=${postPagination}`,{
            params:{
                keyword:searchKeyword??null,
                date_picker:datePicker,
                status:selectedConfigOptionStatus??null,
                deliveryTypes:selectedDeliveryType??null,
                paymentStates:selectedPaymentState??null,
                user_id:selectedUser??null,
            }
        }).then((response)=>{
            if(response.status === 200){
                setTotalPage(response.data.total)
                setData(response.data.data)
                setPagination(response.data)
            }
        }).catch(err=>{
            console.log(err.response)
        }).finally(() => {
            setLoading({
                pageList:false
            })
        });
    }

    const handleChangeSelectUser = (e) => {
        setSelectedUser(e.target.value);
    };

    const handleChangeSelectDeliveryTypes = (e) => {
        setSelectedDeliveryType(e.target.value);
    };

    const handleChangeSelectPaymentStatus = (e) => {
        setSelectedPaymentState(e.target.value);
    };

    const handleChangeSelectStatus = (e) => {
        setSelectedConfigOptionStatus(e.target.value);

    };

    const handleChangeSearch = (e) => {
        setSearchKeyword(e.target.value);

    };

    const clear = () => {
        setSearchKeyword(null)
        setSelectedConfigOptionStatus(null)
        setSelectedPaymentState(null)
        setSelectedDeliveryType(null)
        setSelectedUser(null)
    }

    // pagination
    const handleChangePagination = (e,value) => {
        setPostPagination(value)
    }

    // get Row
    const tableRow = () => {
        return data.map((item,index)=>{
            let addedTime = new Date(item.created_at);
            let deliveryTime = new Date(item.delivery_date);
            // total price order items
            const itemPrice = item.order_items?item.order_items.reduce((a, c) => {
                return  a + c.qty * c.price
            }, 0):0;
            const orderItemsGet  = () =>{

                return item.order_items.map((i,n)=>{
                    return <>
                        <strong>{i.product?.title}</strong>
                        <br/>
                        <strong>რაოდ:</strong>{i.qty}  / <strong> ფასი:</strong> {i.total_price} ₾
                        <hr/>


                    </>
                })
            }
            const deliveryPriceCalculator = ()=>{
                if(parseInt(item.delivery_type) === 1  && itemPrice < options.deliveryPrices[0]?.conditional){
                    return itemPrice +  options.deliveryPrices[1]?.price
                }else if(parseInt(item.delivery_type) === 2  && itemPrice < options.deliveryPrices[0]?.conditional){
                    return itemPrice +  options.deliveryPrices[2]?.price
                }else{
                    return itemPrice;
                }
            }
            const deliveryPriceCalculatorOnlyPrice = ()=>{
                if(parseInt(item.delivery_type) === 1  && itemPrice < options.deliveryPrices[0]?.conditional){
                    return  options.deliveryPrices[1]?.price
                }else if(parseInt(item.delivery_type) === 2  && itemPrice < options.deliveryPrices[0]?.conditional){
                    return  options.deliveryPrices[2]?.price
                }else{
                    return null;
                }
            }

            return <tr key={index} className={'text_font order-list-tr'} >
                <th scope="row" className='text-center align-items-center'>{item.delivery_type  === 1?'T':'R'}{item.id}</th>
                {/*<td >*/}
                {/*    <img height='100' src={item.covers&&item.covers.slice(0,1).map(image=> process.env.REACT_APP_FILE_URL+'/'+image.output_path )} />*/}
                {/*</td>*/}
                <td>{item.social_name}</td>
                <td>{item.surname}</td>
                <td>{item.phone}</td>
                <td>{item.address}</td>
                <td>
                    {orderItemsGet()}
                    <div className='text-success '>
                        <strong>
                            <div>
                                {deliveryPriceCalculatorOnlyPrice() && 'მიწოდების ფასი: ' + deliveryPriceCalculatorOnlyPrice() + ' ₾'}
                            </div>
                            სრული ფასი: {deliveryPriceCalculator()} ₾

                        </strong>
                    </div>
                </td>
                <td>{options.paymentStates?.filter(e => e.id === item.payment_state)[0]?.name}</td>
                {/*<td>{options.deliveryTypes?.filter(e=>e.id === item.delivery_type)[0]?.name}</td>*/}
                {/*<td>{addedTime.toDateString()}</td>*/}
                <td>{deliveryTime.toDateString()}</td>
                <td>
                    <div className='d-flex justify-content-end '>
                        {/*<input style={{marginRight:'1rem'}} onChange={checkedDelete} value={item.id} type='checkbox' />*/}
                        <Link to={'/orders/edit/'+item.id}>
                            <IconButton variant="extended" color={'success'} aria-label="delete">
                                <EditIcon />
                            </IconButton>
                        </Link>
                        <IconButton variant="extended" onClick={()=>deleteAlert(item.id,deleteRow)} color={'error'} aria-label="delete">
                            <DeleteIcon />
                        </IconButton>
                    </div>
                </td>
            </tr>
        });
    }
    // Option Configs
    const getOptions = () => {
        http.get('orders/options').then((response)=>{
            if(response.status === 200){
                setOptions({
                    deliveryTypes:response.data.data.delivery_types,
                    paymentStates:response.data.data.paymentStates,
                    users:response.data.data.users,
                    statuses:response.data.data.statuses,
                    deliveryPrices:response.data.data.delivery_prices
                })

            }
        }).catch(err=>{
            console.log(err.response)
            errorAlerts(err.response.status,err.response.statusText,err.response.data.errors)
        })
    }
    // End option Configs


    // Delete
    const deleteRow = (id) => {
        http.delete('order/delete/'+id).then((response)=>{
            if(response.status === 200){
                setData(data.filter(e=>e.id !== id))
            }
        }).catch(err => {
            console.log(err.response)
            errorAlerts(err.response.status,err.response.statusText,err.response.data.errors)
        })
    }

    // take check id
    const checkedDelete = (e) => {
        if(e.target.checked === true){
            setCheckbox([...checkbox,e.target.value])

        }else{
            setCheckbox(checkbox.filter(item => item !== e.target.value))
        }
    }

    useEffect(()=>{
        getData()
        getOptions()
    },[selectedUser,selectedConfigOptionStatus,searchKeyword,postPagination,datePicker,selectedDeliveryType,selectedPaymentState])
    const dateNow = new Date().toDateString();
    const excelName = datePicker?.length > 0 ?`${parseInt(selectedDeliveryType) === 1?'თბილისი':parseInt(selectedDeliveryType) === 2?'რეგიონი':'საერთო'}_შეკვეთების_სია`+datePicker?.[0]+'/'+datePicker?.[1]:`${parseInt(selectedDeliveryType) === 1?'თბილისი':parseInt(selectedDeliveryType) === 2?'რეგიონი':'საერთო'}_შეკვეთების_სია_`+dateNow
    return(
        <>
            <div className="col-md-12 col-xl-12 bg-w p-4">
                <div className="card ">
                    <div className="card-header lite-background">
                        <div className="row justify-content-end align-items-center">
                            <div className="col-xl-12 col-sm-12  d-flex justify-content-between" >
                                <div className='text-left text-sm-center d-flex'>
                                    <IconButton onClick={()=>navigate('/'+RouteLinks.createOrder)} color='primary' className='text_font ' variant="contained"><AddIcon/></IconButton>
                                    <h5 className="card-title mb-0 p-2">
                                        ყველა შეკვეთა {totalPage}

                                    </h5>
                                </div>
                                <button className='btn btn-success'  onClick={() => ExportExcel('export/invoice', excelName , 'xlsx',0,datePicker,{
                                    selectedDeliveryType:selectedDeliveryType,
                                    selectedPaymentState:selectedPaymentState
                                })} type='button'>Export Excel </button>
                            </div>

                        </div>
                    </div>
                    <div className="row p-4">
                        <div className="col-xl-4 col-sm-12 ">
                            <label htmlFor="text" className='pb-2 font_form_title font-weight-bold'>ძებნა</label>
                            <TextField  fullWidth onChange={handleChangeSearch} label="ძებნა" size='small' id="text" />
                        </div>
                        <div className="col-xl-4 col-sm-12 ">
                            <label htmlFor="text" className='pb-2 font_form_title font-weight-bold'>თარიღით ძებნა</label>
                            <DatePickerStartEnd size={'100%'} props={setDatePicker} />
                        </div>
                        {/*<div className="col-xl-2 col-sm-12   ">*/}
                        {/*    <label htmlFor="page_status" className='pb-2 font_form_title font-weight-bold'>სტატუსი</label>*/}
                        {/*    <FormControl sx={{  width: '100%',padding:'0.2px' }} size="small">*/}
                        {/*        <InputLabel id="demo-simple-select-autowidth-label">Status</InputLabel>*/}
                        {/*        <Select*/}
                        {/*            labelId="demo-simple-select-autowidth-label"*/}
                        {/*            id="page_status"*/}
                        {/*            // value='1'*/}
                        {/*            onChange={handleChangeSelectStatus}*/}
                        {/*            label="Status"*/}
                        {/*        >*/}
                        {/*            <MenuItem key={options.statuses.active} value={options.statuses.active}>Active</MenuItem>*/}
                        {/*            <MenuItem key={options.statuses.inactive} value={options.statuses.inactive}>Inactive</MenuItem>*/}

                        {/*        </Select>*/}
                        {/*    </FormControl>*/}
                        {/*</div>*/}
                        <div  className="col-xl-2 col-sm-12  text-center ">
                            <div>
                                <label htmlFor="page_status" className='pb-2 font_form_title font-weight-bold'>გასუფთავება</label></div>
                            <IconButton onClick={clear} color='secondary'  variant="contained"><ClearIcon/>Clear</IconButton>
                        </div>
                    </div>


                    <div className="row ps-4">
                        <div className="col-xl-2 col-sm-12   ">
                            <label htmlFor="page_status" className='pb-2 font_form_title font-weight-bold'>მიწოდების ტიპი</label>
                            <FormControl sx={{  width: '100%',padding:'0.2px' }} size="small">
                                <InputLabel id="demo-simple-select-autowidth-label">მიწოდების ტიპი</InputLabel>
                                <Select
                                    required
                                    labelId="demo-simple-select-autowidth-label"
                                    id="page_template"
                                    value={selectedDeliveryType}
                                    onChange={handleChangeSelectDeliveryTypes}
                                    label="მიწოდების ტიპი"

                                >
                                    {options.deliveryTypes&&options.deliveryTypes.map((item,index)=>{
                                        return  <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                        </div>

                        <div className="col-xl-2 col-sm-12   ">
                            <label htmlFor="page_status" className='pb-2 font_form_title font-weight-bold'>გადახდის ტიპი</label>
                            <FormControl sx={{  width: '100%',padding:'0.2px' }} size="small">
                                <InputLabel id="demo-simple-select-autowidth-label">გადახდის ტიპი</InputLabel>
                                <Select
                                    required
                                    labelId="demo-simple-select-autowidth-label"
                                    id="page_template"
                                    value={selectedPaymentState}
                                    onChange={handleChangeSelectPaymentStatus}
                                    label="გადახდის ტიპი"

                                >
                                    {options.paymentStates&&options.paymentStates.map((item,index)=>{
                                        return  <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                        </div>

                        <div className="col-xl-2 col-sm-12   ">
                            <label htmlFor="page_status" className='pb-2 font_form_title font-weight-bold'>ოპერატორები</label>
                            <FormControl sx={{  width: '100%',padding:'0.2px' }} size="small">
                                <InputLabel id="demo-simple-select-autowidth-label">ოპერატორები</InputLabel>
                                <Select
                                    required
                                    labelId="demo-simple-select-autowidth-label"
                                    id="page_template"
                                    value={selectedUser}
                                    onChange={handleChangeSelectUser}
                                    label="ოპერატორები"
                                >
                                    {options.users&&options.users.map((item,index)=>{
                                        return  <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    {loading.pageList?<div className='text-center p-5'><CircularProgress /><p>Loading Data...</p></div> :<div>
                        {data.length > 0?<><table className="table table-striped ">
                                <thead className=''>
                                <tr className={'title_font'} style={{fontSize:'0.9rem'}}>
                                    <th scope="col" className={'text-center'}># შეკვეთა</th>
                                    {/*<th scope="col">ფოტო</th>*/}
                                    <th scope="col">social name</th>
                                    <th scope="col">სახელი</th>
                                    <th scope="col">ტელ.</th>
                                    <th scope="col">მისამართი</th>
                                    <th scope="col">პროდუქტები</th>
                                    <th scope="col">გადახდის სტატუსი</th>
                                    {/*<th scope="col">მდებარეობა</th>*/}
                                    <th scope="col">მიწოდების დრო</th>
                                    <th scope="col" className='text-end'>
                                        {/*<IconButton variant="extended" onClick={()=> {deleteAlert(checkbox, deleteRow);}} color={'error'} aria-label="delete">*/}
                                        {/*    <DeleteIcon />*/}
                                        {/*</IconButton>*/}
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {tableRow()}
                                </tbody>
                            </table>
                            </>
                            :<h6 className={'text-center text_font p-5'}>ჩანაწერები არ არის...</h6>}
                    </div>}
                    <div className='col-12 p-4 d-flex justify-content-end'><Pagination count={pagination.last_page}  onChange={handleChangePagination} color="primary" /></div>

                </div>
            </div>
        </>
    )
}
export default OrderList;