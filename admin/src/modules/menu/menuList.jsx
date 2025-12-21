import { useContext, useEffect, useState } from 'react';
import Nestable from 'react-nestable';
import Box from "@mui/material/Box";
import { checkTranslate, slugGenerate, translate } from "../../store/hooks/useMix";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Switch from "@mui/material/Switch";
import { useForm } from 'react-hook-form';
import { Context } from "../../store/context/context";
import useHttp from "../../store/hooks/http/useHttp";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import UseFormLang from "../../store/hooks/global/useFormLang";
import { deleteAlert, errorAlerts } from "../../store/hooks/global/useAlert";
import CircularProgress from "@mui/material/CircularProgress";

const MenuList = () => {
    let http = useHttp();
    let { state } = useContext(Context);
    let navigate = useNavigate();
    let params = useParams();

    // form languages
    const [actionIndividualUrl, setActionIndividualUrl] = useState(false);
    const [selectedPage, setSelectedPage] = useState(0);
    const [pageErrors, setPageErrors] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState(1);
    const [sortMenuData, setSortMenuData] = useState([]);
    const [menuListUpdateRefresh, setMenuListUpdateRefresh] = useState('');
    const [options, setOptions] = useState({
        pages: [],
        statuses: [],
        positions: []
    })
    const [loading, setLoading] = useState({
        menuSort: false
    });
    const [loadingContent, setLoadingContent] = useState(false)
    const [status, setStatus] = useState([]);
    const [createStatus, setCreateStatus] = useState(0);
    const [selectedConfigOptionStatus, setSelectedConfigOptionStatus] = useState(0);
    //End
    // form state
    const { register, handleSubmit, setValue, formState: { errors }, watch, reset } = useForm();
    const resets = () => {
        reset({
            title: "",
            slug: '',
        }, {
            keepErrors: false,
            keepDirty: true,
            keepIsSubmitted: false,
            keepTouched: false,
            keepIsValid: false,
            keepSubmitCount: false,
        });
    }
    const handleChangeSelectPage = (e, value) => {
        setSelectedPage(e.target.value);
    };

    const handleChangeSelectPosition = (e) => {
        setSelectedPosition(e.target.value);
    };
    const handleChangeSelectStatus = (e) => {
        setSelectedConfigOptionStatus(e.target.value);
    };
    // End form state
    // Menu widget draggable
    const renderItem = ({ item }) =>
        <div className='d-flex justify-content-between  text_font  align-items-center ' style={{ color: params.id == item.id ? 'darkseagreen' : null }}>
            <div className={'mb-0 align-items-center '}>{item.info ? item.info.title : 'არ არის ნათარგმნი'}

                <div className='text-danger small text_font small'>{item?.category_id ?'კატეგორია':'გვერდი'}</div>
            </div>
            <div className='d-flex'>
                <Link to={`/menu/edit/${item.id}`}>
                    <IconButton aria-label="edit" disabled={params.id == item.id ? 'disabled' : null} style={{ color: params.id == item.id ? 'darkseagreen' : null }} fontSize="small" size='small'>
                        <EditIcon />
                    </IconButton>
                </Link>
                <IconButton aria-label="delete" disabled={params.id == item.id ? 'disabled' : null} onClick={() => deleteAlert(item.id, deleteMenu)} className="delete" fontSize="small" size='small'>
                    <DeleteIcon />
                </IconButton>
            </div>
        </div>;
    // end menu widget
    // Option Configs
    const getOptions = () => {
        http.get('options/menu').then((response) => {
            if (response.status === 200) {
                setOptions({
                    pages: response.data.data.pages,
                    statuses: response.data.data.statuses,
                    positions: response.data.data.positions
                })

            }
            if (!params.id) {
                resets()
            }
        }).catch(err => {
            console.log(err.response)
        })
    }
    // End option Configs
    // Get Data for Sort Menu
    const getSortMenuData = () => {
        setLoading({ menuSort: true })
        http.get('menu', {
            params: {
                language_id: state.form_active_lang.activeLangId
            }
        }).then((response) => {
            if (response.status === 200) {
                setSortMenuData(response.data.data)
            }
        }).catch(err => {
            console.log(err.response)
        }).finally(() => {
            setLoading({ menuSort: false })
        });
    }
    // End sort Menu
    // get edit Data
    const getEditData = () => {
        setLoadingContent(true)
        http.get(`menu/${params.id}`, {
            params: {
                language_id: state.form_active_lang.activeLangId ? state.form_active_lang.activeLangId : null
            }
        }).then((response) => {
            if (response.status === 200) {
                if (params.id) {
                    setPageErrors(response.data.data.info.language_id !== state.form_active_lang.activeLangId && true)
                    setValue('title', response.data.data.info.title);
                    setValue('slug', response.data.data.info.slug);
                    setSelectedPosition(response.data.data.type)
                    setSelectedPage(response.data.data.page_id)

                    setSelectedConfigOptionStatus(response.data.data.active == 1 ? 1 : 0)
                    setActionIndividualUrl(response.data.data.meta.custom_link)
                }
            }
        }).catch(err => {
            console.log(err)
        }).finally(() => {
            setLoadingContent(false)
        });
    }
    /**
     * @param data
     */
        // form Create Data
    const create = (data) => {
            if (params.id) {
                // update menu
                http.post('menu/update/' + params.id,
                    {
                        ...data,
                        language_id: state.form_active_lang.activeLangId,
                        page_id: selectedPage,
                        active: selectedConfigOptionStatus.toString(),
                        dropdown: 1,
                        has_custom_link: actionIndividualUrl,
                        type: selectedPosition
                    }
                ).then((response) => {
                    setCreateStatus(2)
                    toast.success('Menu Updated!')
                    navigate(`/menu/edit/` + response.data.data.id)
                }).catch(err => {
                    console.log(err.response)
                    errorAlerts(err.response.status, err.response.statusText, err.response.data.errors)
                });

            } else {
                // Create Menu
                http.post('menu',
                    {
                        ...data,
                        language_id: state.form_active_lang.activeLangId,
                        page_id: selectedPage,
                        active: selectedConfigOptionStatus.toString(),
                        has_custom_link: actionIndividualUrl,
                        dropdown: 1,
                        type: selectedPosition
                    }
                ).then((response) => {
                    console.log(response)
                    toast.success('Menu Created!')
                    navigate(`/menu/edit/` + response.data.id)
                    setCreateStatus(1)
                }).catch(err => {
                    console.log(err.response)
                    errorAlerts(err.response.status, err.response.statusText, err.response.data.errors)
                });
            }
        };
    // End form Create data

    //delete
    const deleteMenu = (id) => {
        http.delete('menu/delete/' + id, {
            language_id: state.form_active_lang.activeLangId
        }).then((response) => {
            if (response.status === 200) {
                setSortMenuData(sortMenuData.filter(e => e.id !== id))
            }
        }).catch(err => {
            console.log(err.response)
            errorAlerts(err.response.status, err.response.statusText, err.response.data.errors)
        })
    }

    const menuSortUpdate = (e) => {
        http.post('menu/sort', {
            pages: e.items
        }).then((response) => {
            if (response.status === 200) {
                toast.success('Menu Position is Updated!')
                setMenuListUpdateRefresh(response.data.data.length)
            }
        }).catch(err => {
            console.log(err.response)
            errorAlerts(err.response.status, err.response.statusText, err.response.data.errors)
        })
    }

    useEffect(() => {
        getOptions()
        getSortMenuData()
        if (params.id) {
            getEditData()
        }
    }, [state.form_active_lang.activeLangId, createStatus, params.id, menuListUpdateRefresh, pageErrors])

    return (
        <>
            <div className="col-md-12 col-xl-12 bg-w">
                <form className="row " onSubmit={handleSubmit(create)}>
                    <div className="card p-4">
                        <div className="row">
                            <div className='col-xl-4 col-md-5 col-sm-7'>
                                <h4 className='text-left title_font'>მენიუს მართვა</h4>
                                {loading.menuSort ? <p className='text-center p-5'>მენიუ იტვირთება..</p> : <Nestable
                                    items={sortMenuData}
                                    renderItem={renderItem}
                                    onChange={menuSortUpdate}
                                />}
                            </div>
                            <div className='col-xl-8 col-md-7 col-sm-5'>
                                <h4 className='text-left title_font'>მენიუს დამატება</h4>
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
                                                    {translate('menu', state.lang.code)}
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
                                    {loadingContent ? <div className='text-center p-5'><CircularProgress /><p>Loading...</p></div> : <div className="card-body">
                                        {/*Start 2 Section*/}
                                        <div className='row'>
                                            {/*1 Section*/}
                                            <div className="col-xl-8 col-md-8 col-sm-12">
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
                                                <div className="mb-3 "
                                                      style={{display: actionIndividualUrl === true ? 'none' : 'block'}}>
                                                    <label htmlFor="combo-box"
                                                           className='pb-2 font_form_title font-weight-bold'>მენიუს
                                                        გვერდი</label>
                                                    <FormControl sx={{width: '100%', padding: '0.2px'}} size="small">
                                                        <InputLabel
                                                            id="pages">{translate('pageName', state.lang.label)}</InputLabel>
                                                        <Select
                                                            labelId="pages"
                                                            id="page"
                                                            value={params.id && selectedPage}
                                                            onChange={handleChangeSelectPage}
                                                            label="page"
                                                        >
                                                            {options.pages.map((item) => {
                                                                return <MenuItem key={item.id}
                                                                                 value={item.id}>{item.info.title}</MenuItem>
                                                            })}
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                            </div>
                                            <div className="col-xl-4  col-md-4 col-sm-12">
                                                <div className=" mb-3 ">
                                                    <label htmlFor="page_status" className='pb-2 font_form_title font-weight-bold'>სტატუსი</label>
                                                    <FormControl sx={{ width: '100%', padding: '0.2px' }} size="small">
                                                        <InputLabel id="demo-simple-select-autowidth-label">Status</InputLabel>
                                                        <Select
                                                            labelId="demo-simple-select-autowidth-label"
                                                            id="page_status"
                                                            value={selectedConfigOptionStatus}
                                                            onChange={handleChangeSelectStatus}
                                                            label="Status"
                                                        >
                                                            <MenuItem key={options.statuses.active} value={options.statuses.active}>Active</MenuItem>
                                                            <MenuItem key={options.statuses.inactive} value={options.statuses.inactive}>Inactive</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </div>

                                                <div className="mb-3">
                                                    <label htmlFor="menuSwitch" className='pb-2 font_form_title font-weight-bold'>მორგებული ბმული</label>
                                                    <div className='input-style-border-switch'>
                                                        <Switch id="menuSwitch" checked={actionIndividualUrl} onChange={(e) => setActionIndividualUrl(e.target.checked)} />
                                                    </div>
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="combo-box" className='pb-2 font_form_title font-weight-bold'>მენიუს განთავსება</label>
                                                    <FormControl sx={{ width: '100%', padding: '0.2px' }} size="small">
                                                        <InputLabel id="demo-simple-select-autowidth-label">Position</InputLabel>
                                                        <Select
                                                            labelId="demo-simple-select-autowidth-label"
                                                            id="page_template"
                                                            value={selectedPosition}
                                                            onChange={handleChangeSelectPosition}
                                                            label="Positions"
                                                        >
                                                            {options.positions.map((item) => {
                                                                return <MenuItem key={item.id} value={item.id}>{item.description}</MenuItem>
                                                            })}
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                            </div>
                                            {/* END start Section tow*/}
                                        </div>
                                        {/*End 2 section*/}
                                        <Button type="submit" color={'secondary'} variant="contained" className=" button_font"> <i className="align-middle fas fa-fw fa-save"></i>{translate('saveButton')}</Button>
                                    </div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default MenuList;