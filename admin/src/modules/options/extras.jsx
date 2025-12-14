import { useState, useEffect } from 'react';
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExtensionIcon from "@mui/icons-material/Extension";
import useHttp from "@/store/hooks/http/useHttp.jsx";

export default function Extras() {
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

    useEffect(() => {
        fetchExtras(currentPage);
    }, [currentPage]);

    const fetchExtras = async (page) => {
        setLoading(true);
        try {
            const response = await http.get(`extras?page=${page}`);
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
            alert('გთხოვთ შეიყვანოთ სახელი');
            return;
        }

        const data = {
            name,
            base_price: basePrice ? parseFloat(basePrice) : null
        };

        setLoading(true);
        try {
            if (editingId) {
                await http.put(`extras/${editingId}`, data);
            } else {
                await http.post('extras', data);
            }

            resetForm();
            fetchExtras(1);
        } catch (error) {
            console.error('შეცდომა:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (extra) => {
        setEditingId(extra.id);
        setName(extra.name);
        setBasePrice(extra.base_price || '');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!confirm('წაშლა?')) return;

        setLoading(true);
        try {
            await http.delete(`extras/${id}`);
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
    };

    return (
        <div className="">
            <div className="row g-4">
                {/* ფორმა */}
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0" style={{ position: 'sticky', top: '20px' }}>
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

                {/* სია */}
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white border-0 p-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <h4 className="mb-0 fw-bold title_font">დამატებითი სერვისები</h4>
                                <span className="badge bg-primary rounded-pill fs-6 px-3 py-2 text_font">{total}</span>
                            </div>
                        </div>

                        <div className="card-body p-4">
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
                                    <div className="row g-3">
                                        {extras.map((extra) => (
                                            <div key={extra.id} className="col-md-6">
                                                <div className="card border shadow-sm h-100">
                                                    <div className="card-body p-3">
                                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                                            <div className="flex-grow-1">
                                                                <h5 className="mb-2 title_font">{extra.name}</h5>
                                                                {extra.base_price ? (
                                                                    <div className="mb-2">
                                                                        <span className="badge bg-success fs-6 text_font">
                                                                            {parseFloat(extra.base_price).toFixed(2)} ₾
                                                                        </span>
                                                                        <small className="text-muted ms-2 text_font">
                                                                            ბეის ფასი
                                                                        </small>
                                                                    </div>
                                                                ) : (
                                                                    <div className="mb-2">
                                                                        <span className="badge bg-secondary text_font">
                                                                            ფასი არ არის მითითებული
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="d-flex gap-1">
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
                                                        </div>

                                                        {extra.created_at && (
                                                            <small className="text-muted d-block text_font">
                                                                დამატებულია: {new Date(extra.created_at).toLocaleDateString('ka-GE')}
                                                            </small>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {lastPage > 1 && (
                                        <nav className="mt-4">
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
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}