import { useState, useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Switch from '@mui/material/Switch';
import toast from 'react-hot-toast';
import Countries from '../language/langs/country.json';
import useHttp from '../store/hooks/http/useHttp';
import Swal from "sweetalert2";
import Draggable from 'react-draggable';
import { deleteAlert } from "../store/hooks/global/useAlert";
import { Context } from "../store/context/context";

const CreateLang = () => {
    let http = useHttp();
    let { dispatch } = useContext(Context);
    const [langDefaultSwitch, setLangDefaultSwitch] = useState(false);
    const [langStatusSwitch, setLangStatusSwitch] = useState(false);
    const [chooseLang, setChooseLang] = useState(true);
    const [langData, setLangData] = useState([]);

    // Language Status Update
    const handleChangeSwitchLangStatus = (event) => {
        http.put(`lang/update_status/${event.target.value}`, {
            status: event.target.checked
        }).then((response) => {
            if (response.status === 200) {
                setLangStatusSwitch({
                    ...langStatusSwitch,
                    [event.target.name]: event.target.checked,
                });
                toast.success(`ენის აქტივაციის სტატუსი შეიცვლა`);
            }
        }).catch(err => {
            console.log(err.response)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'მოხდა შეცდომა, ობიექტი არ დაემატა!',
                footer: `<strong>Status Code:</strong> <span style="color:red;"> ${err.response.status} </span>&nbsp;&nbsp;<strong>Message:</strong>&nbsp;<span style="color:red;"> ${err.response.statusText}</span>`
            })
        });
    };

    // Default lang select update
    const handleChangeSwitchLangDefault = (event) => {
        http.put(`lang/update_default/${event.target.value}`, {
            default: event.target.checked
        }).then((response) => {
            if (response.status === 200) {
                setLangDefaultSwitch({
                    ...langDefaultSwitch,
                    [event.target.name]: event.target.checked,
                });
                toast.success(`მთავარი ენის ცვლილება განხორციელდა`);
            }
        }).catch(err => {
            console.log(err.response)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'მოხდა შეცდომა, ობიექტი არ დაემატა!',
                footer: `<strong>Status Code:</strong> <span style="color:red;"> ${err.response.status} </span>&nbsp;&nbsp;<strong>Message:</strong>&nbsp;<span style="color:red;"> ${err.response.statusText}</span>`
            })
        });
    };

    const handleChangeSelectCountry = (event, newValue) => {
        setChooseLang(newValue)
    };

    const addLanguage = () => {
        const ifIsSetCountry = langData.filter(item => item.code === chooseLang.code)
        if (ifIsSetCountry.length === 0) {
            http.post("languages", {
                label: chooseLang.label,
                code: chooseLang.code,
                default: 0,
                status: 0,
            }).then((response) => {
                if (response.status === 200) {
                    setLangData([{
                        id: response.data.id,
                        code: chooseLang.code,
                        label: chooseLang.label,
                        default: response.data.default,
                    }, ...langData])
                    toast.success(`${chooseLang.label} ენა წარმატებით დაემატა`)
                }
            }).catch(err => {
                console.log(err.response)
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'მოხდა შეცდომა, ობიექტი არ დაემატა!',
                    footer: `<strong>Status Code:</strong> <span style="color:red;"> ${err.response.status} </span>&nbsp;&nbsp;<strong>Message:</strong>&nbsp;<span style="color:red;"> ${err.response.statusText}</span>`
                })
            });
        } else {
            toast.error(`${chooseLang.label} უკვე დამატებულია!`)
        }
    }

    const getLangs = () => {
        http.get('languages').then((response) => {
            setLangData(response.data.data)
            dispatch({ type: 'FORM_LANG', payload: response.data });
            // find default language
            let findDefaultLang = response.data.data.filter(item => item.default === 1);
            dispatch({ type: "FORM_ACTIVE_LANG", payload: { activeLangId: findDefaultLang[0].id, code: findDefaultLang[0].code, label: findDefaultLang[0].label } })
        })
    }

    const deleteLang = (id) => {
        http.delete(`lang/delete/${id}`).then((response) => {
            console.log(response)
            if (response.status === 200) {
                setLangData(langData.filter(item => item.id != id))
            }
        }).catch(err => {
            console.log(err.response)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'მოხდა შეცდომა, ობიექტი არ დაემატა!',
                footer: `<strong>Status Code:</strong> <span style="color:red;"> ${err.response.status} </span>&nbsp;&nbsp;<strong>Message:</strong>&nbsp;<span style="color:red;"> ${err.response.statusText}</span>`
            })
        });
    }

    const drop = e => {
        e.preventDefault();
        const card_id = e.dataTransfer.getData('id_card');
        const card = document.getElementById(card_id);
    }

    const dragOver = e => {
        e.preventDefault();
    }

    const allSelectLang = () => {
        return langData.map((lang, index) => {
            return (
                <tr id={index} key={index} draggable={true} onDrop={drop} onDragOver={dragOver}>
                    <td>
                        <Box component="span" sx={{ '& > img': { mr: 2, flexShrink: 0 } }}>
                            <img
                                loading="lazy"
                                width="20"
                                src={`https://flagcdn.com/w20/${lang.code.toLowerCase() === 'ka' ? 'ge' : lang.code.toLowerCase()}.png`}
                                srcSet={`https://flagcdn.com/w40/${lang.code.toLowerCase() === 'ka' ? 'ge' : lang.code.toLowerCase()}.png 2x`}
                                alt=""
                            />
                        </Box>
                        {lang.label}
                    </td>
                    <td>{lang.code}</td>
                    <td className="d-none d-md-table-cell">
                        <Switch
                            defaultChecked={lang.status === 1 ? true : false}
                            onChange={handleChangeSwitchLangStatus}
                            name={lang.code}
                            key={lang.id}
                            value={lang.id}
                            size="small"
                        />
                    </td>
                    <td className="d-none d-md-table-cell">
                        <Switch
                            defaultChecked={lang.default === 1 ? true : false}
                            onChange={handleChangeSwitchLangDefault}
                            name='default'
                            value={lang.id}
                            size="small"
                            key={lang.id}
                        />
                    </td>
                    <td className="table-action">
                        {lang.default === 1 || lang.status === 1 || langData.length <= 1 ? <i className="align-middle fas fa-fw fa-exclamation-circle" style={{ color: "orange" }}></i> : <a href='javascript:;' onClick={() => deleteAlert(lang.id, deleteLang)} ><i className="align-middle fas fa-fw fa-trash"></i></a>}
                    </td>
                </tr>
            )
        })
    }

    useEffect(() => {
        getLangs()
    }, [langDefaultSwitch, langStatusSwitch])

    return (
        <>
            <div className="header">
                <h1 className="header-title">
                    ენა
                </h1>
                <p className="header-subtitle">ენის შეცვლა და დამატება</p>
            </div>
            <div className="row">
                <div className="col-md-6 col-xl-6 ">
                    <div className="card p-4 ">
                        <Autocomplete
                            id="country-select-demo"
                            sx={{ width: '100% ' }}
                            options={Countries}
                            onChange={handleChangeSelectCountry}
                            autoHighlight
                            getOptionLabel={(option) => option.label}
                            renderOption={(props, option) => (
                                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                    <img
                                        loading="lazy"
                                        width="20"
                                        src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                        srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                                        alt=""
                                    />
                                    {option.label} ({option.code}) +{option.phone}
                                </Box>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Choose a country"
                                    inputProps={{
                                        ...params.inputProps,
                                        autoComplete: 'new-password',
                                    }}
                                />
                            )}
                        />
                        <div className='pt-4'>
                            <button onClick={() => addLanguage()} disabled={chooseLang === true ? true : false} className="btn mb-1 btn-primary">შენახვა <i className="fas fa-save"></i> </button>
                        </div>
                    </div>
                </div>
                {/* Left SideBar*/}
                <div className="col-md-6 col-xl-6">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title">დამატებული ენები</h5>
                            <h6 className="card-subtitle text-muted">
                                ამ დანართით შეგიძლიათ მონიშნოთ მთავარი ენა და წაშალოთ ნებისმიერი ენა
                            </h6>
                        </div>
                        <table className="table">
                            <thead>
                            <tr>
                                <th style={{ width: "40%" }}>   ენა    </th>
                                <th style={{ width: "20%" }}>კოდი</th>
                                <th className="d-none d-md-table-cell" style={{ width: "10%" }}>აქტიური</th>
                                <th className="d-none d-md-table-cell" style={{ width: "20%" }}>მთავარი</th>
                                <th style={{ width: "10%" }}>tools</th>
                            </tr>
                            </thead>
                            <tbody>
                            {allSelectLang()}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* End leftSidebar*/}
            </div>
        </>
    )
}
export default CreateLang;