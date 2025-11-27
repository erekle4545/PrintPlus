import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Context } from "../../../store/context/context";
import Box from "@mui/material/Box";
import TipTapEditor from "../../../components/TipTapEditor/TipTapEditor.jsx";
import { Link, useNavigate, useParams } from "react-router-dom";
import useHttp from "../../../store/hooks/http/useHttp";
import { get, useForm } from 'react-hook-form';
//ui
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// end ui
//start mix my hooks
import { checkTranslate, slugGenerate, translate } from "../../../store/hooks/useMix";
import { deleteAlert, errorAlerts } from "../../../store/hooks/global/useAlert";
import UseFormLang from "../../../store/hooks/global/useFormLang";
import CircularProgress from "@mui/material/CircularProgress";
import MediaList from "../../media/mediaList";
import UseFileManager from "../../../store/hooks/global/useFileManager";
import UseAddedBar from "../../../store/hooks/components/useAddedBar";
import UseButtonBar from "../../../store/hooks/global/useButtonBar";
import TextField from "@mui/material/TextField";

const CreateService = () => {
    let http = useHttp();
    let params = useParams();
    let navigate = useNavigate();
    let { state } = useContext(Context);

    // Editor State
    const [text, setText] = useState('');

    // states
    const [tabs, setTabs] = useState({
        tab_1: true,
        tab_2: false
    });
    const [pageTemplate, setPageTemplate] = useState([]);
    const [pageStatus, setPageStatus] = useState(true);
    const [pageErrors, setPageErrors] = useState(false);
    const [addSuccess, setAddSuccess] = useState('');
    const [selectedPageTemplate, setSelectedPageTemplate] = useState('');
    const [actionPageInMenu, setActionPageInMenu] = useState(true);
    const [showHomePage, setShowHomePage] = useState(false);
    const [updatedCovers, setUpdatedCovers] = useState([]);
    const [coverTypes, setCoverTypes] = useState([]);

    // loadings
    const [loading, setLoading] = useState({
        sidebarList: false,
        save: false,
        editData: false
    });
    // END states

    // Selected template
    const handleChangeSelectTemplate = (e) => {
        setSelectedPageTemplate(e.target.value);
    };

    // form Data
    const { register, handleSubmit, setValue, getValues, formState: { errors }, watch, reset } = useForm();
    const resets = () => {
        reset({
            title: '',
            slug: '',
            description: '',
            created_at: ''
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
    // END form Data

    //Get Config Options
    const getPageConfig = () => {
        http.get('options/service').then((response) => {
            if (response.status === 200) {
                setPageTemplate(response.data.data.categories)
                setCoverTypes(response.data.data.coverTypes)
            }
        }).catch(err => {
            console.log(err.response);
        });
        if (!params.id) {
            resets()
        }
    }

    // get edit Data
    const getEditData = () => {
        setLoading({
            sidebarList: false,
            save: false,
            editData: true
        })
        http.get(`service/${params.id}`, {
            params: {
                language_id: state.form_active_lang.activeLangId ? state.form_active_lang.activeLangId : null
            }
        }).then((response) => {
            if (response.status === 200) {
                if (params.id) {
                    setValue('title', response.data.data.info.title);
                    setValue('slug', response.data.data.info.slug);
                    setValue('keywords', response.data.data.info.keywords);
                    setValue('description', response.data.data.info.description);
                    setValue('created_at', new Date(response.data.data.created_at).toISOString().substring(0, 10));
                    setText(response.data.data.info.text)
                    setSelectedPageTemplate(response.data.data.category_id)
                    setPageErrors(response.data.data.info.language_id !== state.form_active_lang.activeLangId && true)

                    if (response.data.data.status === 1) {
                        setPageStatus(true)
                    } else {
                        setPageStatus(false)
                    }

                    if (response.data.data.show_home_page == 1) {
                        setShowHomePage(true)
                    } else {
                        setShowHomePage(false)
                    }

                    const coversData = response.data.data.info.covers
                    setUpdatedCovers(coversData)
                }
            }
        }).catch(err => {
            console.log(err.response)
        }).finally(() => {
            setLoading({
                sidebarList: false,
                save: false,
                editData: false
            })
        });
    }

    // create form
    const create = (data) => {
        if (params.id) {
            // update Page
            http.post('service/update/' + params.id,
                {
                    ...data,
                    language_id: state.form_active_lang.activeLangId ? state.form_active_lang.activeLangId : null,
                    category_id: selectedPageTemplate ?? '0',
                    status: pageStatus === true ? 1 : 2,
                    assign_page: actionPageInMenu === true ? 1 : 0,
                    cover_id: Array.isArray(state.selected_covers) ? state.selected_covers.map(item => item.id) : null,
                    cover_type: Array.isArray(state.selected_covers) ? state.selected_covers.map(item => item.coverType) : null,
                    show_home_page: showHomePage,
                    text: text,
                    type: 0
                }
            ).then((response) => {
                if (response.status === 200) {
                    setAddSuccess((Math.random() + 1).toString(36).substring(7))
                    toast.success('Service Updated!')
                }
            }).catch(err => {
                console.log(err.response)
                errorAlerts(err.response.status, err.response.statusText, err.response.data.errors)
            });
        } else {
            // create Page
            http.post('service',
                {
                    ...data,
                    language_id: state.form_active_lang.activeLangId ?? 1,
                    status: pageStatus === true ? 1 : 2,
                    assign_page: actionPageInMenu === true ? 1 : 0,
                    show_home_page: showHomePage,
                    text: text,
                    cover_id: Array.isArray(state.selected_covers) ? state.selected_covers.map(item => item.id) : null,
                    cover_type: Array.isArray(state.selected_covers) ? state.selected_covers.map(item => item.coverType) : null,
                    type: 0
                }
            ).then((response) => {
                if (response.status === 200) {
                    setAddSuccess((Math.random() + 1).toString(36).substring(7))
                    toast.success('Service Created!')
                    navigate(`/service/edit/` + response.data.id)
                }
            }).catch(err => {
                console.log(err.response)
                errorAlerts(err.response.status, err.response.statusText, err.response.data.errors)
            });
        }
    };

    // Page Load use Effect
    useEffect(() => {
        getPageConfig()
        if (params.id) {
            getEditData()
        } else {
            setSelectedPageTemplate(null)
        }
    }, [addSuccess, state.form_active_lang, params.id])

    return (
        <>
            <div className="col-md-12 col-xl-12 bg-w">
                <div className="">
                    <form className="row " onSubmit={handleSubmit(create)}>
                        <div className="col-md-9 col-xl-9">
                            <div className="card">
                                <div className="card-header lite-background">
                                    <div className="row justify-content-between">
                                        <div className="col-xl-4 col-sm-6 ">
                                            <h5 className="card-title mb-0">
                                                <Box component="span" sx={{ '& > img': { mr: 2, flexShrink: 0 } }}>
                                                    <img
                                                        loading="lazy"
                                                        width="20"
                                                        src={`https://flagcdn.com/w20/${state.form_active_lang.code && state.form_active_lang.code === 'KA' ? 'ge' : state.form_active_lang.code && state.form_active_lang.code.toLowerCase()}.png`}
                                                        srcSet={`https://flagcdn.com/w40/${state.form_active_lang.code && state.form_active_lang.code === 'KA' ? 'ge' : state.form_active_lang.code && state.form_active_lang.code.toLowerCase()}.png 2x`}
                                                        alt=""
                                                    />
                                                </Box>
                                                {params.id ? translate('editPage', state.lang.code) : translate('addPost', state.lang.code)}
                                            </h5>
                                        </div>
                                        <div className="col-xl-8 col-sm-6 text-right">
                                            <div className="card-actions float-end">
                                                <ul className='nav lang'>
                                                    <UseFormLang leave={params.id || localStorage.getItem('sureAlert') === '1' ? null : true} />
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {loading.editData && params.id ? <div className='text-center p-5'><CircularProgress /></div> : <div className={"tab-pane "} style={{ display: tabs.tab_1 === true ? 'block' : 'none' }}>
                                    {checkTranslate(pageErrors, params.id, state.form_active_lang.label)}
                                    <div className="card-body">
                                        {/*Start 2 Section*/}
                                        <div className='row'>
                                            {/*1 Section*/}
                                            <div className="col-xl-8 col-md-8 col-sm-12 ">
                                                <div className="mb-3 col-md-12">
                                                    <label htmlFor="inputFirstName" className='pb-2 font_form_title font-weight-bold'>{translate('name', state.lang.code)}</label>
                                                    <input type="text" className="form-control p-2 font_form_text" id="inputFirstName"
                                                           onKeyUp={(e) => setValue('slug', slugGenerate(e.target.value))}
                                                           placeholder={translate('name', state.lang.code)}
                                                           {...register('title', {
                                                               required: "სახელი შეყვანა აუცილებელია",
                                                               minLength: {
                                                                   value: 1,
                                                                   message: "გთხოვთ სრულად შეიყვანეთ სახელი"
                                                               }
                                                           })}
                                                    />
                                                    {errors.title && <div className='form-error-messages-text font_form_text'>{errors.title.message}</div>}
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="inputEmail4" className='pb-2 font_form_title font-weight-bold'>{translate('slug', state.lang.code)}</label>
                                                    <input type="text" className="form-control p-2 font_form_text" id="inputEmail4"
                                                           placeholder={translate('slug', state.lang.code)}
                                                           {...register('slug', {
                                                               required: "ბმულის მითითება აუცილებელია",
                                                           })}
                                                    />
                                                    {errors.slug && <div className='form-error-messages-text font_form_text'>{errors.slug.message}</div>}
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="inputAddress2 " className='pb-2 font_form_title font-weight-bold'>{translate('keywords', state.lang.code)}</label>
                                                    <input type="text" className="form-control p-2 font_form_text" id="inputAddress" placeholder={translate('keywords', state.lang.code)}
                                                           {...register('keyword', {})} />
                                                    {errors.keyword && <div className='form-error-messages-text font_form_text'>{errors.keyword.message}</div>}
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="inputAddress" className='pb-2 font_form_title font-weight-bold'>{translate('description', state.lang.code)}</label>
                                                    <textarea className="form-control p-2 font_form_text" id="inputAddress"
                                                              placeholder={translate('description', state.lang.code)}
                                                              {...register('description', {})}></textarea>
                                                    {errors.description && <div className='form-error-messages-text font_form_text'>{errors.description.message}</div>}
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="text " className='pb-2 font_form_title font-weight-bold'>{translate('text', state.lang.code)}</label>
                                                    <TipTapEditor
                                                        content={text}
                                                        onChange={setText}
                                                        placeholder={translate('text', state.lang.code)}
                                                    />
                                                    {errors.text && <div className='form-error-messages-text font_form_text'>{errors.text.message}</div>}
                                                </div>
                                            </div>
                                            {/*End first Section*/}
                                            {/* start Section tow*/}
                                            <div className="col-xl-4 col-md-4  col-sm-12">
                                                {/*Uploads*/}
                                                <div className="mb-3">
                                                    <UseFileManager coverTypes={coverTypes} updateData={updatedCovers} />
                                                </div>
                                                <div className="mb-3">
                                                    <TextField
                                                        {...register('created_at', {
                                                            required: "თარიღი",
                                                        })}
                                                        defaultValue={'7/12/2023'}
                                                        size='small'
                                                        id="date"
                                                        label="თარიღი"
                                                        type="date"
                                                        fullWidth={true}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                    {errors.created_at && <div className='form-error-messages-text font_form_text'>{errors.created_at.message}</div>}
                                                </div>
                                            </div>
                                            {/* END start Section tow*/}
                                        </div>
                                    </div>
                                </div>}
                                {/*Meta Tags */}
                                <div className={"tab-pane "} style={{ display: tabs.tab_2 === true ? 'block' : 'none' }}>
                                    <div className="card-body">
                                        <h5 className="card-title">Meta Tags</h5>
                                        <div className="mb-3">
                                            <label htmlFor="inputPasswordCurrent">OG: Url</label>
                                            <input type="text" className="form-control" id="inputPasswordCurrent" />
                                            <small> The canonical URL of your object that will be used as its permanent ID in the graph </small>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="inputPasswordNew">OG: type</label>
                                            <input type="text" className="form-control" id="inputPasswordNew" />
                                            <small> The type of your object, e.g., "video.movie". Depending on the type you specify, other properties may also be required.</small>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="inputPasswordNew2">OG: Title</label>
                                            <input type="text" className="form-control" id="inputPasswordNew2" />
                                            <small> The title of your object as it should appear within the graph </small>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="inputPasswordNew2">OG: Description</label>
                                            <input type="text" className="form-control" id="inputPasswordNew2" />
                                            <small> A one to two sentence description of your object </small>
                                        </div>
                                    </div>
                                </div>
                                {/*End meta Tags */}
                            </div>
                        </div>
                        <div className="col-md-3 col-xl-3 bg-w my-left-side-toolbar">
                            <div className="card  lite-background">
                                <div className="card-header" style={{ borderBottom: "1px dashed #a2a2a2" }}>
                                    <UseButtonBar />
                                </div>
                                <div className="card-header" style={{ borderBottom: "1px dashed #a2a2a2", background: '#fff' }}>
                                    <div className="row ">
                                        <div className='col-6 text-center align-middle'>
                                            <div className='input-style-border-switch page-statuses'>
                                                <Switch id="toMenuSwitch" disabled={params.id && true} checked={actionPageInMenu} onChange={(e) => setActionPageInMenu(e.target.checked)} />
                                                <label htmlFor="toMenuSwitch" className='pb-2 font_form_title'>In Menu</label>
                                            </div>
                                        </div>
                                        <div className='col-6 text-center align-middle page-statuses'>
                                            <div className='input-style-border-switch'>
                                                <Switch id="toAction" checked={pageStatus} onChange={(e) => setPageStatus(e.target.checked)} />
                                                <label htmlFor="toAction" className='pb-2 font_form_title'>Status</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="list-group list-group-flush bar-menu-f-size">
                                    <a role="button" className="list-group-item list-group-item-action active font_form_title font-weight-bold" onClick={() => setTabs({ tab_1: true, tab_2: false })} style={{ paddingLeft: "2rem", fontSize: 'small' }} data-bs-toggle="list">
                                        საწყისი
                                    </a>
                                    <a role="button" className="list-group-item list-group-item-action font_form_title font-weight-bold" onClick={() => setTabs({ tab_1: false, tab_2: true })} data-bs-toggle="list" style={{ paddingLeft: "2rem", fontSize: 'small' }}>
                                        SEO Meta Tags
                                    </a>
                                </div>
                            </div>

                            {/* Show added info */}
                            <div className="card" style={{ background: "#f9f9f9" }}>
                                <UseAddedBar name={'service'} deleteUrl={'service/delete'} getUrl={'service/side'} />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
export default CreateService;