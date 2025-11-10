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

const CustomerList = () => {
    let http = useHttp();
    let navigate = useNavigate();
    const [data,setData] = useState([])
    const [selectedConfigOptionStatus, setSelectedConfigOptionStatus] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState(null);
    const [pagination, setPagination] = useState([]);
    const [checkbox, setCheckbox] = useState([]);
    const [totalPage, setTotalPage] = useState(0);

    const [postPagination, setPostPagination] = useState(1);
    const [options,setOptions]= useState({
        payment_state:[],
        statuses:[]
    })
    const [loading, setLoading] = useState({
        pageList:false
    });
    const getData = () => {
        setLoading({
            pageList:true
        })
        http.get(`customers?page=${postPagination}`,{
            params:{
                keyword:searchKeyword??null,
                status:selectedConfigOptionStatus??null
            }
        }).then((response)=>{
            setTotalPage(response.data.total)

            if(response.status === 200){
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
    const handleChangeSelectStatus = (e) => {
        setSelectedConfigOptionStatus(e.target.value);

    };

    const handleChangeSearch = (e) => {
        setSearchKeyword(e.target.value);

    };

    const clear = () => {
        setSearchKeyword(null)
        setSelectedConfigOptionStatus(null)
    }

    // pagination
    const handleChangePagination = (e,value) => {
        setPostPagination(value)
    }
    // get Row
    const tableRow = () => {
        return data.map((item,index)=>{
            let addedTime = new Date(item.created_at);

            return <tr key={index} className={'text_font'}>
                <th scope="row" className='text-center align-items-center'>{item.id}</th>
                <td >
                    <img height='100' src={item.covers&&item.covers.slice(0,1).map(image=> process.env.REACT_APP_FILE_URL+'/'+image.output_path )} />
                </td>
                <td>{item.social_name}</td>
                <td>{item.surname}</td>
                <td>{item.phone}</td>
                <td>{item.address}</td>
                <td>{item.facebook_correspondence}</td>
                <td>{item.payment_state}</td>
                <td>{addedTime.toDateString()}</td>
                <td>
                    <div className='d-flex justify-content-end '>
                        <input style={{marginRight:'1rem'}} onChange={checkedDelete} value={item.id} type='checkbox' />
                         <Link to={'/customers/edit/'+item.id}>
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
        http.get('customers/options').then((response)=>{
            if(response.status === 200){
                setOptions({
                    payment_state:response.data.data.paymentStates,
                    statuses:response.data.data.statuses
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
        http.delete('customer/delete/'+id).then((response)=>{
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
    },[selectedConfigOptionStatus,searchKeyword,postPagination])
    return(
        <>
            <div className="col-md-12 col-xl-12 bg-w p-4">
                <div className="card ">
                    <div className="card-header lite-background">
                        <div className="row justify-content-end align-items-center">
                            <div className="col-xl-6 col-sm-6 text-left text-sm-center d-flex" >
                                <IconButton onClick={()=>navigate('/'+RouteLinks.createCustomer)} color='primary' className='text_font ' variant="contained"><AddIcon/></IconButton>
                                <h5 className="card-title mb-0 p-2">
                                   ყველა მომხმარებლები {totalPage}
                                </h5>
                            </div>
                            <div className="col-xl-6 col-sm-6 text-right text-sm-center" >
                                <div className="card-actions float-end">
                                    <ul className='nav lang'>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row p-4">
                        <div className="col-xl-8 col-sm-12 ">
                            <label htmlFor="text" className='pb-2 font_form_title font-weight-bold'>ძებნა</label>
                            <TextField  fullWidth onChange={handleChangeSearch} label="ძებნა" size='small' id="text" />
                        </div>
                        <div className="col-xl-2 col-sm-12   ">
                            <label htmlFor="page_status" className='pb-2 font_form_title font-weight-bold'>სტატუსი</label>
                            <FormControl sx={{  width: '100%',padding:'0.2px' }} size="small">
                                <InputLabel id="demo-simple-select-autowidth-label">Status</InputLabel>
                                <Select
                                    labelId="demo-simple-select-autowidth-label"
                                    id="page_status"
                                    // value='1'
                                    onChange={handleChangeSelectStatus}
                                    label="Status"
                                >
                                    <MenuItem key={options.statuses.active} value={options.statuses.active}>Active</MenuItem>
                                    <MenuItem key={options.statuses.inactive} value={options.statuses.inactive}>Inactive</MenuItem>

                                </Select>
                            </FormControl>
                        </div>
                        <div  className="col-xl-2 col-sm-12  text-center ">
                            <div>
                                <label htmlFor="page_status" className='pb-2 font_form_title font-weight-bold'>გასუფთავება</label></div>
                            <IconButton onClick={clear} color='secondary'  variant="contained"><ClearIcon/>Clear</IconButton>
                        </div>
                    </div>

                    {loading.pageList?<div className='text-center p-5'><CircularProgress /><p>Loading Data...</p></div> :<div>
                        {data.length > 0?<><table className="table table-striped ">
                                <thead className=''>
                                <tr className={'title_font'}>
                                    <th scope="col" className={'text-center'}># ID</th>
                                    <th scope="col">ფოტო</th>
                                    <th scope="col">social name</th>
                                    <th scope="col">სახელი</th>
                                    <th scope="col">ტელ.</th>
                                    <th scope="col">მისამართი</th>
                                    <th scope="col">ფბ მიმოწერა</th>
                                    <th scope="col">გადახდის სტატუსი</th>
                                    <th scope="col">დამატების დრო</th>
                                    <th scope="col" className='text-end'>
                                        <IconButton variant="extended" onClick={()=> {deleteAlert(checkbox, deleteRow);}} color={'error'} aria-label="delete">
                                            <DeleteIcon />
                                        </IconButton>
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
export default CustomerList;