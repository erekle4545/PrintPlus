import { useState, useEffect } from 'react';
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import useHttp from "@/store/hooks/http/useHttp.jsx";

export default function Sizes() {
    const [sizes, setSizes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const http = useHttp();

    // ფორმის მონაცემები
    const [name, setName] = useState('');
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [basePrice, setBasePrice] = useState('');
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchSizes(currentPage);
    }, [currentPage]);

    const fetchSizes = async (page) => {
        setLoading(true);
        try {
            const response = await http.get(`sizes?page=${page}`);
            setSizes(response.data.data);
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
        if (!name.trim() || !width || !height) {
            alert('გთხოვთ შეავსოთ ყველა ველი');
            return;
        }

        const sizeValue = `${width}x${height}`;
        const data = {
            name,
            width: parseInt(width),
            height: parseInt(height),
            value: sizeValue,
            base_price: basePrice ? parseFloat(basePrice) : null
        };

        setLoading(true);
        try {
            if (editingId) {
                await http.put(`sizes/${editingId}`, data);
            } else {
                await http.post('sizes', data);
            }

            resetForm();
            fetchSizes(1);
        } catch (error) {
            console.error('შეცდომა:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (size) => {
        setEditingId(size.id);
        setName(size.name);
        setWidth(size.width);
        setHeight(size.height);
        setBasePrice(size.base_price || '');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!confirm('წაშლა?')) return;

        setLoading(true);
        try {
            await http.delete(`sizes/${id}`);
            fetchSizes(currentPage);
        } catch (error) {
            console.error('შეცდომა:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setName('');
        setWidth('');
        setHeight('');
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
                                <AspectRatioIcon className="me-2" />
                                {editingId ? 'ზომის რედაქტირება' : 'ახალი ზომა'}
                            </h4>

                            {/* სახელი */}
                            <div className="mb-3">
                                <label className="form-label small text-muted fw-semibold text_font">
                                    სახელი
                                </label>
                                <input
                                    type="text"
                                    className="form-control text_font"
                                    placeholder="მაგ: ბალიშისთვის"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            {/* სიგანე */}
                            <div className="mb-3">
                                <label className="form-label small text-muted fw-semibold text_font">
                                    სიგანე
                                </label>
                                <input
                                    type="number"
                                    className="form-control text_font"
                                    placeholder="მაგ: 200"
                                    value={width}
                                    onChange={(e) => setWidth(e.target.value)}
                                    min="1"
                                />
                            </div>

                            {/* სიმაღლე */}
                            <div className="mb-3">
                                <label className="form-label small text-muted fw-semibold text_font">
                                    სიმაღლე
                                </label>
                                <input
                                    type="number"
                                    className="form-control text_font"
                                    placeholder="მაგ: 100"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    min="1"
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
                            </div>

                            {/* პრევიუ */}
                            {width && height && (
                                <div className="mb-4">
                                    <label className="form-label small text-muted fw-semibold text_font">
                                        პრევიუ: {width}x{height}
                                    </label>
                                    <div
                                        className="border rounded-3 bg-light d-flex align-items-center justify-content-center"
                                        style={{
                                            height: '100px',
                                            position: 'relative'
                                        }}
                                    >
                                        <div
                                            className="bg-primary rounded"
                                            style={{
                                                width: Math.min(parseInt(width) / 10, 80) + 'px',
                                                height: Math.min(parseInt(height) / 10, 80) + 'px',
                                                maxWidth: '80px',
                                                maxHeight: '80px'
                                            }}
                                        />
                                        <small className="position-absolute bottom-0 end-0 p-2 text-muted text_font">
                                            თანაფარდობა: {(width / height).toFixed(2)}
                                        </small>
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
                                    disabled={loading || !name || !width || !height}
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
                                <h4 className="mb-0 fw-bold title_font">შენახული ზომები</h4>
                                <span className="badge bg-primary rounded-pill fs-6 px-3 py-2 text_font">{total}</span>
                            </div>
                        </div>

                        <div className="card-body p-4">
                            {loading && currentPage === 1 ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" />
                                </div>
                            ) : sizes.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <AspectRatioIcon style={{ fontSize: '60px', opacity: 0.3 }} />
                                    <p className="mt-3 mb-0 text_font">ჯერ არაა დამატებული ზომები</p>
                                </div>
                            ) : (
                                <>
                                    <div className="row g-3">
                                        {sizes.map((size) => (
                                            <div key={size.id} className="col-md-6">
                                                <div className="card border shadow-sm h-100">
                                                    <div className="card-body p-3">
                                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                                            <div className="flex-grow-1">
                                                                <h5 className="mb-1 title_font">{size.name}</h5>
                                                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                                                    <span className="badge bg-primary text_font">
                                                                        {size.value}
                                                                    </span>
                                                                    <small className="text-muted text_font">
                                                                        {(size.width / size.height).toFixed(2)}:1
                                                                    </small>
                                                                    {size.base_price && (
                                                                        <span className="badge bg-success text_font">
                                                                            {parseFloat(size.base_price).toFixed(2)} ₾
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="d-flex gap-1">
                                                                <button
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    onClick={() => handleEdit(size)}
                                                                    disabled={loading}
                                                                    title="რედაქტირება"
                                                                >
                                                                    <EditIcon fontSize="small" />
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() => handleDelete(size.id)}
                                                                    disabled={loading}
                                                                    title="წაშლა"
                                                                >
                                                                    <DeleteIcon fontSize="small" />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* ზომის ვიზუალიზაცია */}
                                                        <div
                                                            className="border rounded bg-light d-flex align-items-center justify-content-center p-2"
                                                            style={{ height: '80px' }}
                                                        >
                                                            <div
                                                                className="bg-primary rounded shadow-sm"
                                                                style={{
                                                                    width: Math.min(size.width / 15, 60) + 'px',
                                                                    height: Math.min(size.height / 15, 60) + 'px',
                                                                    maxWidth: '60px',
                                                                    maxHeight: '60px'
                                                                }}
                                                            />
                                                        </div>

                                                        {size.created_at && (
                                                            <small className="text-muted d-block mt-2 text_font">
                                                                {new Date(size.created_at).toLocaleDateString('ka-GE')}
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