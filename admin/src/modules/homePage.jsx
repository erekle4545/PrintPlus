import React, {useContext, useEffect, useState} from "react";
import {Context} from "../store/context/context";
import {translate} from "../store/hooks/useMix";
import useHttp from "../store/hooks/http/useHttp";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


const HomePage = ()=>{
    let {state,dispatch} = useContext(Context);
    // End translate Lang
    const [data,setData] = useState([]);
    const [loading,setLoading] = useState(false);
    const [cardData,setCardData] = useState([]);
    const [date,setDate] = useState('');
    const [color,setColor] = useState('');
    const [text,setText] = useState('');
    let http = useHttp();

    //get data
    const getData = () => {
        setLoading(true)
        http.get('dashboard').then((response)=>{
            if(response.status === 200){
                setData(response.data)
            }
        }).catch(err=>{
            console.log(err.response)
        }).finally(() => {
            setLoading(false)
        });
    }

    const cartColor = (e) => {
        setColor(e.target.value)
    }
    const cardDate = (e) => {
        setDate(e.target.value)
    }

    const saveCard = () => {
        setCardData({
            color:color,
            date:date,
            text:text
        })
        dispatch({type:'NOTIFY',payload:state.notify.length > 0?[  {
                color:color,
                date:date,
                text:text
            },...state.notify]:[  {
                color:color,
                date:date,
                text:text
            }]})
    }
    useEffect(()=>{
        getData()
    },[])

    return (
        <>
            <div className="header">
                <h1 className="header-title title_font">
                    {translate('welcome',state.lang.code)} {state.user.name}!
                </h1>
                <p className="header-subtitle text_font">{translate('seeStatistics',state.lang.code)}</p>
            </div>

            <div className="row">
                <div className="col-xl-6 col-xxl-7">
                    <div className="card flex-fill w-100">
                        <div className="card-header">
                            <div className="card-actions float-end">
                                <a href="#" className="me-1">
                                    <i className="align-middle" data-feather="refresh-cw"></i>
                                </a>
                                <div className="d-inline-block dropdown show">
                                    <a href="#" data-bs-toggle="dropdown" data-bs-display="static">
                                        <i className="align-middle" data-feather="more-vertical"></i>
                                    </a>

                                    <div className="dropdown-menu dropdown-menu-end">
                                        <a className="dropdown-item" href="#">Action</a>
                                        <a className="dropdown-item" href="#">Another action</a>
                                        <a className="dropdown-item" href="#">Something else here</a>
                                    </div>
                                </div>
                            </div>
                            <h5 className="card-title mb-0">ჩანაწერების ბლოკონტი</h5>
                        </div>
                        <div className="card-body py-3">
                            <div className="chart chart-sm">
                                <div className='col-xl-12 font_form_title' >
                                    <TextField  required   onChange={(e)=>setText(e.target.value)} id="outlined-basic" fullWidth label="ჩანაწერი" variant="outlined" />
                                </div>
                                <div className='row pt-3'>
                                    <div className='col-4 font_form_title'>
                                        <TextField
                                            size='small'
                                            id="date"
                                            label="თარიღი"
                                            type="date"
                                            defaultValue="2022-08-24"
                                            sx={{ width: 220 }}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            onChange={cardDate}
                                            required={'required'}
                                        />
                                    </div>
                                    <div className='col-4 font_form_title'>
                                        <input required onChange={cartColor} type='color' defaultValue='#6610f2' style={{borderRadius:'100%',border:'none',height:'100%'}}/>
                                    </div>
                                </div>

                                <div className='mt-3'>
                                    <Button className='font_form_title' disabled={text?false:true} onClick={()=>saveCard()} variant="contained">ბარათის შექმა</Button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-6 col-xxl-5 d-flex">
                    <div className="w-100">
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col mt-0">
                                                <h5 className="card-title">გვერდები</h5>
                                            </div>

                                            <div className="col-auto">
                                                <div className="avatar">
                                                    <div className="avatar-title rounded-circle bg-primary-dark">
                                                        <i className="align-middle  fas fa-fw fa-file"></i>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <h1 className="display-5 mt-1 mb-3">{loading?'...':data.pages}</h1>
                                        {/*<div className="mb-0">*/}
                                        {/*    <span className="text-danger"> <i*/}
                                        {/*        className="mdi mdi-arrow-bottom-right"></i> -2.65% </span>*/}
                                        {/*    კლებადობა*/}
                                        {/*</div>*/}
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col mt-0">
                                                <h5 className="card-title">მომხმარებლები</h5>
                                            </div>

                                            <div className="col-auto">
                                                <div className="avatar">
                                                    <div className="avatar-title rounded-circle bg-primary-dark">
                                                        <i className="align-middle  fas fa-fw fa-users"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <h1 className="display-5 mt-1 mb-3">{loading?'...':data.users}</h1>
                                        {/*<div className="mb-0">*/}
                                        {/*    <span className="text-success"> <i*/}
                                        {/*        className="mdi mdi-arrow-bottom-right"></i> 5.50% </span>*/}
                                        {/*   მატება*/}
                                        {/*</div>*/}
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col mt-0">
                                                <h5 className="card-title">კატეგორები</h5>
                                            </div>

                                            <div className="col-auto">
                                                <div className="avatar">
                                                    <div className="avatar-title rounded-circle bg-primary-dark">
                                                        <i className="align-middle  fas fa-fw fa-book"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <h1 className="display-5 mt-1 mb-3">{loading?'...':data.categories}</h1>
                                        {/*<div className="mb-0">*/}
                                        {/*    <span className="text-success"> <i*/}
                                        {/*        className="mdi mdi-arrow-bottom-right"></i> 8.35% </span>*/}
                                        {/*    მატება*/}
                                        {/*</div>*/}
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col mt-0">
                                                <h5 className="card-title">ფაილები</h5>
                                            </div>

                                            <div className="col-auto">
                                                <div className="avatar">
                                                    <div className="avatar-title rounded-circle bg-primary-dark">
                                                        <i className="align-middle  fas fa-fw fa-images"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <h1 className="display-5 mt-1 mb-3">{loading?'...':data.files}</h1>
                                        {/*<div className="mb-0">*/}
                                        {/*    <span className="text-success"> <i*/}
                                        {/*        className="mdi mdi-arrow-bottom-right"></i> 8.35% </span>*/}
                                        {/*    მატება*/}
                                        {/*</div>*/}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/*<div className="row">*/}
            {/*    <div className="col-12 col-md-6 col-xxl-3 d-flex order-1 order-xxl-1">*/}
            {/*        <div className="card flex-fill">*/}
            {/*            <div className="card-header">*/}
            {/*                <div className="card-actions float-end">*/}
            {/*                    <a href="#" className="me-1">*/}
            {/*                        <i className="align-middle" data-feather="refresh-cw"></i>*/}
            {/*                    </a>*/}
            {/*                    <div className="d-inline-block dropdown show">*/}
            {/*                        <a href="#" data-bs-toggle="dropdown" data-bs-display="static">*/}
            {/*                            <i className="align-middle" data-feather="more-vertical"></i>*/}
            {/*                        </a>*/}

            {/*                        <div className="dropdown-menu dropdown-menu-end">*/}
            {/*                            <a className="dropdown-item" href="#">Action</a>*/}
            {/*                            <a className="dropdown-item" href="#">Another action</a>*/}
            {/*                            <a className="dropdown-item" href="#">Something else here</a>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*                <h5 className="card-title mb-0">Calendar</h5>*/}
            {/*            </div>*/}
            {/*            <div className="card-body d-flex">*/}
            {/*                <div className="align-self-center w-100">*/}
            {/*                    <div className="chart">*/}
            {/*                        <div id="datetimepicker-dashboard"></div>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div className="col-12 col-md-12 col-xxl-6 d-flex order-3 order-xxl-2">*/}
            {/*        <div className="card flex-fill w-100">*/}
            {/*            <div className="card-header">*/}
            {/*                <div className="card-actions float-end">*/}
            {/*                    <a href="#" className="me-1">*/}
            {/*                        <i className="align-middle" data-feather="refresh-cw"></i>*/}
            {/*                    </a>*/}
            {/*                    <div className="d-inline-block dropdown show">*/}
            {/*                        <a href="#" data-bs-toggle="dropdown" data-bs-display="static">*/}
            {/*                            <i className="align-middle" data-feather="more-vertical"></i>*/}
            {/*                        </a>*/}

            {/*                        <div className="dropdown-menu dropdown-menu-end">*/}
            {/*                            <a className="dropdown-item" href="#">Action</a>*/}
            {/*                            <a className="dropdown-item" href="#">Another action</a>*/}
            {/*                            <a className="dropdown-item" href="#">Something else here</a>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*                <h5 className="card-title mb-0">Current Visitors</h5>*/}
            {/*            </div>*/}
            {/*            <div className="card-body px-4">*/}
            {/*                <div id="world_map" style="height:350px;"></div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div className="col-12 col-md-6 col-xxl-3 d-flex order-2 order-xxl-3">*/}
            {/*        <div className="card flex-fill w-100">*/}
            {/*            <div className="card-header">*/}
            {/*                <div className="card-actions float-end">*/}
            {/*                    <a href="#" className="me-1">*/}
            {/*                        <i className="align-middle" data-feather="refresh-cw"></i>*/}
            {/*                    </a>*/}
            {/*                    <div className="d-inline-block dropdown show">*/}
            {/*                        <a href="#" data-bs-toggle="dropdown" data-bs-display="static">*/}
            {/*                            <i className="align-middle" data-feather="more-vertical"></i>*/}
            {/*                        </a>*/}

            {/*                        <div className="dropdown-menu dropdown-menu-end">*/}
            {/*                            <a className="dropdown-item" href="#">Action</a>*/}
            {/*                            <a className="dropdown-item" href="#">Another action</a>*/}
            {/*                            <a className="dropdown-item" href="#">Something else here</a>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*                <h5 className="card-title mb-0">Browser Usage</h5>*/}
            {/*            </div>*/}
            {/*            <div className="card-body d-flex">*/}
            {/*                <div className="align-self-center w-100">*/}
            {/*                    <div className="py-3">*/}
            {/*                        <div className="chart chart-xs">*/}
            {/*                            <canvas id="chartjs-dashboard-pie"></canvas>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}

            {/*                    <table className="table mb-0">*/}
            {/*                        <tbody>*/}
            {/*                        <tr>*/}
            {/*                            <td><i className="fas fa-circle text-primary fa-fw"></i> Chrome</td>*/}
            {/*                            <td className="text-end">4401</td>*/}
            {/*                        </tr>*/}
            {/*                        <tr>*/}
            {/*                            <td><i className="fas fa-circle text-warning fa-fw"></i> Firefox</td>*/}
            {/*                            <td className="text-end">4003</td>*/}
            {/*                        </tr>*/}
            {/*                        <tr>*/}
            {/*                            <td><i className="fas fa-circle text-danger fa-fw"></i> IE</td>*/}
            {/*                            <td className="text-end">1589</td>*/}
            {/*                        </tr>*/}
            {/*                        </tbody>*/}
            {/*                    </table>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/*<div className="row">*/}
            {/*    <div className="col-12 col-lg-8 col-xxl-9 d-flex">*/}
            {/*        <div className="card flex-fill">*/}
            {/*            <div className="card-header">*/}
            {/*                <div className="card-actions float-end">*/}
            {/*                    <a href="#" className="me-1">*/}
            {/*                        <i className="align-middle" data-feather="refresh-cw"></i>*/}
            {/*                    </a>*/}
            {/*                    <div className="d-inline-block dropdown show">*/}
            {/*                        <a href="#" data-bs-toggle="dropdown" data-bs-display="static">*/}
            {/*                            <i className="align-middle" data-feather="more-vertical"></i>*/}
            {/*                        </a>*/}

            {/*                        <div className="dropdown-menu dropdown-menu-end">*/}
            {/*                            <a className="dropdown-item" href="#">Action</a>*/}
            {/*                            <a className="dropdown-item" href="#">Another action</a>*/}
            {/*                            <a className="dropdown-item" href="#">Something else here</a>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*                <h5 className="card-title mb-0">Latest Projects</h5>*/}
            {/*            </div>*/}
            {/*            <table id="datatables-dashboard-projects" className="table table-striped my-0">*/}
            {/*                <thead>*/}
            {/*                <tr>*/}
            {/*                    <th>Name</th>*/}
            {/*                    <th className="d-none d-xl-table-cell">Start Date</th>*/}
            {/*                    <th className="d-none d-xl-table-cell">End Date</th>*/}
            {/*                    <th>Status</th>*/}
            {/*                    <th className="d-none d-md-table-cell">Assignee</th>*/}
            {/*                </tr>*/}
            {/*                </thead>*/}
            {/*                <tbody>*/}
            {/*                <tr>*/}
            {/*                    <td>Project Apollo</td>*/}
            {/*                    <td className="d-none d-xl-table-cell">01/01/2021</td>*/}
            {/*                    <td className="d-none d-xl-table-cell">31/06/2021</td>*/}
            {/*                    <td><span className="badge bg-success">Done</span></td>*/}
            {/*                    <td className="d-none d-md-table-cell">Carl Jenkins</td>*/}
            {/*                </tr>*/}
            {/*                <tr>*/}
            {/*                    <td>Project Fireball</td>*/}
            {/*                    <td className="d-none d-xl-table-cell">01/01/2021</td>*/}
            {/*                    <td className="d-none d-xl-table-cell">31/06/2021</td>*/}
            {/*                    <td><span className="badge bg-danger">Cancelled</span></td>*/}
            {/*                    <td className="d-none d-md-table-cell">Bertha Martin</td>*/}
            {/*                </tr>*/}
            {/*                <tr>*/}
            {/*                    <td>Project Hades</td>*/}
            {/*                    <td className="d-none d-xl-table-cell">01/01/2021</td>*/}
            {/*                    <td className="d-none d-xl-table-cell">31/06/2021</td>*/}
            {/*                    <td><span className="badge bg-success">Done</span></td>*/}
            {/*                    <td className="d-none d-md-table-cell">Stacie Hall</td>*/}
            {/*                </tr>*/}
            {/*                <tr>*/}
            {/*                    <td>Project Nitro</td>*/}
            {/*                    <td className="d-none d-xl-table-cell">01/01/2021</td>*/}
            {/*                    <td className="d-none d-xl-table-cell">31/06/2021</td>*/}
            {/*                    <td><span className="badge bg-warning">In progress</span></td>*/}
            {/*                    <td className="d-none d-md-table-cell">Carl Jenkins</td>*/}
            {/*                </tr>*/}
            {/*                <tr>*/}
            {/*                    <td>Project Phoenix</td>*/}
            {/*                    <td className="d-none d-xl-table-cell">01/01/2021</td>*/}
            {/*                    <td className="d-none d-xl-table-cell">31/06/2021</td>*/}
            {/*                    <td><span className="badge bg-success">Done</span></td>*/}
            {/*                    <td className="d-none d-md-table-cell">Bertha Martin</td>*/}
            {/*                </tr>*/}
            {/*                <tr>*/}
            {/*                    <td>Project X</td>*/}
            {/*                    <td className="d-none d-xl-table-cell">01/01/2021</td>*/}
            {/*                    <td className="d-none d-xl-table-cell">31/06/2021</td>*/}
            {/*                    <td><span className="badge bg-success">Done</span></td>*/}
            {/*                    <td className="d-none d-md-table-cell">Stacie Hall</td>*/}
            {/*                </tr>*/}
            {/*                <tr>*/}
            {/*                    <td>Project Romeo</td>*/}
            {/*                    <td className="d-none d-xl-table-cell">01/01/2021</td>*/}
            {/*                    <td className="d-none d-xl-table-cell">31/06/2021</td>*/}
            {/*                    <td><span className="badge bg-success">Done</span></td>*/}
            {/*                    <td className="d-none d-md-table-cell">Ashley Briggs</td>*/}
            {/*                </tr>*/}
            {/*                <tr>*/}
            {/*                    <td>Project Wombat</td>*/}
            {/*                    <td className="d-none d-xl-table-cell">01/01/2021</td>*/}
            {/*                    <td className="d-none d-xl-table-cell">31/06/2021</td>*/}
            {/*                    <td><span className="badge bg-warning">In progress</span></td>*/}
            {/*                    <td className="d-none d-md-table-cell">Bertha Martin</td>*/}
            {/*                </tr>*/}
            {/*                <tr>*/}
            {/*                    <td>Project Zircon</td>*/}
            {/*                    <td className="d-none d-xl-table-cell">01/01/2021</td>*/}
            {/*                    <td className="d-none d-xl-table-cell">31/06/2021</td>*/}
            {/*                    <td><span className="badge bg-danger">Cancelled</span></td>*/}
            {/*                    <td className="d-none d-md-table-cell">Stacie Hall</td>*/}
            {/*                </tr>*/}
            {/*                </tbody>*/}
            {/*            </table>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div className="col-12 col-lg-4 col-xxl-3 d-flex">*/}
            {/*        <div className="card flex-fill w-100">*/}
            {/*            <div className="card-header">*/}
            {/*                <div className="card-actions float-end">*/}
            {/*                    <a href="#" className="me-1">*/}
            {/*                        <i className="align-middle" data-feather="refresh-cw"></i>*/}
            {/*                    </a>*/}
            {/*                    <div className="d-inline-block dropdown show">*/}
            {/*                        <a href="#" data-bs-toggle="dropdown" data-bs-display="static">*/}
            {/*                            <i className="align-middle" data-feather="more-vertical"></i>*/}
            {/*                        </a>*/}

            {/*                        <div className="dropdown-menu dropdown-menu-end">*/}
            {/*                            <a className="dropdown-item" href="#">Action</a>*/}
            {/*                            <a className="dropdown-item" href="#">Another action</a>*/}
            {/*                            <a className="dropdown-item" href="#">Something else here</a>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*                <h5 className="card-title mb-0">Monthly Sales</h5>*/}
            {/*            </div>*/}
            {/*            <div className="card-body d-flex w-100">*/}
            {/*                <div className="align-self-center chart chart-lg">*/}
            {/*                    <canvas id="chartjs-dashboard-bar"></canvas>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

        </>
    )
}

export default HomePage;