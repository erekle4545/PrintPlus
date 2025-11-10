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
import Switch from "@mui/material/Switch";
import Swal from "sweetalert2";
import {useAlert} from "react-alert";
import {Person} from "@mui/icons-material";

const Users = () => {
    let {state} = useContext(Context);
    let http = useHttp();
    let navigate = useNavigate();
    const alerts = useAlert()
    const [data,setData] = useState([])
    const [selectedConfigOptionStatus, setSelectedConfigOptionStatus] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState(null);
    const [pagination, setPagination] = useState([]);
    const [checkbox, setCheckbox] = useState([]);
    const [postPagination, setPostPagination] = useState(1);
    const [userStatus, setUserStatus] = useState(false);

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
                    <div className='col-6 text-center align-middle page-statuses'>
                        <Switch
                            defaultChecked={item.status === 1? true: false}
                            // checked={langDefaultSwitch[lang.code]}
                            onChange={handleChangeSwitchStatus}
                            name={item.name}
                            key={item.id}
                            value={item.id}
                            size="small"
                            disabled={true}
                        />
                    </div>
                </td>
                <td>
                    {addedTime.toDateString()}
                </td>
                <td>
                    <IconButton disabled={item.id === 1?true:false} variant="extended" onClick={()=> {deleteAlert(item.id, deleteRow);}} color={'error'} aria-label="delete">
                        <DeleteIcon />
                    </IconButton>
                </td>
            </tr>
        });
    }
    // Option Configs
    const getOptions = () => {
        http.get('users/options').then((response)=>{
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


    // Language Status Update
    const handleChangeSwitchStatus = (event) => {
        http.put(`user/update/${event.target.value}`,{
            status:event.target.checked?1:2
        }).then((response)=>{
            if(response.status === 200){
                alerts.success(`სტატუსი შეცვლილია`);

                setUserStatus({
                    ...userStatus,
                    [event.target.name]: event.target.checked,
                });

            }
        }).catch(err=>{
            console.log(err.response)
            errorAlerts(err.response.status,err.response.statusText,err.response.message)
        });
    };


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
                            <div className="text-left text-sm-center d-flex">
                             
                                <div className='w-100 d-flex justify-content-between'>
                                <IconButton onClick={() => navigate('/users/register')} color='primary'  className='text_font ' variant="contained"><AddIcon/></IconButton>
                                <IconButton onClick={() => navigate('/users/roles')} color='error'  className='text_font ' variant="contained">პოზიციები</IconButton>
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
                            <FormControl  sx={{  width: '100%',padding:'0.2px' }} size="small">
                                <InputLabel id="demo-simple-select-autowidth-label">Status</InputLabel>
                                <Select
                                    labelId="demo-simple-select-autowidth-label"
                                    id="page_status"
                                    // value='1'
                                    onChange={handleChangeSelectStatus}
                                    label="Status"
                                >
                                    <MenuItem key={options.statuses.active} value={options.statuses.active}>Active</MenuItem>
                                    <MenuItem key={options.statuses.inactive}  value={options.statuses.inactive}>Inactive</MenuItem>

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
                                    <th scope="col">სახელი</th>
                                    <th scope="col">ტელეფონი</th>
                                    <th scope="col">ელ-ფოსტა</th>
                                    <th scope="col">როლი</th>
                                    <th scope="col">სტატუსი</th>
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