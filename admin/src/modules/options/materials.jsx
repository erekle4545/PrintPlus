import { useState, useEffect, useContext } from 'react';
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExtensionIcon from "@mui/icons-material/Extension";
import ImageIcon from "@mui/icons-material/Image";
import useHttp from "@/store/hooks/http/useHttp.jsx";
import UseFileManager from "@/store/hooks/global/useFileManager";
import { Context } from "@/store/context/context";
import {FileEndpoint} from "@/common/envExtetions.js";
import toast from "react-hot-toast";

export default function Materials() {
    const { state, dispatch } = useContext(Context);
    const [extras, setExtras] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const http = useHttp();

    // ფორმის მონაცემები
    const [name, setName] = useState('');
    const [basePrice, setBasePrice] = useState('');
    const [editingId, setEditingId] = useState(null);

    // ფოტო მენეჯმენტი
    const [updatedCovers, setUpdatedCovers] = useState([]);
    const [coverTypes, setCoverTypes] = useState([]);
    const [editData, setEditData] = useState(null); // Store edit data temporarily

    useEffect(() => {
        fetchExtras(currentPage);
        getCoverTypes();
    }, [currentPage]);

    // Load edit data when editData changes
    useEffect(() => {
        if (editData) {
            setEditingId(editData.id);
            setName(editData.name);
            setBasePrice(editData.base_price || '');

            // Load existing covers
            if (editData.covers && editData.covers.length > 0) {
                const formattedCovers = editData.covers.map(cover => ({
                    id: cover.id,
                    path: cover.path,
                    name: cover.name || cover.path?.split('/').pop() || '',
                    type: cover.type || 'image',
                    coverType: cover.pivot?.cover_type || cover.cover_type || 1
                }));

                console.log('Setting covers:', formattedCovers);
                setUpdatedCovers(formattedCovers);
            } else {
                setUpdatedCovers([]);
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [editData]);

    const getCoverTypes = async () => {
        try {
            const response = await http.get('options/page');
            if (response.status === 200) {
                setCoverTypes(response.data.data.coverTypes);
            }
        } catch (error) {
            console.error('შეცდომა cover types-ის ჩატვირთვისას:', error);
        }
    };

    const fetchExtras = async (page) => {
        setLoading(true);
        try {
            const response = await http.get(`materials?page=${page}`);
            console.log('Fetched materials:', response.data.data);
            setExtras(response.data.data);
            setCurrentPage(response.data.current_page);
            setLastPage(response.data.last_page);
            setTotal(response.data.total);
        } catch (error) {
            console.error('შეცდომა:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            toast.error('გთხოვთ შეიყვანოთ სახელი');
            return;
        }

        const data = {
            name,
            base_price: basePrice ? parseFloat(basePrice) : null,
            cover_id: Array.isArray(state.selected_covers)
                ? state.selected_covers.map(item => item.id)
                : null,
            cover_type: Array.isArray(state.selected_covers)
                ? state.selected_covers.map(item => item.coverType)
                : null,
        };

        console.log('Submitting data:', data);

        setLoading(true);
        try {
            if (editingId) {
                // apiResource-ისთვის PUT მეთოდი
                const response = await http.put(`materials/${editingId}`, data);
                console.log('Update response:', response.data);
                toast.success('მასალა განახლდა!');
            } else {
                const response = await http.post('materials', data);
                console.log('Create response:', response.data);
                toast.success('მასალა დაემატა!');
            }

            resetForm();
            fetchExtras(1);
        } catch (error) {
            console.error('შეცდომა:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                toast.error('შეცდომა: ' + (error.response.data.message || 'დაფიქსირდა შეცდომა'));
            }
        } finally {
            setLoading(false);
        }
    };



    const handleEdit = (extra) => {
        console.log('Edit clicked, material:', extra);
        resetForm();
        // Set editData to trigger useEffect
        setEditData(extra);
    };

    const handleDelete = async (id) => {
        if (!confirm('დარწმუნებული ხართ რომ გსურთ წაშლა?')) return;

        setLoading(true);
        try {
            await http.delete(`materials/${id}`);
            fetchExtras(currentPage);
        } catch (error) {
            console.error('შეცდომა:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setName('');
        setBasePrice('');
        setEditingId(null);
        setUpdatedCovers([]);
        setEditData(null);
    };

    return (
        <div className="container-fluid">
            <div className="row g-4">
                {/* სია - თეიბლი */}
                <div className="col-lg-8 order-2 order-lg-1">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white border-0 p-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <h4 className="mb-0 fw-bold title_font">დამატებითი სერვისები</h4>
                                <span className="badge bg-primary rounded-pill fs-6 px-3 py-2 text_font">{total}</span>
                            </div>
                        </div>

                        <div className="card-body p-0">
                            {loading && currentPage === 1 ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" />
                                </div>
                            ) : extras.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <ExtensionIcon style={{ fontSize: '60px', opacity: 0.3 }} />
                                    <p className="mt-3 mb-0 text_font">ჯერ არაა დამატებული დამატებითი სერვისები</p>
                                </div>
                            ) : (
                                <>
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead className="bg-light">
                                            <tr>
                                                <th className="text_font" style={{ width: '80px' }}>ფოტო</th>
                                                <th className="text_font">სახელი</th>
                                                <th className="text_font" style={{ width: '150px' }}>ბეის ფასი</th>
                                                <th className="text_font" style={{ width: '150px' }}>დამატების თარიღი</th>
                                                <th className="text_font text-end" style={{ width: '120px' }}>მოქმედება</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {extras.map((extra) => (
                                                <tr key={extra.id}>
                                                    <td>
                                                        {extra.covers && extra.covers.length > 0 ? (
                                                            <img
                                                                src={FileEndpoint+'/'+extra.covers[0]?.path}
                                                                alt={extra.name}
                                                                className="rounded"
                                                                style={{
                                                                    width: '60px',
                                                                    height: '60px',
                                                                    objectFit: 'cover'
                                                                }}
                                                            />
                                                        ) : (
                                                            <div
                                                                className="d-flex align-items-center justify-content-center rounded bg-light"
                                                                style={{
                                                                    width: '60px',
                                                                    height: '60px'
                                                                }}
                                                            >
                                                                <ImageIcon className="text-muted" />
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <div className="fw-semibold text_font">{extra.name}</div>
                                                    </td>
                                                    <td>
                                                        {extra.base_price ? (
                                                            <span className="badge bg-success text_font">
                                                                    {parseFloat(extra.base_price).toFixed(2)} ₾
                                                                </span>
                                                        ) : (
                                                            <span className="badge bg-secondary text_font">
                                                                    არ არის მითითებული
                                                                </span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <small className="text-muted text_font">
                                                            {extra.created_at
                                                                ? new Date(extra.created_at).toLocaleDateString('ka-GE')
                                                                : '-'
                                                            }
                                                        </small>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex gap-1 justify-content-end">
                                                            <button
                                                                className="btn btn-sm btn-outline-primary"
                                                                onClick={() => handleEdit(extra)}
                                                                disabled={loading}
                                                                title="რედაქტირება"
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleDelete(extra.id)}
                                                                disabled={loading}
                                                                title="წაშლა"
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {lastPage > 1 && (
                                        <div className="card-footer bg-white border-top">
                                            <nav>
                                                <ul className="pagination justify-content-center mb-0">
                                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                        <button
                                                            className="page-link text_font"
                                                            onClick={() => setCurrentPage(currentPage - 1)}
                                                            disabled={currentPage === 1}
                                                        >
                                                            ←
                                                        </button>
                                                    </li>

                                                    {[...Array(lastPage)].map((_, index) => (
                                                        <li
                                                            key={index + 1}
                                                            className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                                                        >
                                                            <button
                                                                className="page-link text_font"
                                                                onClick={() => setCurrentPage(index + 1)}
                                                            >
                                                                {index + 1}
                                                            </button>
                                                        </li>
                                                    ))}

                                                    <li className={`page-item ${currentPage === lastPage ? 'disabled' : ''}`}>
                                                        <button
                                                            className="page-link text_font"
                                                            onClick={() => setCurrentPage(currentPage + 1)}
                                                            disabled={currentPage === lastPage}
                                                        >
                                                            →
                                                        </button>
                                                    </li>
                                                </ul>
                                            </nav>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* ფორმა */}
                <div className="col-lg-4 order-1 order-lg-2">
                    <div className="card shadow-sm border-0" style={{ position: 'sticky', top: '20px', zIndex: 1 }}>
                        <div className="card-body p-4">
                            <h4 className="mb-4 fw-bold title_font">
                                <ExtensionIcon className="me-2" />
                                {editingId ? 'დამატებითის რედაქტირება' : 'ახალი დამატებითი'}
                            </h4>

                            {/* სახელი */}
                            <div className="mb-3">
                                <label className="form-label small text-muted fw-semibold text_font">
                                    სახელი <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control text_font"
                                    placeholder="მაგ: სწრაფი მიწოდება, დიზაინის კორექტირება"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            {/* ბეის ფასი */}
                            <div className="mb-4">
                                <label className="form-label small text-muted fw-semibold text_font">
                                    ბეის ფასი (არასავალდებულო)
                                </label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        className="form-control text_font"
                                        placeholder="0.00"
                                        value={basePrice}
                                        onChange={(e) => setBasePrice(e.target.value)}
                                        min="0"
                                        step="0.01"
                                    />
                                    <span className="input-group-text text_font">₾</span>
                                </div>
                                <small className="text-muted text_font d-block mt-1">
                                    თუ ფასი არ არის მითითებული, შეიძლება მიეთითოს შემდგომში
                                </small>
                            </div>

                            {/* ფოტო ფაილის ატვირთვა */}
                            <div className="mb-4">
                                <UseFileManager
                                    coverTypes={coverTypes}
                                    updateData={updatedCovers}
                                />
                            </div>

                            {/* პრევიუ */}
                            {name && (
                                <div className="mb-4">
                                    <label className="form-label small text-muted fw-semibold text_font">
                                        პრევიუ
                                    </label>
                                    <div className="card border">
                                        <div className="card-body p-3">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="fw-semibold text_font">{name}</span>
                                                {basePrice && (
                                                    <span className="badge bg-success text_font">
                                                        {parseFloat(basePrice).toFixed(2)} ₾
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ღილაკები */}
                            <div className="d-flex gap-2">
                                {editingId && (
                                    <button
                                        className="btn btn-secondary flex-grow-1 text_font"
                                        onClick={resetForm}
                                        disabled={loading}
                                    >
                                        გაუქმება
                                    </button>
                                )}
                                <button
                                    className="btn btn-primary flex-grow-1 fw-semibold text_font"
                                    onClick={handleSubmit}
                                    disabled={loading || !name}
                                >
                                    {loading ? (
                                        <span className="spinner-border spinner-border-sm me-2" />
                                    ) : editingId ? (
                                        <EditIcon className="me-2" fontSize="small" />
                                    ) : (
                                        <AddIcon className="me-2" />
                                    )}
                                    {editingId ? 'განახლება' : 'დამატება'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}