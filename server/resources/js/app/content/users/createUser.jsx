import React, {useContext, useEffect, useRef,useState} from 'react';
import {Context} from "../../store/context/context";
import {useForm} from "react-hook-form";
import useHttp from "../../store/hooks/http/useHttp";
import {errorAlerts} from "../../store/hooks/global/useAlert";
import {useAlert} from 'react-alert';
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
export default function CreateUser() {
    const alerts = useAlert();
    const {state} = useContext(Context);
    const http = useHttp();
    const [addSuccess,setAddSuccess] = useState({});
    const [pageStatus, setPageStatus] = useState(true);
    const [options, setOptions] = useState({
        roles:[]
    });
    const [selectedPageTemplate, setSelectedPageTemplate] = useState('');

    // form Data
    const userEditData = {
        username:state.user&&state.user.name,
        email:state.user&&state.user.email,
        phone:state.user&&state.user.phone,
        position:state.user&&state.user.roles?.[0].name,
        status:state.user&&state.user.user_status,
        created_at:new Date(state.user.created_at).toDateString(),
        updated_at:new Date(state.user.updated_at).toDateString()
    }
    const {register,handleSubmit,setValue,getValues,formState: { errors },watch,reset } = useForm();

    const resets = () =>
    {
        reset({
                name:'',
                email:'',
                phone:'',
                password:'',
                password_confirmation:'',
                setSelectedPageTemplate:''
            },
            {
                keepErrors: false,
                keepDirty: true,
                keepIsSubmitted: false,
                keepTouched: false,
                keepIsValid: false,
                keepSubmitCount: false,
            });
    }

    const password = useRef({});
    password.current = watch("password", "");
    // END form Data
    const handleChangeSelectTemplate = (e) => {
        setSelectedPageTemplate(e.target.value);
    };

    // get user Data

    // Edit User Data
    const createUser = (data) => {
        http.post(`user/register`, {
            ...data,
            role_id:selectedPageTemplate,
            status:pageStatus === true?1:2,
        }).then((response)=>{
            if(response.status === 200){
                setAddSuccess((Math.random() + 1).toString(36).substring(7))
                alerts.success('წარმატებით დარეგისტრირდა!')
                resets()
            }
        }).catch(err=>{
            console.log(err.response)
            errorAlerts(err.response.status,err.response.statusText,err.response.data)
        });
    }
    const configOption = () => {
        http.get(`users/options`).then((response)=>{
            if(response.status === 200){
                setOptions({roles: response.data.data.roles})
            }
        }).catch(err=>{
            console.log(err.response)
            errorAlerts(err.response.status,err.response.statusText,err.response.data)
        });
    }

    // use Effect  Load Page
    useEffect(()=>{

        configOption()
    },[addSuccess])

    const formTranslateData = {
        passwordNotMach:'პაროლი არ ემთხვევა',
        incorecct:'არ ემთხვევა',
        isRequired:'ველი აუცილებელია',
        numberMin9:'მინიმალური სიმბოლო არის 8',
        passwordMust:'პაროლის მითითება აუცილებელია',
    }


    return <>
        <div className="col-md-12 col-xl-12 bg-w p-4">
            <div className="card ">
                <div className="card-header lite-background">
                    <div className="row justify-content-end align-items-center">
                        <div className="col-xl-6 col-sm-6 text-left text-sm-center d-flex" >
                            <h5 className="card-title mb-0 p-2">
                                <i className="fa fa-address-book" aria-hidden="true"></i> თანამშრომლები
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
                <div className="card-body">
                    <form className="row " onSubmit={handleSubmit(createUser)}>
                        {/*1 Section*/}
                        <div className="col-xl-8 col-md-8 col-sm-12 ">
                            <div className="mb-3 col-md-12">
                                <label htmlFor="name" className='pb-2 font_form_title font-weight-bold'>'სახელი და გვარი</label>
                                <input type="text" className="form-control form-control-lg font_form_text" id="name"
                                       // defaultValue={userEditData.username}
                                       {...register('name', {required:formTranslateData.isRequired,
                                           minLength: {
                                               value: 1,
                                               message: formTranslateData.incorecct
                                           }
                                       }) }
                                />
                                {errors.name && <div className='text-danger font_form_text' >{errors.name.message}</div>}
                            </div>
                            <div className="form-group mb-3">
                                <label className='pb-2 font_form_title font-weight-bold'>ელ-ფოსტა</label>
                                <input className="form-control form-control-lg text_font" type="email"
                                       name="email" placeholder={'შეიყვანეთ ელ-ფოსტა'}
                                       // defaultValue={userEditData.email}
                                       {...register('email', {
                                           required:formTranslateData.isRequired,
                                           pattern: /^\S+@\S+$/i,
                                       })}
                                />
                                <small>
                                    {errors.email && <div className='text-danger font_form_text' >{errors.email.message}</div>}
                                </small>
                            </div>
                            <div className="mb-3 col-md-12">
                                <label htmlFor='phone' className='pb-2 font_form_title font-weight-bold'>ტელეფონი</label>
                                <input type="text" className="form-control form-control-lg font_form_text" id="phone"
                                       {...register('phone', {
                                           value:getValues('phone'),
                                           required:formTranslateData.isRequired,
                                           minLength: {
                                               value:9,
                                               message:formTranslateData.numberMin9
                                           },
                                           maxLength: 15,
                                           pattern:{
                                               // value:/\d+/,
                                               value: /^0|[1-9]\d*$/
                                           }
                                       })}
                                />
                                {errors.phone && <div className='text-danger font_form_text' >{errors.phone.message}</div>}
                            </div>


                            <div className="form-group mb-3">
                                <label className='pb-2 font_form_title font-weight-bold'> პაროლი</label>
                                <input placeholder={' პაროლი'} className="form-control form-control-lg text_font" type="password"
                                       {...register('password', {
                                           minLength: {
                                               value: 8,
                                               message: formTranslateData.passwordMust
                                           }
                                       })}
                                />
                                <small>
                                    {errors.password && <div className='text-danger font_form_text' >{errors.password.message}</div>}
                                </small>
                            </div>
                            <div className="form-group mb-3">
                                <label className='pb-2 font_form_title font-weight-bold'>დაადასტურე პაროლი</label>
                                <input autoComplete="off"  placeholder='დაადასტურე პაროლი' className="form-control form-control-lg text_font" type="password"
                                       {...register('password_confirmation', {
                                           minLength: {
                                               value: 8,
                                               message: formTranslateData.passwordMust
                                           },
                                           validate: value => value === password.current ||  formTranslateData.passwordNotMach
                                       })}/>
                                <small>
                                    {errors.password_confirmation && <p className='' style={{color:"red"}}>{errors.password_confirmation.message}</p>}
                                </small>
                            </div>
                            <div className="form-group mb-3 text-start">
                                <button type="submit" className="form-control form-control-lg btn btn-primary rounded submit  font_form_title font-weight-bold  w-25 "  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                         className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                                        <path fillRule="evenodd"
                                              d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                                        <path
                                            d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                                    </svg>
                                    <span className='mt-2'> განახლება</span></button>
                            </div>
                        </div>
                        <div className="col-md-4 col-xl-4 col-sm-12 bg-w my-left-side-toolbar">
                            <div className="mb-3">
                                <label htmlFor="page_template " className='pb-2 font_form_title font-weight-bold'>აირჩიეთ
                                    პოზიცია</label>
                                <FormControl sx={{width: '100%', padding: '0.2px'}} size="small">
                                    <InputLabel id="demo-simple-select-autowidth-label">აირჩიეთ პოზიცია</InputLabel>
                                    <Select
                                        required
                                        labelId="demo-simple-select-autowidth-label"
                                        id="page_template"
                                        value={selectedPageTemplate}
                                        onChange={handleChangeSelectTemplate}
                                        label="Category"

                                    >
                                        {options.roles && options.roles.map((item, index) => {
                                            return <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="mb-3">
                                <div className='input-style-border-switch'>
                                    <Switch id="toAction" checked={pageStatus}
                                            onChange={(e) => setPageStatus(e.target.checked)}/>
                                    <label htmlFor="toAction" className='pb-2 font_form_title'>Status</label>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
}