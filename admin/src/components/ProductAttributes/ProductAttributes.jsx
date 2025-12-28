// components/ProductAttributes/ProductAttributes.jsx
import { useState, useEffect, useContext } from 'react';
import useHttp from "../../store/hooks/http/useHttp.jsx";
import toast from "react-hot-toast";
import { Context } from "../../store/context/context";
import UseFileManager from "../../store/hooks/global/useFileManager";
import {FileEndpoint} from "../../common/envExtetions.js";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Checkbox,
    FormControlLabel,
    Tabs,
    Tab,
    Box,
    IconButton,
    InputAdornment,
} from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import ImageIcon from "@mui/icons-material/Image";

function TabPanel({ children, value, index }) {
    return (
        <div hidden={value !== index}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

export default function ProductAttributes({ productId, initialData = {}, onChange, includeMaterials = false, includePrintTypes = false }) {
    const { state, dispatch } = useContext(Context);
    const http = useHttp();
    const [tabValue, setTabValue] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState(''); // 'color', 'size', 'extra', 'material', 'print_type'

    // Available options
    const [availableColors, setAvailableColors] = useState([]);
    const [availableSizes, setAvailableSizes] = useState([]);
    const [availableExtras, setAvailableExtras] = useState([]);
    const [availableMaterials, setAvailableMaterials] = useState([]);
    const [availablePrintTypes, setAvailablePrintTypes] = useState([]);

    // Filtered options for search
    const [filteredColors, setFilteredColors] = useState([]);
    const [filteredSizes, setFilteredSizes] = useState([]);
    const [filteredExtras, setFilteredExtras] = useState([]);
    const [filteredMaterials, setFilteredMaterials] = useState([]);
    const [filteredPrintTypes, setFilteredPrintTypes] = useState([]);

    // Search states
    const [searchColor, setSearchColor] = useState('');
    const [searchSize, setSearchSize] = useState('');
    const [searchExtra, setSearchExtra] = useState('');
    const [searchMaterial, setSearchMaterial] = useState('');
    const [searchPrintType, setSearchPrintType] = useState('');

    // Selected items with prices
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedExtras, setSelectedExtras] = useState([]);
    const [selectedMaterials, setSelectedMaterials] = useState([]);
    const [selectedPrintTypes, setSelectedPrintTypes] = useState([]);

    // Add new item dialog
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [newItemData, setNewItemData] = useState({});
    const [loadingAdd, setLoadingAdd] = useState(false);
    const [updatedCovers, setUpdatedCovers] = useState([]);
    const [coverTypes, setCoverTypes] = useState([]);

    useEffect(() => {
        fetchAllOptions();
        getCoverTypes();
        if (initialData && (initialData.colors || initialData.sizes || initialData.extras || initialData.materials || initialData.print_types)) {
            loadInitialData(initialData);
        }
    }, []);

    useEffect(() => {
        // Notify parent component
        if (onChange) {
            const data = {
                colors: selectedColors,
                sizes: selectedSizes,
                extras: selectedExtras
            };

            if (includeMaterials) {
                data.materials = selectedMaterials;
            }

            if (includePrintTypes) {
                data.print_types = selectedPrintTypes;
            }

            onChange(data);
        }
    }, [selectedColors, selectedSizes, selectedExtras, selectedMaterials, selectedPrintTypes]);

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

    // Filter colors when search changes
    useEffect(() => {
        if (searchColor.trim() === '') {
            setFilteredColors(availableColors);
        } else {
            const filtered = availableColors.filter(item =>
                (item.name && item.name.toLowerCase().includes(searchColor.toLowerCase())) ||
                (item.value && item.value.toLowerCase().includes(searchColor.toLowerCase()))
            );
            setFilteredColors(filtered);
        }
    }, [searchColor, availableColors]);

    // Filter sizes when search changes
    useEffect(() => {
        if (searchSize.trim() === '') {
            setFilteredSizes(availableSizes);
        } else {
            const filtered = availableSizes.filter(item =>
                (item.name && item.name.toLowerCase().includes(searchSize.toLowerCase())) ||
                (item.value && item.value.toLowerCase().includes(searchSize.toLowerCase()))
            );
            setFilteredSizes(filtered);
        }
    }, [searchSize, availableSizes]);

    // Filter extras when search changes
    useEffect(() => {
        if (searchExtra.trim() === '') {
            setFilteredExtras(availableExtras);
        } else {
            const filtered = availableExtras.filter(item =>
                item.name && item.name.toLowerCase().includes(searchExtra.toLowerCase())
            );
            setFilteredExtras(filtered);
        }
    }, [searchExtra, availableExtras]);

    // Filter materials when search changes
    useEffect(() => {
        if (searchMaterial.trim() === '') {
            setFilteredMaterials(availableMaterials);
        } else {
            const filtered = availableMaterials.filter(item =>
                item.name && item.name.toLowerCase().includes(searchMaterial.toLowerCase())
            );
            setFilteredMaterials(filtered);
        }
    }, [searchMaterial, availableMaterials]);

    // Filter print types when search changes
    useEffect(() => {
        if (searchPrintType.trim() === '') {
            setFilteredPrintTypes(availablePrintTypes);
        } else {
            const filtered = availablePrintTypes.filter(item =>
                item.name && item.name.toLowerCase().includes(searchPrintType.toLowerCase())
            );
            setFilteredPrintTypes(filtered);
        }
    }, [searchPrintType, availablePrintTypes]);

    const fetchAllOptions = async () => {
        try {
            const requests = [
                http.get('colors?per_page=100'),
                http.get('sizes?per_page=100'),
                http.get('extras?per_page=100')
            ];

            if (includeMaterials) {
                requests.push(http.get('materials?per_page=100'));
            }

            if (includePrintTypes) {
                requests.push(http.get('print-types?per_page=100'));
            }

            const responses = await Promise.all(requests);

            setAvailableColors(responses[0].data.data || []);
            setAvailableSizes(responses[1].data.data || []);
            setAvailableExtras(responses[2].data.data || []);

            setFilteredColors(responses[0].data.data || []);
            setFilteredSizes(responses[1].data.data || []);
            setFilteredExtras(responses[2].data.data || []);

            let responseIndex = 3;
            if (includeMaterials && responses[responseIndex]) {
                setAvailableMaterials(responses[responseIndex].data.data || []);
                setFilteredMaterials(responses[responseIndex].data.data || []);
                responseIndex++;
            }

            if (includePrintTypes && responses[responseIndex]) {
                setAvailablePrintTypes(responses[responseIndex].data.data || []);
                setFilteredPrintTypes(responses[responseIndex].data.data || []);
            }
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    const loadInitialData = (data) => {
        setSelectedColors(data.colors || []);
        setSelectedSizes(data.sizes || []);
        setSelectedExtras(data.extras || []);
        if (includeMaterials) {
            setSelectedMaterials(data.materials || []);
        }
        if (includePrintTypes) {
            setSelectedPrintTypes(data.print_types || []);
        }
    };

    const handleOpenDialog = (type) => {
        setDialogType(type);
        setOpenDialog(true);
        // Reset search when opening dialog
        if (type === 'color') setSearchColor('');
        if (type === 'size') setSearchSize('');
        if (type === 'extra') setSearchExtra('');
        if (type === 'material') setSearchMaterial('');
        if (type === 'print_type') setSearchPrintType('');
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setDialogType('');
        setSearchColor('');
        setSearchSize('');
        setSearchExtra('');
        setSearchMaterial('');
        setSearchPrintType('');
    };

    const handleOpenAddDialog = () => {
        setOpenAddDialog(true);
        setUpdatedCovers([]);
        setNewItemData({});

        // Clear context covers
        dispatch({
            type: 'SET_SELECTED_COVERS',
            payload: []
        });
    };

    const handleCloseAddDialog = () => {
        setOpenAddDialog(false);
        setNewItemData({});
        setUpdatedCovers([]);

        // Clear context covers
        dispatch({
            type: 'SET_SELECTED_COVERS',
            payload: []
        });
    };

    const handleSelectItem = (item, type) => {
        const setter = type === 'color' ? setSelectedColors :
            type === 'size' ? setSelectedSizes :
                type === 'material' ? setSelectedMaterials :
                    type === 'print_type' ? setSelectedPrintTypes : setSelectedExtras;
        const selected = type === 'color' ? selectedColors :
            type === 'size' ? selectedSizes :
                type === 'material' ? selectedMaterials :
                    type === 'print_type' ? selectedPrintTypes : selectedExtras;

        const exists = selected.find(s => s.id === item.id);

        if (exists) {
            setter(selected.filter(s => s.id !== item.id));
        } else {
            setter([...selected, {
                id: item.id,
                name: item.name,
                value: item.value,
                type: item.type,
                base_price: item.base_price || 0,
                custom_price: item.base_price || 0,
                covers: item.covers || []
            }]);
        }
    };

    const handlePriceChange = (id, price, type) => {
        const setter = type === 'color' ? setSelectedColors :
            type === 'size' ? setSelectedSizes :
                type === 'material' ? setSelectedMaterials :
                    type === 'print_type' ? setSelectedPrintTypes : setSelectedExtras;
        const selected = type === 'color' ? selectedColors :
            type === 'size' ? selectedSizes :
                type === 'material' ? selectedMaterials :
                    type === 'print_type' ? selectedPrintTypes : selectedExtras;

        setter(selected.map(item =>
            item.id === id ? { ...item, custom_price: parseFloat(price) || 0 } : item
        ));
    };

    const handleRemoveItem = (id, type) => {
        const setter = type === 'color' ? setSelectedColors :
            type === 'size' ? setSelectedSizes :
                type === 'material' ? setSelectedMaterials :
                    type === 'print_type' ? setSelectedPrintTypes : setSelectedExtras;
        const selected = type === 'color' ? selectedColors :
            type === 'size' ? selectedSizes :
                type === 'material' ? selectedMaterials :
                    type === 'print_type' ? selectedPrintTypes : selectedExtras;

        setter(selected.filter(item => item.id !== id));
    };

    const handleAddNewItem = async () => {
        if (!newItemData.name || (dialogType === 'size' && (!newItemData.width || !newItemData.height))) {
            toast.error('გთხოვთ შეავსოთ ყველა სავალდებულო ველი');
            return;
        }

        setLoadingAdd(true);
        try {
            const endpoint = dialogType === 'color' ? 'colors' :
                dialogType === 'size' ? 'sizes' :
                    dialogType === 'material' ? 'materials' :
                        dialogType === 'print_type' ? 'print-types' : 'extras';

            let data = { ...newItemData };

            // Add covers for material
            if (dialogType === 'material') {
                data.cover_id = Array.isArray(state.selected_covers)
                    ? state.selected_covers.map(item => item.id)
                    : null;
                data.cover_type = Array.isArray(state.selected_covers)
                    ? state.selected_covers.map(item => item.coverType)
                    : null;
            }

            // For size, add value
            if (dialogType === 'size') {
                data.value = `${newItemData.width}x${newItemData.height}`;
            }

            // For color, add default type and value if not set
            if (dialogType === 'color' && !data.type) {
                data.type = 'word';
                data.value = data.value || '#000000';
            }

            const response = await http.post(endpoint, data);

            if (response.status === 200 || response.status === 201) {
                await fetchAllOptions();
                handleCloseAddDialog();
                toast.success('წარმატებით დაემატა!');
            }
        } catch (error) {
            console.error('Error adding item:', error);
            toast.error('დამატება ვერ მოხერხდა');
        } finally {
            setLoadingAdd(false);
        }
    };

    const renderDialogContent = () => {
        const items = dialogType === 'color' ? filteredColors :
            dialogType === 'size' ? filteredSizes :
                dialogType === 'material' ? filteredMaterials :
                    dialogType === 'print_type' ? filteredPrintTypes : filteredExtras;
        const selected = dialogType === 'color' ? selectedColors :
            dialogType === 'size' ? selectedSizes :
                dialogType === 'material' ? selectedMaterials :
                    dialogType === 'print_type' ? selectedPrintTypes : selectedExtras;
        const searchValue = dialogType === 'color' ? searchColor :
            dialogType === 'size' ? searchSize :
                dialogType === 'material' ? searchMaterial :
                    dialogType === 'print_type' ? searchPrintType : searchExtra;
        const setSearch = dialogType === 'color' ? setSearchColor :
            dialogType === 'size' ? setSearchSize :
                dialogType === 'material' ? setSearchMaterial :
                    dialogType === 'print_type' ? setSearchPrintType : setSearchExtra;

        return (
            <Box>
                {/* Search Field */}
                <TextField
                    fullWidth
                    size="small"
                    placeholder={`ძებნა ${dialogType === 'color' ? 'ფერის' : dialogType === 'size' ? 'ზომის' : dialogType === 'material' ? 'მასალის' : dialogType === 'print_type' ? 'ბეჭდვის ტიპის' : 'დამატებითის'} მიხედვით...`}
                    value={searchValue}
                    onChange={(e) => setSearch(e.target.value)}
                    className="text_font"
                    sx={{ mb: 2 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />

                <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAddDialog}
                    sx={{ mb: 2 }}
                    fullWidth
                    className="text_font"
                >
                    ახლის დამატება
                </Button>

                <div className="row g-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {items.map(item => {
                        const isSelected = selected.find(s => s.id === item.id);
                        return (
                            <div key={item.id} className="col-12">
                                <div className={`card ${isSelected ? 'border-primary' : ''}`}>
                                    <div className="card-body p-3">
                                        <div className="row align-items-center">
                                            {/* Material Image */}
                                            {dialogType === 'material' && item.covers && item.covers.length > 0 && (
                                                <div className="col-auto">
                                                    <img
                                                        src={FileEndpoint + '/' + item.covers[0]?.path}
                                                        alt={item.name}
                                                        style={{
                                                            width: '50px',
                                                            height: '50px',
                                                            objectFit: 'cover',
                                                            borderRadius: '4px'
                                                        }}
                                                    />
                                                </div>
                                            )}

                                            {dialogType === 'material' && (!item.covers || item.covers.length === 0) && (
                                                <div className="col-auto">
                                                    <div
                                                        className="d-flex align-items-center justify-content-center rounded bg-light"
                                                        style={{
                                                            width: '50px',
                                                            height: '50px'
                                                        }}
                                                    >
                                                        <ImageIcon className="text-muted" fontSize="small" />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="col">
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={!!isSelected}
                                                            onChange={() => handleSelectItem(item, dialogType)}
                                                        />
                                                    }
                                                    label={
                                                        <div>
                                                            <strong className="title_font">{item.name || item.value}</strong>
                                                            <div className="text_font small text-muted">
                                                                {dialogType === 'color' && item.value}
                                                                {dialogType === 'size' && item.value}
                                                                {item.base_price && (
                                                                    <span className="badge bg-success ms-2">
                                                                        {parseFloat(item.base_price).toFixed(2)} ₾
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    }
                                                />

                                                {dialogType === 'color' && (
                                                    <div
                                                        style={{
                                                            background: item.type === 'gradient' ? item.value : item.value,
                                                            width: '100%',
                                                            height: '30px',
                                                            borderRadius: '4px',
                                                            marginTop: '8px',
                                                            border: '2px solid #e0e0e0'
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {items.length === 0 && (
                        <div className="col-12 text-center text-muted py-4 text_font">
                            {searchValue ? 'ძებნის შედეგები ვერ მოიძებნა' : 'ჯერ არაფერია დამატებული'}
                        </div>
                    )}
                </div>
            </Box>
        );
    };

    const renderAddDialog = () => {
        return (
            <Dialog open={openAddDialog} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
                <DialogTitle className="title_font">
                    {dialogType === 'color' ? 'ახალი ფერი' :
                        dialogType === 'size' ? 'ახალი ზომა' :
                            dialogType === 'material' ? 'ახალი მასალა' :
                                dialogType === 'print_type' ? 'ახალი ბეჭდვის ტიპი' : 'ახალი დამატებითი'}
                    <IconButton
                        onClick={handleCloseAddDialog}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="სახელი"
                        className="text_font"
                        value={newItemData.name || ''}
                        onChange={(e) => setNewItemData({...newItemData, name: e.target.value})}
                        sx={{ mt: 2, mb: 2 }}
                        required
                    />

                    {dialogType === 'color' && (
                        <TextField
                            fullWidth
                            type="color"
                            label="ფერი"
                            className="text_font"
                            value={newItemData.value || '#000000'}
                            onChange={(e) => setNewItemData({...newItemData, value: e.target.value})}
                            sx={{ mb: 2 }}
                        />
                    )}

                    {dialogType === 'size' && (
                        <>
                            <TextField
                                fullWidth
                                type="number"
                                label="სიგანე"
                                className="text_font"
                                value={newItemData.width || ''}
                                onChange={(e) => setNewItemData({...newItemData, width: e.target.value})}
                                sx={{ mb: 2 }}
                                required
                            />
                            <TextField
                                fullWidth
                                type="number"
                                label="სიმაღლე"
                                className="text_font"
                                value={newItemData.height || ''}
                                onChange={(e) => setNewItemData({...newItemData, height: e.target.value})}
                                sx={{ mb: 2 }}
                                required
                            />
                        </>
                    )}

                    {/* File Manager for Material */}
                    {dialogType === 'material' && (
                        <div className="mb-3">
                            <UseFileManager
                                key="material-add"
                                coverTypes={coverTypes}
                                updateData={updatedCovers}
                            />
                        </div>
                    )}

                    <TextField
                        fullWidth
                        type="number"
                        label="ბეის ფასი (არასავალდებულო)"
                        className="text_font"
                        value={newItemData.base_price || ''}
                        onChange={(e) => setNewItemData({...newItemData, base_price: e.target.value})}
                        InputProps={{
                            endAdornment: <span>₾</span>
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddDialog} className="text_font" disabled={loadingAdd}>
                        გაუქმება
                    </Button>
                    <Button
                        onClick={handleAddNewItem}
                        variant="contained"
                        className="text_font"
                        disabled={loadingAdd}
                    >
                        {loadingAdd ? 'იტვირთება...' : 'დამატება'}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    // Calculate tab index dynamically
    let currentTabIndex = 0;
    const getTabIndex = (tabType) => {
        const tabs = ['colors', 'sizes'];
        if (includeMaterials) tabs.push('materials');
        if (includePrintTypes) tabs.push('print_types');
        tabs.push('extras');
        return tabs.indexOf(tabType);
    };

    return (
        <div className="card">
            <div className="card-header lite-background">
                <h5 className="title_font mb-0">
                    ფერები, ზომები{includeMaterials ? ', მასალები' : ''}{includePrintTypes ? ', ბეჭდვის ტიპები' : ''} და დამატებითი
                </h5>
            </div>
            <div className="card-body">
                <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)}>
                    <Tab label={`ფერები (${selectedColors.length})`} className="text_font" />
                    <Tab label={`ზომები (${selectedSizes.length})`} className="text_font" />
                    {includeMaterials && (
                        <Tab label={`მასალები (${selectedMaterials.length})`} className="text_font" />
                    )}
                    {includePrintTypes && (
                        <Tab label={`ბეჭდვის ტიპები (${selectedPrintTypes.length})`} className="text_font" />
                    )}
                    <Tab label={`დამატებითი (${selectedExtras.length})`} className="text_font" />
                </Tabs>

                {/* Colors Tab */}
                <TabPanel value={tabValue} index={getTabIndex('colors')}>
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog('color')}
                        fullWidth
                        className="text_font mb-3"
                    >
                        ფერის დამატება
                    </Button>

                    <div className="row g-2">
                        {selectedColors.map(color => (
                            <div key={color.id} className="col-12">
                                <div className="card mb-2">
                                    <div className="card-body p-3">
                                        <div className="row align-items-center g-2">
                                            <div className="col-auto">
                                                <div
                                                    style={{
                                                        background: color.type === 'gradient' ? color.value : color.value,
                                                        width: '50px',
                                                        height: '50px',
                                                        borderRadius: '8px',
                                                        border: '2px solid #ddd'
                                                    }}
                                                />
                                            </div>
                                            <div className="col">
                                                <div className="title_font fw-bold">{color.name}</div>
                                                <small className="text_font text-muted">{color.value}</small>
                                            </div>
                                            <div className="col-auto">
                                                <TextField
                                                    type="number"
                                                    label="ფასი"
                                                    size="small"
                                                    className="text_font"
                                                    value={color.custom_price}
                                                    onChange={(e) => handlePriceChange(color.id, e.target.value, 'color')}
                                                    InputProps={{
                                                        endAdornment: <span className="text_font">₾</span>
                                                    }}
                                                    sx={{ width: '120px' }}
                                                />
                                            </div>
                                            <div className="col-auto">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleRemoveItem(color.id, 'color')}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {selectedColors.length === 0 && (
                        <div className="text-center text-muted py-4 text_font">
                            ფერები არ არის არჩეული
                        </div>
                    )}
                </TabPanel>

                {/* Sizes Tab */}
                <TabPanel value={tabValue} index={getTabIndex('sizes')}>
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog('size')}
                        fullWidth
                        className="text_font mb-3"
                    >
                        ზომის დამატება
                    </Button>

                    <div className="row g-2">
                        {selectedSizes.map(size => (
                            <div key={size.id} className="col-12">
                                <div className="card mb-2">
                                    <div className="card-body p-3">
                                        <div className="row align-items-center g-2">
                                            <div className="col">
                                                <div className="title_font fw-bold">{size.name}</div>
                                                <span className="badge bg-primary text_font">{size.value}</span>
                                            </div>
                                            <div className="col-auto">
                                                <TextField
                                                    type="number"
                                                    label="ფასი"
                                                    size="small"
                                                    className="text_font"
                                                    value={size.custom_price}
                                                    onChange={(e) => handlePriceChange(size.id, e.target.value, 'size')}
                                                    InputProps={{
                                                        endAdornment: <span className="text_font">₾</span>
                                                    }}
                                                    sx={{ width: '120px' }}
                                                />
                                            </div>
                                            <div className="col-auto">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleRemoveItem(size.id, 'size')}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {selectedSizes.length === 0 && (
                        <div className="text-center text-muted py-4 text_font">
                            ზომები არ არის არჩეული
                        </div>
                    )}
                </TabPanel>

                {/* Materials Tab */}
                {includeMaterials && (
                    <TabPanel value={tabValue} index={getTabIndex('materials')}>
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog('material')}
                            fullWidth
                            className="text_font mb-3"
                        >
                            მასალის დამატება
                        </Button>

                        <div className="row g-2">
                            {selectedMaterials.map(material => (
                                <div key={material.id} className="col-12">
                                    <div className="card mb-2">
                                        <div className="card-body p-3">
                                            <div className="row align-items-center g-2">
                                                {/* Material Image */}
                                                {material.covers && material.covers.length > 0 ? (
                                                    <div className="col-auto">
                                                        <img
                                                            src={FileEndpoint + '/' + material.covers[0]?.path}
                                                            alt={material.name}
                                                            style={{
                                                                width: '50px',
                                                                height: '50px',
                                                                objectFit: 'cover',
                                                                borderRadius: '4px'
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="col-auto">
                                                        <div
                                                            className="d-flex align-items-center justify-content-center rounded bg-light"
                                                            style={{
                                                                width: '50px',
                                                                height: '50px'
                                                            }}
                                                        >
                                                            <ImageIcon className="text-muted" fontSize="small" />
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="col">
                                                    <div className="title_font fw-bold">{material.name}</div>
                                                </div>
                                                <div className="col-auto">
                                                    <TextField
                                                        type="number"
                                                        label="ფასი"
                                                        size="small"
                                                        className="text_font"
                                                        value={material.custom_price}
                                                        onChange={(e) => handlePriceChange(material.id, e.target.value, 'material')}
                                                        InputProps={{
                                                            endAdornment: <span className="text_font">₾</span>
                                                        }}
                                                        sx={{ width: '120px' }}
                                                    />
                                                </div>
                                                <div className="col-auto">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleRemoveItem(material.id, 'material')}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {selectedMaterials.length === 0 && (
                            <div className="text-center text-muted py-4 text_font">
                                მასალები არ არის არჩეული
                            </div>
                        )}
                    </TabPanel>
                )}

                {/* Print Types Tab */}
                {includePrintTypes && (
                    <TabPanel value={tabValue} index={getTabIndex('print_types')}>
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog('print_type')}
                            fullWidth
                            className="text_font mb-3"
                        >
                            ბეჭდვის ტიპის დამატება
                        </Button>

                        <div className="row g-2">
                            {selectedPrintTypes.map(printType => (
                                <div key={printType.id} className="col-12">
                                    <div className="card mb-2">
                                        <div className="card-body p-3">
                                            <div className="row align-items-center g-2">
                                                <div className="col">
                                                    <div className="title_font fw-bold">{printType.name}</div>
                                                </div>
                                                <div className="col-auto">
                                                    <TextField
                                                        type="number"
                                                        label="ფასი"
                                                        size="small"
                                                        className="text_font"
                                                        value={printType.custom_price}
                                                        onChange={(e) => handlePriceChange(printType.id, e.target.value, 'print_type')}
                                                        InputProps={{
                                                            endAdornment: <span className="text_font">₾</span>
                                                        }}
                                                        sx={{ width: '120px' }}
                                                    />
                                                </div>
                                                <div className="col-auto">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleRemoveItem(printType.id, 'print_type')}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {selectedPrintTypes.length === 0 && (
                            <div className="text-center text-muted py-4 text_font">
                                ბეჭდვის ტიპები არ არის არჩეული
                            </div>
                        )}
                    </TabPanel>
                )}

                {/* Extras Tab */}
                <TabPanel value={tabValue} index={getTabIndex('extras')}>
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog('extra')}
                        fullWidth
                        className="text_font mb-3"
                    >
                        დამატებითის დამატება
                    </Button>

                    <div className="row g-2">
                        {selectedExtras.map(extra => (
                            <div key={extra.id} className="col-12">
                                <div className="card mb-2">
                                    <div className="card-body p-3">
                                        <div className="row align-items-center g-2">
                                            <div className="col">
                                                <div className="title_font fw-bold">{extra.name}</div>
                                            </div>
                                            <div className="col-auto">
                                                <TextField
                                                    type="number"
                                                    label="ფასი"
                                                    size="small"
                                                    className="text_font"
                                                    value={extra.custom_price}
                                                    onChange={(e) => handlePriceChange(extra.id, e.target.value, 'extra')}
                                                    InputProps={{
                                                        endAdornment: <span className="text_font">₾</span>
                                                    }}
                                                    sx={{ width: '120px' }}
                                                />
                                            </div>
                                            <div className="col-auto">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleRemoveItem(extra.id, 'extra')}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {selectedExtras.length === 0 && (
                        <div className="text-center text-muted py-4 text_font">
                            დამატებითი არ არის არჩეული
                        </div>
                    )}
                </TabPanel>
            </div>

            {/* Selection Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle className="title_font">
                    {dialogType === 'color' ? 'ფერის არჩევა' :
                        dialogType === 'size' ? 'ზომის არჩევა' :
                            dialogType === 'material' ? 'მასალის არჩევა' :
                                dialogType === 'print_type' ? 'ბეჭდვის ტიპის არჩევა' : 'დამატებითის არჩევა'}
                    <IconButton
                        onClick={handleCloseDialog}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {renderDialogContent()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} variant="contained" className="text_font">
                        დახურვა
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add New Item Dialog */}
            {renderAddDialog()}
        </div>
    );
}