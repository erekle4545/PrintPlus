import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Context } from "../../store/context/context";
import Box from "@mui/material/Box";
import { Link, useNavigate, useParams } from "react-router-dom";
import useHttp from "../../store/hooks/http/useHttp";
import { useForm } from 'react-hook-form';
//ui
import Switch from '@mui/material/Switch';
// end ui
//start mix
import { checkTranslate, slugGenerate, translate } from "../../store/hooks/useMix";
import { deleteAlert, errorAlerts } from "../../store/hooks/global/useAlert";
import UseFormLang from "../../store/hooks/global/useFormLang";
import UseFileManager from "../../store/hooks/global/useFileManager";
import TipTapEditor from "../../components/TipTapEditor/TipTapEditor.jsx";
import UseAddedBar from "../../store/hooks/components/useAddedBar";
import CircularProgress from "@mui/material/CircularProgress";
import UseButtonBar from "../../store/hooks/global/useButtonBar";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const CreateCategory = () => {
    // use Hooks
    let http = useHttp();
    let params = useParams();
    let navigate = useNavigate();
    let { state } = useContext(Context);

    // Editor State
    const [text, setText] = useState('');

    const [tabs, setTabs] = useState({
        tab_1: true,
        tab_2: false
    });

    // form data
    const [pageStatus, setPageStatus] = useState(true);
    const [pageErrors, setPageErrors] = useState(false);
    const [addSuccess, setAddSuccess] = useState(false);
    const [selectedPage, setSelectedPage] = useState('');
    const [actionPageInMenu, setActionPageInMenu] = useState(true);
    const [pages, setPages] = useState([]);
    const [updatedCovers, setUpdatedCovers] = useState([]);
    const [coverTypes, setCoverTypes] = useState([]);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, setValue, formState: { errors }, watch, reset } = useForm();

    const resets = () => {
        reset({
            title: '',
            slug: '',
            description: '',
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
        http.get('options/category').then((response) => {
            if (response.status === 200) {
                setCoverTypes(response.data.data.coverTypes)
                setPages(response.data.data.pages)
            }
        }).catch(err => {
            console.log(err.response)
        })
        if (!params.id) {
            resets()
        }
    }

    // get edit Data
    const getEditData = () => {
        setLoading(true)
        http.get(`category/${params.id}`, {
            params: {
                language_id: state.form_active_lang.activeLangId ? state.form_active_lang.activeLangId : null
            }
        }).then((response) => {
            if (response.status === 200) {
                if (params.id) {
                    setPageErrors(response.data.data.info.language_id !== state.form_active_lang.activeLangId && true)
                    setValue('title', response.data.data.info.title);
                    setValue('slug', response.data.data.info.slug);
                    setSelectedPage(response.data.data.page_id);
                    setValue('keywords', response.data.data.info.keywords);
                    setText(response.data.data.info.description)

                    if (response.data.data.status === 1) {
                        setPageStatus(true)
                    } else {
                        setPageStatus(false)
                    }

                    const coversData = response.data.data.info.covers
                    setUpdatedCovers(coversData)
                }
            }
        }).catch(err => {
            console.log(err.response)
        }).finally(() => {
            setLoading(false)
        });
    }

    // create form
    const create = (data) => {
        if (params.id) {
            // update Page
            http.post('category/update/' + params.id,
                {
                    ...data,
                    language_id: state.form_active_lang.activeLangId ?? 1,
                    status: pageStatus === true ? 1 : 2,
                    assign_page: actionPageInMenu === true ? 1 : 0,
                    cover_id: Array.isArray(state.selected_covers) ? state.selected_covers.map(item => item.id) : null,
                    cover_type: Array.isArray(state.selected_covers) ? state.selected_covers.map(item => item.coverType) : null,
                    description: text,
                    page_id: selectedPage,
                    data: '0'
                }
            ).then((response) => {
                if (response.status === 200) {
                    setAddSuccess(true)
                    toast.success('Category Updated!')
                }
            }).catch(err => {
                console.log(err.response)
                errorAlerts(err.response.status, err.response.statusText, err.response.data.errors)
            });
        } else {
            // create
            http.post('category',
                {
                    ...data,
                    language_id: state.form_active_lang.activeLangId ?? 1,
                    status: pageStatus === true ? 1 : 2,
                    assign_page: actionPageInMenu === true ? 1 : 0,
                    page_id: selectedPage,
                    cover_id: Array.isArray(state.selected_covers) ? state.selected_covers.map(item => item.id) : null,
                    cover_type: Array.isArray(state.selected_covers) ? state.selected_covers.map(item => item.coverType) : null,
                    description: text,
                    data: '0'
                }
            ).then((response) => {
                if (response.status === 200) {
                    setAddSuccess(true)
                    toast.success('Category Created!')
                    navigate(`/category/edit/` + response.data.id)
                }
            }).catch(err => {
                console.log(err.response)
                errorAlerts(err.response.status, err.response.statusText, err.response.data.errors)
            });
        }
    };

    const handleChangeSelectPage = (e) => {
        setSelectedPage(e.target.value);
    };

    // Page Load use Effect
    useEffect(() => {
        getPageConfig()
        if (params.id) {
            getEditData()
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
                                        <div className="col-md-4 ">
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
                                                {params.id ? translate('editPage', state.lang.code) : translate('addCategory', state.lang.code)}
                                            </h5>
                                        </div>
                                        <div className="col-md-8 text-right">
                                            <div className="card-actions float-end">
                                                <ul className='nav lang'>
                                                    <UseFormLang leave={params.id || localStorage.getItem('sureAlert') === '1' ? null : true} />
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {checkTranslate(pageErrors, params.id, state.form_active_lang.label)}
                                <div className={"tab-pane "} style={{ display: tabs.tab_1 === true ? 'block' : 'none' }}>
                                    {loading && params.id ? <div className='text-center p-5'><CircularProgress /><p>Loading Data...</p></div> : <div className="card-body">
                                        {/*Start 2 Section*/}
                                        <div className='row'>
                                            {/*1 Section*/}
                                            <div className="col-8">
                                                <div className="mb-3 col-md-12">
                                                    <label htmlFor="inputFirstName"
                                                           className='pb-2 font_form_title font-weight-bold'>{translate('name', state.lang.code)}</label>
                                                    <input type="text" className="form-control p-2 font_form_text"
                                                           id="inputFirstName"
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
                                                    {errors.title && <div
                                                        className='form-error-messages-text font_form_text'>{errors.title.message}</div>}
                                                </div>

                                                <div className="mb-3">
                                                    <label htmlFor="inputEmail4"
                                                           className='pb-2 font_form_title font-weight-bold'>{translate('slug', state.lang.code)}</label>
                                                    <input type="text" className="form-control p-2 font_form_text"
                                                           id="inputEmail4"
                                                           placeholder={translate('slug', state.lang.code)}
                                                           {...register('slug', {
                                                               required: "ბმულის მითითება აუცილებელია",
                                                           })}
                                                    />
                                                    {errors.slug && <div
                                                        className='form-error-messages-text font_form_text'>{errors.slug.message}</div>}
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="text "
                                                           className='pb-2 font_form_title font-weight-bold'>{translate('text', state.lang.code)}</label>
                                                    <TipTapEditor
                                                        content={text}
                                                        onChange={setText}
                                                        placeholder={translate('text', state.lang.code)}
                                                    />
                                                    {errors.text && <div
                                                        className='form-error-messages-text font_form_text'>{errors.text.message}</div>}
                                                </div>
                                            </div>
                                            {/*End first Section*/}
                                            {/* start Section tow*/}
                                            <div className="col-4">
                                                <div className="mb-3">
                                                    <label htmlFor="page_template "
                                                           className='pb-2 font_form_title font-weight-bold'>აირჩიეთ
                                                        გვერდი </label>
                                                    <FormControl sx={{ width: '100%', padding: '0.2px' }} size="small">
                                                        <InputLabel
                                                            id="demo-simple-select-autowidth-label">კატეგორია</InputLabel>
                                                        <Select

                                                            labelId="demo-simple-select-autowidth-label"
                                                            id="page_template"
                                                            value={selectedPage}
                                                            onChange={handleChangeSelectPage}
                                                            label="Template"
                                                        >
                                                            {pages && pages.map((item, index) => {
                                                                return <MenuItem key={index}
                                                                                 value={item.id}>{item.info?.title}</MenuItem>
                                                            })}
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                                <div className="mb-3">
                                                    <UseFileManager coverTypes={coverTypes} updateData={updatedCovers} />
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
                            </div>
                            {/*    Show added info */}
                            <div className="card" style={{ background: "#f9f9f9" }}>
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