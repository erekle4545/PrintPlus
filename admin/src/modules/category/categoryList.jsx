import React, { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { translate } from "../../store/hooks/useMix";
import { Context } from "../../store/context/context";
import useHttp from "../../store/hooks/http/useHttp";
import IconButton from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import { Link, useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { deleteAlert, errorAlerts } from "../../store/hooks/global/useAlert";
import UseFormLang from "../../store/hooks/global/useFormLang";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Pagination from '@mui/material/Pagination';
import { RouteLinks } from "../../store/hooks/useRouteLinks";
import CircularProgress from "@mui/material/CircularProgress";

const CategoryList = () => {
    const { state } = useContext(Context);
    const http = useHttp();
    const navigate = useNavigate();
    const FileEndpoint = import.meta.env.VITE_FILE_URL;

    const [data, setData] = useState([]);
    const [selectedConfigOptionStatus, setSelectedConfigOptionStatus] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [pagination, setPagination] = useState({});
    const [checkbox, setCheckbox] = useState([]);
    const [postPagination, setPostPagination] = useState(1);
    const [options, setOptions] = useState({
        statuses: {}
    });
    const [loading, setLoading] = useState(false);

    const getData = async () => {
        setLoading(true);
        try {
            const response = await http.get(`category?page=${postPagination}`, {
                params: {
                    language_id: state.form_active_lang.activeLangId,
                    keyword: searchKeyword || null,
                    status: selectedConfigOptionStatus || null
                }
            });

            if (response.status === 200) {
                setData(response.data.data);
                setPagination(response.data);
            }
        } catch (err) {
            console.error(err.response);
        } finally {
            setLoading(false);
        }
    };

    const getOptions = async () => {
        try {
            const response = await http.get('options/category');
            if (response.status === 200) {
                setOptions({
                    templates: response.data.data.templates,
                    statuses: response.data.data.statuses
                });
            }
        } catch (err) {
            console.error(err.response);
            errorAlerts(err.response.status, err.response.statusText, err.response.data.errors);
        }
    };

    const deleteRow = async (id) => {
        try {
            const response = await http.delete('category/delete/' + id);
            if (response.status === 200) {
                setData(data.filter(e => e.id !== id));
            }
        } catch (err) {
            console.error(err.response);
            errorAlerts(err.response.status, err.response.statusText, err.response.data.errors);
        }
    };

    const handleChangeSelectStatus = (e) => {
        setSelectedConfigOptionStatus(e.target.value);
    };

    const handleChangeSearch = (e) => {
        setSearchKeyword(e.target.value);
    };

    const clear = () => {
        setSearchKeyword('');
        setSelectedConfigOptionStatus(null);
    };

    const handleChangePagination = (e, value) => {
        setPostPagination(value);
    };

    const checkedDelete = (e) => {
        const value = e.target.value;
        setCheckbox(prev =>
            e.target.checked
                ? [...prev, value]
                : prev.filter(item => item !== value)
        );
    };

    const renderFlagImage = (code) => {
        const countryCode = code === 'KA' ? 'ge' : code?.toLowerCase() || 'ge';
        return (
            <Box component="span" sx={{ '& > img': { mr: 2, flexShrink: 0 } }}>
                <img
                    loading="lazy"
                    width="20"
                    src={`https://flagcdn.com/w20/${countryCode}.png`}
                    srcSet={`https://flagcdn.com/w40/${countryCode}.png 2x`}
                    alt=""
                />
            </Box>
        );
    };
    const tableRow = () => {
        return data.map((item, index) => {
            const addedTime = new Date(item.created_at);

            return (
                <tr key={item.id} className='text_font'>
                    <th scope="row" className='text-center align-items-center'>{item.id}</th>
                    <td>
                        {item.info?.covers && (
                            <img
                                height='100'
                                src={`${FileEndpoint}/${item.info.covers[0]?.output_path}`}
                                alt={item.info.title}
                            />
                        )}
                    </td>
                    <td>
                        {item.info?.title || 'მონიშნულ ენაზე არ არის ნათარგმნი'}
                    </td>
                    <td>
                        {renderFlagImage(state.form_active_lang.code)}
                        {state.form_active_lang.label}
                    </td>
                    <td>{addedTime.toDateString()}</td>
                    <td>
                        <div className='d-flex justify-content-end align-items-center'>
                            <input
                                style={{ marginRight: '1rem' }}
                                onChange={checkedDelete}
                                value={item.id}
                                type='checkbox'
                                checked={checkbox.includes(String(item.id))}
                            />
                            {item.info ? (
                                <Link to={`/category/edit/${item.id}`}>
                                    <IconButton variant="extended" color='success' aria-label="რედაქტირება">
                                        <EditIcon />
                                    </IconButton>
                                </Link>
                            ) : (
                                <Link to={`/category/edit/${item.id}`}>
                                    <IconButton variant="contained" color='primary' aria-label="თარგმნა">
                                        <AddIcon />თარგმნა
                                    </IconButton>
                                </Link>
                            )}
                            <IconButton
                                variant="extended"
                                onClick={() => deleteAlert(item.id, deleteRow)}
                                color='error'
                                aria-label="წაშლა"
                            >
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    </td>
                </tr>
            );
        });
    };

    useEffect(() => {
        getData();
    }, [state.form_active_lang.activeLangId, selectedConfigOptionStatus, searchKeyword, postPagination]);

    useEffect(() => {
        getOptions();
    }, []);

    return (
        <div className="col-md-12 col-xl-12 bg-w">
            <div className="card">
                <div className="card-header lite-background">
                    <div className="row justify-content-between align-items-center">
                        <div className="col-xl-6 col-sm-6 text-left d-flex align-items-center">
                            <IconButton
                                onClick={() => navigate('/' + RouteLinks.createCategory)}
                                color='primary'
                                className='text_font'
                                variant="contained"
                            >
                                <AddIcon />
                            </IconButton>
                            <h5 className="card-title mb-0 p-2 d-flex align-items-center">
                                {renderFlagImage(state.form_active_lang.code)}
                                {translate('allCategory', state.lang.code)}
                            </h5>
                        </div>
                        <div className="col-xl-6 col-sm-6 text-right">
                            <div className="card-actions float-end">
                                <ul className='nav lang'>
                                    <UseFormLang leave={null} />
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="tools-choose-config">
                    <div className="col-xl-8 col-sm-12 p-1">
                        <label htmlFor="search-field" className='pb-2 font_form_title font-weight-bold'>
                            ძებნა
                        </label>
                        <TextField
                            fullWidth
                            onChange={handleChangeSearch}
                            value={searchKeyword}
                            label="ძებნა"
                            size='small'
                            id="search-field"
                        />
                    </div>
                    <div className="col-xl-2 col-sm-12 p-1">
                        <label htmlFor="page_status" className='pb-2 font_form_title font-weight-bold'>
                            სტატუსი
                        </label>
                        <FormControl sx={{ width: '100%', padding: '0.2px' }} size="small">
                            <InputLabel id="status-select-label">Status</InputLabel>
                            <Select
                                labelId="status-select-label"
                                id="page_status"
                                value={selectedConfigOptionStatus || ''}
                                onChange={handleChangeSelectStatus}
                                label="Status"
                            >
                                <MenuItem value={options.statuses.active}>Active</MenuItem>
                                <MenuItem value={options.statuses.inactive}>Inactive</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className="col-xl-2 col-sm-12 text-center p-1">
                        <label className='pb-2 font_form_title font-weight-bold d-block'>
                            გასუფთავება
                        </label>
                        <IconButton onClick={clear} color='secondary' variant="contained">
                            <ClearIcon />Clear
                        </IconButton>
                    </div>
                </div>

                {loading ? (
                    <div className='text-center p-5'>
                        <CircularProgress />
                        <p>Loading Data...</p>
                    </div>
                ) : (
                    <div>
                        {data.length > 0 ? (
                            <>
                                <table className="table table-striped">
                                    <thead>
                                    <tr className='title_font'>
                                        <th scope="col" className='text-center'># ID</th>
                                        <th scope="col">ფოტო</th>
                                        <th scope="col">სახელი</th>
                                        <th scope="col">ენა</th>
                                        <th scope="col">დამატების დრო</th>
                                        <th scope="col" className='text-end'>
                                            <IconButton
                                                variant="extended"
                                                onClick={() => deleteAlert(checkbox, deleteRow)}
                                                color='error'
                                                aria-label="წაშლა"
                                                disabled={checkbox.length === 0}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {tableRow()}
                                    </tbody>
                                </table>
                                <div className='col-12 p-4 d-flex justify-content-end'>
                                    <Pagination
                                        count={pagination.last_page}
                                        page={postPagination}
                                        onChange={handleChangePagination}
                                        color="primary"
                                    />
                                </div>
                            </>
                        ) : (
                            <h6 className='text-center text_font p-5'>ჩანაწერები არ არის...</h6>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryList;