import { useState, useEffect } from 'react';
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PaletteIcon from "@mui/icons-material/Palette";
import GradientIcon from "@mui/icons-material/Gradient";
import useHttp from "@/store/hooks/http/useHttp.jsx";

export default function Colors() {
    const [selectedColors, setSelectedColors] = useState([]);
    const [colors, setColors] = useState([]);
    const [inputType, setInputType] = useState('word');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [manualColorInputs, setManualColorInputs] = useState(['']);
    const [colorName, setColorName] = useState('');
    const [basePrice, setBasePrice] = useState('');
    const http = useHttp();

    useEffect(() => {
        fetchColors(currentPage);
    }, [currentPage]);

    const fetchColors = async (page) => {
        setLoading(true);
        try {
            const response = await http.get(`colors?page=${page}`);
            setColors(response.data.data);
            setCurrentPage(response.data.current_page);
            setLastPage(response.data.last_page);
            setTotal(response.data.total);
        } catch (error) {
            console.error('შეცდომა:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddColor = async () => {
        if (selectedColors.length === 0) {
            alert('გთხოვთ აირჩიოთ ფერი');
            return;
        }

        const colorValue = inputType === 'word'
            ? selectedColors[0]
            : `linear-gradient(to right, ${selectedColors.join(', ')})`;

        const data = {
            name: colorName || null,
            value: colorValue,
            type: inputType,
            colors: selectedColors,
            base_price: basePrice ? parseFloat(basePrice) : null
        };

        setLoading(true);
        try {
            await http.post('colors', data);
            setSelectedColors([]);
            setManualColorInputs(['']);
            setColorName('');
            setBasePrice('');
            fetchColors(1);
        } catch (error) {
            console.error('შეცდომა:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('წაშლა?')) return;

        setLoading(true);
        try {
            await http.delete(`colors/${id}`);
            fetchColors(currentPage);
        } catch (error) {
            console.error('შეცდომა:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleColorChange = (index, value) => {
        const newColors = [...selectedColors];
        newColors[index] = value;
        setSelectedColors(newColors.filter(c => c));

        const newInputs = [...manualColorInputs];
        newInputs[index] = value;
        setManualColorInputs(newInputs);
    };

    const isValidColor = (color) => {
        if (!color) return false;
        const patterns = [
            /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
            /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/,
            /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/
        ];

        if (patterns.some(p => p.test(color))) return true;

        const s = new Option().style;
        s.color = color;
        return s.color !== '';
    };

    const maxColors = inputType === 'gradient' ? 4 : 1;

    return (
        <div className="">
            <div className="row">
                {/* ფორმა */}
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0" style={{ position: 'sticky', top: '20px' }}>
                        <div className="card-body p-4">
                            <h4 className="mb-4 fw-bold title_font">
                                <PaletteIcon className="me-2" />
                                ახალი ფერი
                            </h4>

                            {/* სახელი */}
                            <div className="mb-3">
                                <label className="form-label small text-muted fw-semibold text_font">
                                    სახელი (არასავალდებულო)
                                </label>
                                <input
                                    type="text"
                                    className="form-control text_font"
                                    placeholder="მაგ: ძირითადი ლურჯი"
                                    value={colorName}
                                    onChange={(e) => setColorName(e.target.value)}
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

                            {/* ტიპის არჩევა */}
                            <div className="btn-group w-100 mb-4 text_font" role="group">
                                <input
                                    type="radio"
                                    className="btn-check"
                                    name="colorType"
                                    id="wordType"
                                    value="word"
                                    checked={inputType === 'word'}
                                    onChange={(e) => {
                                        setInputType(e.target.value);
                                        setSelectedColors([]);
                                        setManualColorInputs(['']);
                                    }}
                                />
                                <label className="btn btn-outline-primary text_font" htmlFor="wordType">
                                    <PaletteIcon fontSize="small" className="me-1" />
                                    ფერი
                                </label>

                                <input
                                    type="radio"
                                    className="btn-check"
                                    name="colorType"
                                    id="gradientType"
                                    value="gradient"
                                    checked={inputType === 'gradient'}
                                    onChange={(e) => {
                                        setInputType(e.target.value);
                                        setSelectedColors([]);
                                        setManualColorInputs(['']);
                                    }}
                                />
                                <label className="btn btn-outline-primary text_font" htmlFor="gradientType">
                                    <GradientIcon fontSize="small" className="me-1" />
                                    გრადიენტი
                                </label>
                            </div>

                            {/* ფერის არჩევა */}
                            <div className="mb-4">
                                {[...Array(maxColors)].map((_, index) => (
                                    <div key={index} className="mb-3">
                                        {maxColors > 1 && (
                                            <label className="form-label small text-muted fw-semibold text_font">
                                                ფერი {index + 1}
                                            </label>
                                        )}

                                        <div className="d-flex gap-2">
                                            <input
                                                type="color"
                                                className="form-control form-control-color"
                                                style={{ width: '70px', height: '45px', cursor: 'pointer' }}
                                                onChange={(e) => handleColorChange(index, e.target.value)}
                                                value={selectedColors[index] || '#000000'}
                                                title="აირჩიეთ ფერი"
                                            />

                                            <input
                                                type="text"
                                                className="form-control text_font"
                                                placeholder="#FF5733"
                                                value={manualColorInputs[index] || ''}
                                                onChange={(e) => handleColorChange(index, e.target.value)}
                                                style={{
                                                    borderColor: manualColorInputs[index] && !isValidColor(manualColorInputs[index])
                                                        ? '#dc3545' : ''
                                                }}
                                            />
                                        </div>

                                        {manualColorInputs[index] && !isValidColor(manualColorInputs[index]) && (
                                            <small className="text-danger d-block mt-1 text_font">არასწორი ფორმატი</small>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* პრევიუ */}
                            {selectedColors.length > 0 && (
                                <div className="mb-4">
                                    <label className="form-label small text-muted fw-semibold text_font">პრევიუ</label>
                                    <div
                                        className="rounded-3 shadow-sm"
                                        style={{
                                            background: inputType === 'gradient' && selectedColors.length >= 2
                                                ? `linear-gradient(to right, ${selectedColors.join(', ')})`
                                                : selectedColors[0] || '#000',
                                            height: '80px',
                                            border: '3px solid #e9ecef'
                                        }}
                                    />
                                </div>
                            )}

                            {/* დამატების ღილაკი */}
                            <button
                                className="btn btn-primary w-100 py-2 fw-semibold text_font"
                                onClick={handleAddColor}
                                disabled={loading || selectedColors.length === 0}
                            >
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm me-2" />
                                ) : (
                                    <AddIcon className="me-2" />
                                )}
                                დამატება
                            </button>
                        </div>
                    </div>
                </div>

                {/* სია */}
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white border-0 p-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <h4 className="mb-0 fw-bold title_font">შენახული ფერები</h4>
                                <span className="badge bg-primary rounded-pill fs-6 px-3 py-2 text_font">{total}</span>
                            </div>
                        </div>

                        <div className="card-body p-4">
                            {loading && currentPage === 1 ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" />
                                </div>
                            ) : colors.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <PaletteIcon style={{ fontSize: '60px', opacity: 0.3 }} />
                                    <p className="mt-3 mb-0 text_font">ჯერ არაა დამატებული ფერები</p>
                                </div>
                            ) : (
                                <>
                                    <div className="d-flex flex-column gap-3">
                                        {colors.map((color) => (
                                            <div key={color.id} className="card border shadow-sm">
                                                <div className="card-body p-3">
                                                    <div className="row align-items-center g-3">
                                                        <div className="col-auto">
                                                            <div
                                                                className="rounded-3 shadow-sm"
                                                                style={{
                                                                    background: color.type === 'gradient'
                                                                        ? color.value
                                                                        : color.value,
                                                                    width: '70px',
                                                                    height: '70px',
                                                                    border: '3px solid #f8f9fa'
                                                                }}
                                                            />
                                                        </div>

                                                        <div className="col">
                                                            {color.name && (
                                                                <div className="fw-bold text-break mb-1 title_font">
                                                                    {color.name}
                                                                </div>
                                                            )}
                                                            <div className="fw-semibold text-break mb-1 text_font" style={{ fontSize: color.name ? '0.9rem' : '1rem' }}>
                                                                {color.value}
                                                            </div>
                                                            <div className="d-flex gap-2 align-items-center flex-wrap">
                                                                <span className="badge bg-light text-dark border text_font">
                                                                    {color.type === 'word' ? 'ფერი' : 'გრადიენტი'}
                                                                </span>
                                                                {color.base_price && (
                                                                    <span className="badge bg-success text_font">
                                                                        {parseFloat(color.base_price).toFixed(2)} ₾
                                                                    </span>
                                                                )}
                                                                {color.created_at && (
                                                                    <small className="text-muted text_font">
                                                                        {new Date(color.created_at).toLocaleDateString('ka-GE')}
                                                                    </small>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="col-auto">
                                                            <button
                                                                className="btn btn-outline-danger btn-sm"
                                                                onClick={() => handleDelete(color.id)}
                                                                disabled={loading}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </button>
                                                        </div>
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