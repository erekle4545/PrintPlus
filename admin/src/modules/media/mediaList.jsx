import { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import useHttp from "../../store/hooks/http/useHttp";
import UploadFiles from "./uploadFiles";
import { Context } from "../../store/context/context";
import { deleteAlert, errorAlerts } from "../../store/hooks/global/useAlert";
import IconButton from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import Pagination from "@mui/material/Pagination";
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import toast from "react-hot-toast";
import { FileEndpoint } from "@/common/envExtetions.js";

const MediaList = ({ isModal = false }) => {
    const { state, dispatch } = useContext(Context);
    const http = useHttp();

    const [files, setFiles] = useState([]);
    const [check, setCheck] = useState([]);
    const [extensions, setExtensions] = useState([]);
    const [deleteStatus, setDeleteStatus] = useState(0);
    const [pagination, setPagination] = useState({});
    const [postPagination, setPostPagination] = useState(1);
    const [loading, setLoading] = useState({ filesList: false, uploads: false });

    const [searchName, setSearchName] = useState('');
    const [searchUser, setSearchUser] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    const getFiles = useCallback(() => {
        setLoading({ filesList: true, uploads: false });
        http.get(`files?page=${postPagination}`, {
            params: {
                extensions: extensions,
                search_name: searchName || undefined,
                search_user: searchUser || undefined,
                date_from: dateFrom || undefined,
                date_to: dateTo || undefined,
                sort_by: sortBy,
            }
        }).then((response) => {
            if (response.status === 200) {
                setFiles(response.data.data);
                setPagination(response.data.meta);
            }
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            setLoading({ filesList: false, uploads: false });
        });
    }, [postPagination, extensions, searchName, searchUser, dateFrom, dateTo, sortBy]);

    const deleteRow = useCallback((id) => {
        http.delete('image/' + id).then(() => {
            setFiles(prev => prev.filter(e => e.id !== id));
            setDeleteStatus(prev => prev + 1);
        }).catch(err => {
            console.log(err.response);
            errorAlerts(err.response.status, err.response.statusText, err.response.data.errors);
        });
    }, []);

    const checkedDelete = useCallback((e) => {
        const value = e.target.value;
        if (e.target.checked) {
            setCheck(prev => {
                const updated = [...prev, value];
                dispatch({ type: 'CART', payload: updated });
                return updated;
            });
            toast.success('ფაილი მონიშნულია');
        } else {
            setCheck(prev => {
                const updated = prev.filter(item => item !== value);
                dispatch({ type: 'CART', payload: updated });
                return updated;
            });
            toast('ფაილი ამოღებულია', { icon: 'ℹ️' });
        }
    }, [dispatch]);

    const handleChangePagination = useCallback((e, value) => {
        setPostPagination(value);
    }, []);

    const chooseExtensions = useCallback((ext) => {
        setExtensions(prev =>
            prev.includes(ext) ? prev.filter(item => item !== ext) : [...prev, ext]
        );
        setPostPagination(1);
    }, []);

    const clearFilters = useCallback(() => {
        setSearchName('');
        setSearchUser('');
        setDateFrom('');
        setDateTo('');
        setSortBy('newest');
        setExtensions([]);
        setPostPagination(1);
    }, []);

    const hasActiveFilters = useMemo(() => {
        return searchName || searchUser || dateFrom || dateTo || sortBy !== 'newest' || extensions.length > 0;
    }, [searchName, searchUser, dateFrom, dateTo, sortBy, extensions]);

    useEffect(() => {
        const timer = setTimeout(() => {
            getFiles();
        }, 400);
        return () => clearTimeout(timer);
    }, [searchName, searchUser]);

    useEffect(() => {
        getFiles();
        setCheck([]);
        dispatch({ type: 'CART', payload: [] });
    }, [state.upload_status, deleteStatus, postPagination, extensions, dateFrom, dateTo, sortBy]);

    const getFilePreview = useCallback((item) => {
        const imageExts = ['jpg', 'png', 'jpeg', 'webp', 'gif', 'svg'];
        const videoExts = ['mp4', 'webm', 'avi', 'mov'];
        const docExts = ['pdf', 'doc', 'docx', 'xlsx', 'xls', 'csv'];
        const ext = item.extension?.toLowerCase();

        if (imageExts.includes(ext)) return FileEndpoint + '/' + item.output_path;
        if (videoExts.includes(ext)) return '/img/media/video_prev.png';
        if (docExts.includes(ext)) return '/img/media/doc.jpg';
        return FileEndpoint + '/' + item.output_path;
    }, []);

    const formatDate = useCallback((dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('ka-GE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    }, []);

    const extensionFilters = [
        { key: 'image', label: 'სურათები', color: '#4CAF50' },
        { key: 'video', label: 'ვიდეო', color: '#2196F3' },
        { key: 'docs', label: 'დოკუმენტები', color: '#FF9800' },
    ];

    return (
        <div
            className={`d-flex flex-column ${!isModal ? 'card shadow-sm' : ''}`}
            style={{
                height: isModal ? '100%' : 'auto',
                maxHeight: isModal ? '80vh' : 'none',
                borderRadius: !isModal ? 12 : 0,
                overflow: 'hidden',
                backgroundColor: '#fff',
            }}
        >
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 px-3 py-3 border-bottom bg-white"
                 style={{ flexShrink: 0 }}>
                <h3 className="title_font mb-0" style={{ fontSize: 20, fontWeight: 700, color: '#1a1a2e' }}>
                    მედია მენეჯერი
                </h3>
                <UploadFiles request={http} />
            </div>

            {/* Filters */}
            <div className="px-3 py-2 border-bottom" style={{ background: '#fafbfc', flexShrink: 0 }}>
                <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                    <TextField
                        size="small"
                        placeholder="ფაილის სახელი..."
                        value={searchName}
                        onChange={(e) => { setSearchName(e.target.value); setPostPagination(1); }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" style={{ color: '#999' }} />
                                </InputAdornment>
                            ),
                            className: 'text_font',
                        }}
                        sx={{ minWidth: 180, flex: 1, maxWidth: 220, '& .MuiOutlinedInput-root': { borderRadius: '8px', background: '#fff' } }}
                    />
                    <TextField
                        size="small"
                        placeholder="მომხმარებლის სახელი..."
                        value={searchUser}
                        onChange={(e) => { setSearchUser(e.target.value); setPostPagination(1); }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" style={{ color: '#999' }} />
                                </InputAdornment>
                            ),
                            className: 'text_font',
                        }}
                        sx={{ minWidth: 180, flex: 1, maxWidth: 220, '& .MuiOutlinedInput-root': { borderRadius: '8px', background: '#fff' } }}
                    />
                    <TextField
                        size="small"
                        type="date"
                        label="თარიღიდან"
                        value={dateFrom}
                        onChange={(e) => { setDateFrom(e.target.value); setPostPagination(1); }}
                        InputLabelProps={{ shrink: true, className: 'text_font' }}
                        InputProps={{ className: 'text_font' }}
                        sx={{ minWidth: 150, '& .MuiOutlinedInput-root': { borderRadius: '8px', background: '#fff' } }}
                    />
                    <TextField
                        size="small"
                        type="date"
                        label="თარიღამდე"
                        value={dateTo}
                        onChange={(e) => { setDateTo(e.target.value); setPostPagination(1); }}
                        InputLabelProps={{ shrink: true, className: 'text_font' }}
                        InputProps={{ className: 'text_font' }}
                        sx={{ minWidth: 150, '& .MuiOutlinedInput-root': { borderRadius: '8px', background: '#fff' } }}
                    />
                    <FormControl size="small" sx={{ minWidth: 130 }}>
                        <InputLabel className="text_font">სორტირება</InputLabel>
                        <Select
                            value={sortBy}
                            label="სორტირება"
                            onChange={(e) => { setSortBy(e.target.value); setPostPagination(1); }}
                            className="text_font"
                            sx={{ borderRadius: '8px', background: '#fff' }}
                        >
                            <MenuItem className="text_font" value="newest">უახლესი</MenuItem>
                            <MenuItem className="text_font" value="oldest">უძველესი</MenuItem>
                            <MenuItem className="text_font" value="name_asc">სახელი (ა-ჰ)</MenuItem>
                            <MenuItem className="text_font" value="name_desc">სახელი (ჰ-ა)</MenuItem>
                        </Select>
                    </FormControl>
                    {hasActiveFilters && (
                        <Tooltip title="ფილტრების გასუფთავება">
                            <IconButton
                                size="small"
                                onClick={clearFilters}
                                variant="outlined"
                                color="inherit"
                                sx={{ borderRadius: '8px', minWidth: 'auto', px: 1.5 }}
                            >
                                <ClearIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                </div>

                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div className="d-flex gap-2 flex-wrap">
                        {extensionFilters.map(ext => (
                            <Chip
                                key={ext.key}
                                label={<span className="text_font">{ext.label}</span>}
                                onClick={() => chooseExtensions(ext.key)}
                                variant={extensions.includes(ext.key) ? 'filled' : 'outlined'}
                                sx={{
                                    borderColor: ext.color,
                                    color: extensions.includes(ext.key) ? '#fff' : ext.color,
                                    backgroundColor: extensions.includes(ext.key) ? ext.color : 'transparent',
                                    fontWeight: 600,
                                    fontSize: 13,
                                    '&:hover': {
                                        backgroundColor: extensions.includes(ext.key) ? ext.color : `${ext.color}15`,
                                    },
                                    cursor: 'pointer',
                                }}
                            />
                        ))}
                    </div>
                    {check.length > 0 && (
                        <IconButton
                            variant="outlined"
                            onClick={() => deleteAlert(check, deleteRow)}
                            color="error"
                            size="small"
                            sx={{ borderRadius: '8px', gap: 1 }}
                        >
                            <DeleteIcon fontSize="small" />
                            <span className="text_font" style={{ fontSize: 13 }}>წაშლა ({check.length})</span>
                        </IconButton>
                    )}
                </div>
            </div>

            {/* File Grid - Scrollable */}
            <div className="p-3" style={{
                flex: 1,
                overflowY: 'auto',
                background: '#f0f2f5',
                minHeight: isModal ? 0 : 300,
            }}>
                {loading.filesList ? (
                    <div className="d-flex flex-column align-items-center justify-content-center p-5">
                        <CircularProgress size={36} />
                        <p className="text_font mt-3 text-muted" style={{ fontSize: 14 }}>იტვირთება...</p>
                    </div>
                ) : files.length === 0 ? (
                    <div className="text-center p-5 text-muted">
                        <p className="text_font" style={{ fontSize: 16 }}>ფაილები ვერ მოიძებნა</p>
                    </div>
                ) : (
                    <div className="row g-3">
                        {files.map((item) => (
                            <div key={item.id} className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-6">
                                <div
                                    className="bg-white rounded-3 overflow-hidden position-relative h-100"
                                    style={{
                                        border: check.includes(String(item.id)) ? '2px solid #1976d2' : '1px solid #e8e8e8',
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    {/* Checkbox */}
                                    <div className="position-absolute" style={{ top: 8, left: 8, zIndex: 2 }}>
                                        <input
                                            id={`file-${item.id}`}
                                            value={item.id}
                                            onChange={checkedDelete}
                                            checked={check.includes(String(item.id))}
                                            type="checkbox"
                                            style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#1976d2' }}
                                        />
                                    </div>

                                    {/* Extension Badge */}
                                    <div className="position-absolute text_font" style={{
                                        top: 8,
                                        right: 8,
                                        background: 'rgba(0,0,0,0.6)',
                                        color: '#fff',
                                        fontSize: 10,
                                        fontWeight: 700,
                                        padding: '2px 6px',
                                        borderRadius: 4,
                                        textTransform: 'uppercase',
                                        letterSpacing: 0.5,
                                    }}>
                                        {item.extension}
                                    </div>

                                    {/* Image Preview */}
                                    <label htmlFor={`file-${item.id}`} className="d-block mb-0" style={{ cursor: 'pointer' }}>
                                        <div className="d-flex align-items-center justify-content-center bg-light" style={{
                                            width: '100%',
                                            height: 130,
                                            overflow: 'hidden',
                                        }}>
                                            <img
                                                src={getFilePreview(item)}
                                                alt={item.name}
                                                className="w-100 h-100"
                                                style={{ objectFit: 'cover' }}
                                                loading="lazy"
                                            />
                                        </div>
                                    </label>

                                    {/* File Info */}
                                    <div className="p-2">
                                        <p className="title_font mb-0 text-truncate" style={{
                                            fontSize: 12,
                                            fontWeight: 600,
                                            color: '#333',
                                        }} title={item.name}>
                                            {item.name}
                                        </p>

                                        {item.user && (
                                            <div className="text_font d-flex align-items-center gap-1 mt-1" style={{ fontSize: 11, color: '#888' }}>
                                                <span className="d-inline-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style={{
                                                    width: 16,
                                                    height: 16,
                                                    background: '#e3f2fd',
                                                    color: '#1976d2',
                                                    fontSize: 9,
                                                    fontWeight: 700,
                                                }}>
                                                    {item.user.name?.charAt(0)?.toUpperCase()}
                                                </span>
                                                <span className="text-truncate">{item.user.name}</span>
                                            </div>
                                        )}

                                        <p className="text_font mb-0 mt-1" style={{ fontSize: 11, color: '#aaa' }}>
                                            {formatDate(item.created_at)}
                                        </p>

                                        {/* Actions */}
                                        <div className="d-flex gap-1 mt-1 pt-1 border-top">
                                            <Tooltip title="წაშლა">
                                                <div
                                                    className="rounded"
                                                    onClick={() => deleteAlert(item.id, deleteRow)}
                                                    style={{
                                                        cursor: 'pointer',
                                                        padding: '4px 6px',
                                                        fontSize: 13,
                                                        color: '#e53935',
                                                        transition: 'background 0.15s',
                                                    }}
                                                    onMouseEnter={e => e.currentTarget.style.background = '#fbe9e7'}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                >
                                                    <i className="fas fa-fw fa-trash"></i>
                                                </div>
                                            </Tooltip>
                                            <Tooltip title="ლინკის კოპირება">
                                                <div
                                                    className="rounded"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(FileEndpoint + '/' + item.output_path);
                                                        toast.success('ლინკი დაკოპირებულია');
                                                    }}
                                                    style={{
                                                        cursor: 'pointer',
                                                        padding: '4px 6px',
                                                        fontSize: 13,
                                                        color: '#666',
                                                        transition: 'background 0.15s',
                                                    }}
                                                    onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                >
                                                    <i className="fas fa-fw fa-link"></i>
                                                </div>
                                            </Tooltip>
                                            <Tooltip title="ნახვა">
                                                <div
                                                    className="rounded"
                                                    onClick={() => window.open(FileEndpoint + '/' + item.output_path, '_blank')}
                                                    style={{
                                                        cursor: 'pointer',
                                                        padding: '4px 6px',
                                                        fontSize: 13,
                                                        color: '#666',
                                                        transition: 'background 0.15s',
                                                    }}
                                                    onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                >
                                                    <i className="fas fa-fw fa-eye"></i>
                                                </div>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination.last_page > 1 && (
                <div className="d-flex justify-content-between align-items-center px-3 py-2 border-top bg-white"
                     style={{ flexShrink: 0 }}>
                    <span className="text_font text-muted" style={{ fontSize: 13 }}>
                        სულ: {pagination.total || 0} ფაილი
                    </span>
                    <Pagination
                        count={pagination.last_page}
                        page={postPagination}
                        onChange={handleChangePagination}
                        color="primary"
                        shape="rounded"
                        size="small"
                    />
                </div>
            )}
        </div>
    );
};

export default MediaList;