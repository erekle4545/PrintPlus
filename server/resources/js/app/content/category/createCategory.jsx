import React, {useContext, useEffect, useState,useRef} from "react";
import {useAlert} from "react-alert";
import {Context} from "../../store/context/context";
import Box from "@mui/material/Box";
import {Link, useNavigate, useParams} from "react-router-dom";
import useHttp from "../../store/hooks/http/useHttp";
import { useForm } from 'react-hook-form';
//ui
import Switch  from '@mui/material/Switch';
// end ui
//start mix
import {checkTranslate, slugGenerate} from "../../store/hooks/useMix";
import { errorAlerts} from "../../store/hooks/global/useAlert";
import UseFormLang from "../../store/hooks/global/useFormLang";
import UseFileManager from "../../store/hooks/global/useFileManager";
import JoditEditor from "jodit-react";
import CircularProgress from "@mui/material/CircularProgress";
import UseButtonBar from "../../store/hooks/global/useButtonBar";
import UseAddedBar from "../../store/hooks/components/useAddedBar";

const CreateCategory = () => {
    // use Hooks
    let http = useHttp();
    let params = useParams();
    const alerts = useAlert()
    let navigate = useNavigate();
    let {state} = useContext(Context);
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
    const [pageErrors, setPageErrors] = useState(false);
    const [addSuccess, setAddSuccess] = useState(false);
    const [actionPageInMenu,setActionPageInMenu] = useState(true);
    const [updatedCovers, setUpdatedCovers] = useState([]);
    const [coverTypes, setCoverTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const {register,handleSubmit,setValue,formState: { errors },watch,reset } = useForm();
    const resets = ()=>{
        reset({
            title:'',
            slug:'',
            description:'',
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
    //Get Config Options
    const getPageConfig = () => {
        http.get('category/options').then((response)=>{
            if(response.status === 200){
                setCoverTypes(response.data.data.coverTypes)
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
        http.get(`category/${params.id}`).then((response)=>{
            console.log(response)
            if(response.status === 200){
                if(params.id){
                    setValue('title', response.data.data.title);
                    setValue('slug', response.data.data.slug);
                    setValue('keywords', response.data.data.keywords);
                    setText(response.data.data.description)

                    if(response.data.data.status === 1){
                        setPageStatus(true)
                    }else{
                        setPageStatus(false)
                    }

                    const coversData = response.data.data.covers
                    setUpdatedCovers(coversData)
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
        if(params.id){
            // update Page
            http.post('category/update/'+params.id,
                {
                    ...data,
                    status:pageStatus === true?1:2,
                    cover_id:Array.isArray(state.selected_covers)?state.selected_covers.map(item=>item.id):null,
                    cover_type:Array.isArray(state.selected_covers)?state.selected_covers.map(item=>item.coverType):null,
                    description:text,
                    data:'0'
                }
            ).then((response)=>{
                if(response.status === 200){
                    setAddSuccess(true)
                    alerts.success('Category Updated!')

                }
            }).catch(err=>{
                console.log(err.response)
                errorAlerts(err.response.status,err.response.statusText,err.response.data.errors)
            });
        }else{
            // create
            http.post('category',
                {
                    ...data,
                    status:pageStatus === true?1:2,
                    cover_id:Array.isArray(state.selected_covers)?state.selected_covers.map(item=>item.id):null,
                    cover_type:Array.isArray(state.selected_covers)?state.selected_covers.map(item=>item.coverType):null,
                    description:text,
                    data:'0'
                }
            ).then((response)=>{
                if(response.status === 200){
                    setAddSuccess(true)
                    alerts.success('Category Created!')
                    navigate(`/category/edit/`+response.data.id)
                }
            }).catch(err=>{
                console.log(err.response)
                errorAlerts(err.response.status,err.response.statusText,err.response.data.errors)
            });
        }
        // ...
    };

    // Page Load use Effect
    useEffect(()=>{
        getPageConfig()
        if(params.id){
            getEditData()
        }

    },[addSuccess,params.id])

    return(
        <>
            <div className="col-md-12 col-xl-12 bg-w p-4">
                <div className="">
                    <form className="row " onSubmit={handleSubmit(create)}>
                        <div className="col-md-9 col-xl-9" >
                            <div className="card">
                                <div className="card-header lite-background">
                                    <div className="row justify-content-between">
                                        <div className="col-md-4 ">
                                            <h5 className="card-title mb-0">
                                                {params.id?'რედაქტორება':'კატეგორიის დამატება'}
                                            </h5>
                                        </div>
                                        <div className="col-md-8 text-right">
                                            <div className="card-actions float-end">
                                                <ul className='nav lang'>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={"tab-pane "} style={{display:tabs.tab_1 === true?'block':'none'}}>
                                    {loading && params.id?<div className='text-center p-5'><CircularProgress /><p>Loading Data...</p></div>:<div className="card-body">
                                        {/*Start 2 Section*/}
                                        <div className='row'>
                                            {/*1 Section*/}
                                            <div className="col-8">
                                                <div className="mb-3 col-md-12">
                                                    <label htmlFor="inputFirstName"
                                                           className='pb-2 font_form_title font-weight-bold'>დასახელება</label>
                                                    <input type="text" className="form-control p-2 font_form_text"
                                                           id="inputFirstName"
                                                           onKeyUp={(e) => setValue('slug', slugGenerate(e.target.value))}
                                                           placeholder='დასახელება'
                                                        // value={params.id && pageData.info?pageData.info.title:null}
                                                           {...register('title', {
                                                               required: "დასახელების შეყვანა აუცილებელია",
                                                               minLength: {
                                                                   value: 1,
                                                                   message: "გთხოვთ სრულად შეიყვანეთ სახელი"
                                                               }
                                                           })}
                                                    />
                                                    {errors.title && <div className='form-error-messages-text font_form_text'>{errors.title.message}</div>}
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="inputEmail4"
                                                           className='pb-2 font_form_title font-weight-bold'>ბმული</label>
                                                    <input type="text" className="form-control p-2 font_form_text"
                                                           id="inputEmail4"
                                                           placeholder={'ბმული'}
                                                           {...register('slug', {
                                                               required: "ბმულის მითითება აუცილებელია",
                                                           })}
                                                    />
                                                    {errors.slug && <div className='form-error-messages-text font_form_text'>{errors.slug.message}</div>}
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="text"  className='pb-2 font_form_title font-weight-bold'>აღწერა</label>
                                                    <JoditEditor
                                                        ref={editor}
                                                        value={text}
                                                        config={config}
                                                        tabIndex={1} // tabIndex of textarea
                                                        onBlur={newContent => setText(newContent)} // preferred to use only this option to update the content for performance reasons
                                                        // onChange={(e)=>setText(e) }
                                                    />
                                                    {errors.text && <div  className='form-error-messages-text font_form_text'>{errors.text.message}</div>}
                                                </div>
                                            </div>
                                            {/*End first Section*/}
                                            {/* start Section tow*/}
                                            <div className="col-4">
                                                <div className="mb-3">
                                                    <UseFileManager coverTypes={coverTypes} updateData={updatedCovers}/>
                                                </div>
                                            </div>
                                            {/* END start Section tow*/}
                                        </div>
                                    </div>}
                                </div>
                                {/*Meta Tags */}

                                {/*End meta Tags */}
                            </div>
                        </div>
                        <div className="col-md-3 col-xl-3 bg-w my-left-side-toolbar" >
                            <div className="card  lite-background" >
                                <div className="card-header" style={{borderBottom:"1px dashed #a2a2a2"}}>
                                    <UseButtonBar/>
                                </div>
                                <div className="card-header" style={{borderBottom:"1px dashed #a2a2a2",background:'#fff'}}>
                                    <div className="row ">
                                        {/*<div className='col-6 text-center align-middle'>*/}
                                        {/*    <div className='input-style-border-switch page-statuses'>*/}
                                        {/*        <Switch id="toMenuSwitch" disabled={params.id&&true}   checked={actionPageInMenu} onChange={(e)=>setActionPageInMenu( e.target.checked) } />*/}
                                        {/*        <label htmlFor="toMenuSwitch" className='pb-2 font_form_title'>In Menu</label>*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                        <div className='col-6 text-center align-middle page-statuses'>
                                            <div className='input-style-border-switch'>
                                                <Switch id="toAction"  checked={pageStatus}  onChange={(e)=>setPageStatus( e.target.checked)} />
                                                <label htmlFor="toAction" className='pb-2 font_form_title'>STATUS</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*    Show added info */}
                            <div className="card mt-4" style={{background:"#f9f9f9"}}>
                                <UseAddedBar name={'category'} deleteUrl={'category/delete'} getUrl={'category/side'} />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
export default CreateCategory;