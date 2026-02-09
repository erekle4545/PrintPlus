import React, {useContext, useEffect, useState} from "react";
import Box from "@mui/material/Box";
import {translate} from "../../store/hooks/useMix";
import {Context} from "../../store/context/context";
import useHttp from "../../store/hooks/http/useHttp";
import IconButton from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import {Link, useNavigate} from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import {deleteAlert, errorAlerts} from "../../store/hooks/global/useAlert";
import UseFormLang from "../../store/hooks/global/useFormLang";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Pagination from '@mui/material/Pagination';
import {RouteLinks} from "../../store/hooks/useRouteLinks";
import CircularProgress from "@mui/material/CircularProgress";

const Users = () => {
    let {state} = useContext(Context);
    let http = useHttp();
    let navigate = useNavigate();
    const [data,setData] = useState([])
    const [selectedConfigOptionStatus, setSelectedConfigOptionStatus] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState(null);
    const [pagination, setPagination] = useState([]);
    const [checkbox, setCheckbox] = useState([]);
    const [postPagination, setPostPagination] = useState(1);
    const [options,setOptions]= useState({
        statuses:[]
    })
    const [loading, setLoading] = useState({
        pageList:false
    });

    // get users
    const getData = () => {
        setLoading({
            pageList:true
        })
        http.get(`users?page=${postPagination}`,{
            params:{
                language_id:state.form_active_lang.activeLangId,
                keyword:searchKeyword??null,
                status:selectedConfigOptionStatus??null
            }
        }).then((response)=>{
            console.log(response)
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
                <td>
                    <img width='50' src="/img/avatars/avatar.png" className="img-fluid rounded-circle mb-2" alt="user"/>
                </td>
                <td>{item.name}</td>
                <td>
                    {item.phone}
                </td>
                <td> {item.email}</td>
                <td>
                    {item.roles[0]?.name}
                </td>
                <td>
                    {item.orders_count}
                </td>

                <td>
                    {addedTime.toDateString()}
                </td>
                <td>
                    <IconButton disabled={item.id === 1?true:false} variant="extended" onClick={()=> {deleteAlert(checkbox, deleteRow);}} color={'error'} aria-label="delete">
                        <DeleteIcon />
                    </IconButton>
                </td>
            </tr>
        });
    }
    // Option Configs
    const getOptions = () => {
        http.get('options/users').then((response)=>{
            if(response.status === 200){
                setOptions({
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
        http.delete('user/delete/'+id).then((response)=>{
            if(response.status === 200){
                setData(data.filter(e=>e.id !== id))
            }
        }).catch(err => {
            console.log(err.response)
            errorAlerts(err.response.status,err.response.statusText,err.response.data.errors)
        })
    }



    useEffect(()=>{
        getData()
        getOptions()
    },[state.form_active_lang.activeLangId,selectedConfigOptionStatus,searchKeyword,postPagination])
    return(
        <>
            <div className="col-md-12 col-xl-12 bg-w">
                <div className="card ">
                    <div className="card-header lite-background">
                        <div className="row justify-content-end align-items-center">
                            <div className="col-xl-6 col-sm-6 text-left text-sm-center d-flex" >
                                {/*<IconButton disabled={true} onClick={()=>navigate('/'+RouteLinks.createCategory)} color='primary' className='text_font ' variant="contained"><AddIcon/></IconButton>*/}
                                <h5 className="card-title mb-0 p-2">
                                    <Box component="span" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} >
                                        <img
                                            loading="lazy"
                                            width="20"
                                            src={`https://flagcdn.com/w20/${state.form_active_lang.code && state.form_active_lang.code ==='KA'?'ge':state.form_active_lang.code&&state.form_active_lang.code.toLowerCase()}.png`}
                                            srcSet={`https://flagcdn.com/w40/${state.form_active_lang.code && state.form_active_lang.code ==='KA'?'ge':state.form_active_lang.code&&state.form_active_lang.code.toLowerCase()}.png 2x`}
                                            alt=""
                                        />
                                    </Box>
                                    {translate('users',state.lang.code)}
                                </h5>
                            </div>
                            <div className="col-xl-6 col-sm-6 text-right text-sm-center" >
                                <div className="card-actions float-end">
                                    <ul className='nav lang'>
                                        <UseFormLang leave={null}/>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="tools-choose-config ">
                        <div className="col-xl-8 col-sm-12  p-1">
                            <label htmlFor="text" className='pb-2 font_form_title font-weight-bold'>ძებნა</label>
                            <TextField  fullWidth onChange={handleChangeSearch} label="ძებნა" size='small' id="text" />
                        </div>
                        <div className="col-xl-2 col-sm-12 p-1">
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
                        <div  className="col-xl-2 col-sm-12  text-center p-1">
                            <div>
                                <label htmlFor="page_status" className='pb-2 font_form_title font-weight-bold'>გასუფთავება</label></div>
                            <IconButton onClick={clear} color='secondary'  variant="contained"><ClearIcon/>Clear</IconButton>
                        </div>
                    </div>
                    {loading.pageList?<div className='text-center p-5'><CircularProgress /><p>იტვირთება...</p></div> :<div>
                        {data.length > 0?<><table className="table table-striped ">
                                <thead className=''>
                                <tr className={'title_font'}>
                                    <th scope="col" className={'text-center'}># ID</th>
                                    <th scope="col">ფოტო</th>
                                    <th scope="col">სახელი</th>
                                    <th scope="col">ტელეფონი</th>
                                    <th scope="col">ელ-ფოსტა</th>
                                    <th scope="col">როლი</th>
                                    <th scope="col">შეკვეთები</th>
                                    <th scope="col">დამატების დრო</th>
                                    <th scope="col " className='text-end '>

                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {tableRow()}
                                </tbody>
                            </table>
                            </>
                            :<h6 className={'text-center text_font p-5'}>ჩანაწერები არ არის...</h6>}
                        <div className='col-12 p-4 d-flex justify-content-end'><Pagination count={pagination.last_page}  onChange={handleChangePagination} color="primary" /></div>
                    </div>}
                </div>
            </div>
        </>
    )
}
export default Users;