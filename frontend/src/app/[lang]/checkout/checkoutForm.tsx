"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/shared/hooks/useCart";
import { axiosInstance } from "@/shared/hooks/useHttp";
import { toast } from "react-toastify";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import styles from "../../[lang]/profile/Profile.module.css";
import TextField from "@/shared/components/ui/textfield/Textfield";
import { Alert } from "@/shared/components/ui/alert/alert";
import TealCheckbox from "@/shared/components/ui/tealCheckbox/tealCheckbox";
import Button from "@/shared/components/ui/button/Button";
import { Form } from "react-bootstrap";

// Google Maps Config
const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '8px',
    marginTop: '15px'
};

const defaultCenter = {
    lat: 41.7151,
    lng: 44.8271
};

// Interfaces
interface City {
    id: number;
    key: string;
    name: string;
}

interface PaymentMethod {
    id: string;
    key: string;
    name: string;
    icon: string;
}

export default function CheckoutForm() {
    const router = useRouter();
    const { items, total, clearCart, loading: cartLoading } = useCart();

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        city_id: 1,
        address: "",
        notes: "",
        delivery_method: "delivery",
        payment_method: "cash",
        latitude: null as number | null,
        longitude: null as number | null,
    });

    // UI State
    const [cityOpen, setCityOpen] = useState(false);
    const [cities, setCities] = useState<City[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Map State
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [markerPosition, setMarkerPosition] = useState(defaultCenter);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [isGeocodingFromMap, setIsGeocodingFromMap] = useState(false);

    // Load config from backend
    useEffect(() => {
        loadConfig();
    }, []);

    // Get selected city name for display
    const selectedCityName = cities.find(city => city.id === formData.city_id)?.name || "თბილისი";

    // Geocode address when user types
    useEffect(() => {
        if (formData.address && selectedCityName && isMapLoaded && !isGeocodingFromMap) {
            const timer = setTimeout(() => {
                geocodeAddress(`${formData.address}, ${selectedCityName}, Georgia`);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [formData.address, formData.city_id, selectedCityName, isMapLoaded, isGeocodingFromMap]);

    const loadConfig = async () => {
        try {
            const response = await axiosInstance.get("/config/checkout");

            if (response.data) {
                if (Array.isArray(response.data.cities)) {
                    setCities(response.data.cities);
                    const tbilisi = response.data.cities.find((city: City) => city.key === "tbilisi");
                    if (tbilisi) {
                        setFormData(prev => ({ ...prev, city_id: tbilisi.id }));
                    }
                }

                if (Array.isArray(response.data.paymentMethods)) {
                    setPaymentMethods(response.data.paymentMethods);
                }
            }
        } catch (error) {
            console.error("Error loading config:", error);
            toast.error("კონფიგურაციის ჩატვირთვისას დაფიქსირდა შეცდომა");
        }
    };

    // Forward Geocoding: Address → Coordinates
    const geocodeAddress = useCallback(async (address: string) => {
        if (!address.trim() || !window.google) return;

        try {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address }, (results, status) => {
                if (status === 'OK' && results?.[0]) {
                    const location = results[0].geometry.location;
                    const newPosition = {
                        lat: location.lat(),
                        lng: location.lng()
                    };
                    setMapCenter(newPosition);
                    setMarkerPosition(newPosition);
                    setFormData(prev => ({
                        ...prev,
                        latitude: newPosition.lat,
                        longitude: newPosition.lng
                    }));
                }
            });
        } catch (error) {
            console.error("Geocoding error:", error);
        }
    }, []);

    // Reverse Geocoding: Coordinates → Address
    const reverseGeocode = useCallback(async (lat: number, lng: number) => {
        if (!window.google) return;

        setIsGeocodingFromMap(true);

        try {
            const geocoder = new window.google.maps.Geocoder();
            const latlng = { lat, lng };

            geocoder.geocode({ location: latlng }, (results, status) => {
                if (status === 'OK' && results?.[0]) {
                    const address = results[0].formatted_address;
                    setFormData(prev => ({
                        ...prev,
                        address: address,
                        latitude: lat,
                        longitude: lng
                    }));
                    toast.success("მისამართი წარმატებით განახლდა");
                } else {
                    toast.error("მისამართის მიღება ვერ მოხერხდა");
                }
                setTimeout(() => setIsGeocodingFromMap(false), 500);
            });
        } catch (error) {
            console.error("Reverse geocoding error:", error);
            setIsGeocodingFromMap(false);
        }
    }, []);

    // Handle map click
    const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            const newPosition = { lat, lng };
            setMarkerPosition(newPosition);
            setMapCenter(newPosition);
            reverseGeocode(lat, lng);
        }
    }, [reverseGeocode]);

    // Handle marker drag
    const handleMarkerDragEnd = useCallback((event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            const newPosition = { lat, lng };
            setMarkerPosition(newPosition);
            setMapCenter(newPosition);
            reverseGeocode(lat, lng);
        }
    }, [reverseGeocode]);

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "სახელი და გვარი აუცილებელია";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "ტელეფონი აუცილებელია";
        }

        if (formData.delivery_method === "delivery" && !formData.address.trim()) {
            newErrors.address = "მისამართი აუცილებელია მიტანისთვის";
        }

        if (!agreeTerms) {
            newErrors.terms = "გთხოვთ დაეთანხმოთ წესებს და პირობებს";
        }

        if (items.length === 0) {
            toast.error("კალათა ცარიელია");
            return false;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Submit order
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("გთხოვთ შეავსოთ ყველა სავალდებულო ველი");
            return;
        }

        setLoading(true);

        try {
            // Get cart IDs from items
            const cartIds = items.map(item => item.id);

            const response = await axiosInstance.post("/orders", {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                city_id: formData.city_id,
                address: formData.delivery_method === "delivery" ? formData.address : "მე წავიღებ",
                latitude: formData.latitude,
                longitude: formData.longitude,
                notes: formData.notes,
                payment_method: formData.payment_method,
                cart_ids: cartIds, // Send cart IDs instead of items
                total: total,
            });

            if (response.data.success) {
                toast.success("შეკვეთა წარმატებით შეიქმნა!");
                await clearCart();
                router.push(`/order-success?order=${response.data.data.order_number}`);
            }
        } catch (error: any) {
            console.error("Order error:", error);
            toast.error(error.response?.data?.message || "შეკვეთის შექმნისას დაფიქსირდა შეცდომა");
        } finally {
            setLoading(false);
        }
    };

    // Handle city dropdown toggle
    const handleCityToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCityOpen(!cityOpen);
    };

    // Handle city selection
    const handleCitySelect = (cityId: number) => {
        setFormData(prev => ({ ...prev, city_id: cityId }));
        setCityOpen(false);
    };

    // Handle map load
    const handleMapLoad = () => {
        setIsMapLoaded(true);
    };

    return (
        <div data-aos="fade-up">
            {/* Alert */}
            {Object.keys(errors).length > 0 && (
                <div className={styles.errorBox}>
                    <Alert
                        className={"w-100"}
                        message="ჩვენი სერვისით სარგებლობისთვის, გთხოვთ შეავსოთ ყველა ველი"
                    />
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
                <div className={styles.formWrapper}>
                    {/* Name */}
                    <TextField
                        label="სახელი და გვარი"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="თქვენი სახელი და გვარი"
                        className="title_font"
                        error={errors.name}
                        disabled={loading}
                    />

                    {/* Phone */}
                    <TextField
                        label="მობილური"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="მიუთითეთ მობილური ტელეფონი"
                        className="title_font"
                        error={errors.phone}
                        disabled={loading}
                    />

                    {/* Delivery Method */}
                    <div>
                        <h5 className="fw-bolder">მიტანის მეთოდი</h5>
                        <div>
                            <TealCheckbox
                                label={'ადგილზე მიტანა'}
                                className={'title_font fw-bold'}
                                checked={formData.delivery_method === "delivery"}
                                onChange={() => setFormData(prev => ({
                                    ...prev,
                                    delivery_method: "delivery"
                                }))}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <TealCheckbox
                                label={'მე წავიღებ'}
                                className={'title_font fw-bold'}
                                checked={formData.delivery_method === "pickup"}
                                onChange={() => setFormData(prev => ({
                                    ...prev,
                                    delivery_method: "pickup"
                                }))}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                        <h5 className="fw-bolder">გადახდის მეთოდი</h5>
                        {paymentMethods.map((method) => (
                            <div key={method.id}>
                                <TealCheckbox
                                    label={`${method.icon} ${method.name}`}
                                    className={'title_font fw-bold'}
                                    checked={formData.payment_method === method.id}
                                    onChange={() => setFormData(prev => ({
                                        ...prev,
                                        payment_method: method.id
                                    }))}
                                    disabled={loading}
                                />
                            </div>
                        ))}
                    </div>

                    {/* City Dropdown - Only show if delivery */}
                    {formData.delivery_method === "delivery" && (
                        <div className={styles.dropdown}>
                            <label className="fw-bolder">ქალაქი</label>
                            <button
                                className={styles.dropdownToggle}
                                onClick={handleCityToggle}
                                type="button"
                                disabled={loading || cities.length === 0}
                            >
                                {cities.length === 0 ? "იტვირთება..." : selectedCityName}
                                <span className={styles.dropdownArrow}>▾</span>
                            </button>
                            {cityOpen && cities.length > 0 && (
                                <ul className={styles.dropdownMenu}>
                                    {cities.map((city) => (
                                        <li
                                            key={city.id}
                                            className={`${styles.dropdownItem} ${city.id === formData.city_id ? styles.active : ''}`}
                                            onClick={() => handleCitySelect(city.id)}
                                        >
                                            {city.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                    {/* Address - Only show if delivery */}
                    {formData.delivery_method === "delivery" && (
                        <TextField
                            label="თქვენი მისამართი"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="მისამართი"
                            className="title_font"
                            error={errors.address}
                            disabled={loading}
                        />
                    )}

                    {/* Notes Textarea */}
                    <div>
                        <label className="fw-bolder">დამატებითი დეტალები</label>
                        <div>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                placeholder="გთხოვთ მიუთითოთ სადარბაზო, სართული ან სხვა დამატებითი დეტალები"
                                className='text_font'
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Google Map - Only show if delivery */}
                    {formData.delivery_method === "delivery" && (
                        <div className={styles.mapContainer}>
                            <label className="fw-bolder mb-2">
                                თქვენი მისამართი რუკაზე
                                <small className="d-block text-muted fw-normal mt-1">
                                    რუკაზე დააწკაპუნეთ ან გადაიტანეთ მარკერი თქვენი ზუსტი მისამართისთვის
                                </small>
                            </label>
                            <LoadScript
                                googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
                                onLoad={handleMapLoad}
                            >
                                <GoogleMap
                                    mapContainerStyle={mapContainerStyle}
                                    center={mapCenter}
                                    zoom={15}
                                    onClick={handleMapClick}
                                    options={{
                                        streetViewControl: false,
                                        mapTypeControl: false,
                                        fullscreenControl: true,
                                    }}
                                >
                                    <Marker
                                        position={markerPosition}
                                        draggable={true}
                                        onDragEnd={handleMarkerDragEnd}
                                    />
                                </GoogleMap>
                            </LoadScript>
                            {formData.latitude && formData.longitude && (
                                <small className="text-muted d-block mt-2">
                                    კოორდინატები: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                                </small>
                            )}
                        </div>
                    )}

                    {/* Terms Checkbox */}
                    <div className={styles.checkboxWrapper}>
                        <label
                            htmlFor="terms"
                            className="d-flex gap-1 align-items-center"
                        >
                            <TealCheckbox
                                className="text_font"
                                label={"ვეთანხმები პირობებს და პოლიტიკას"}
                                checked={agreeTerms}
                                onChange={(e) => setAgreeTerms(e.target.checked)}
                                disabled={loading}
                            />
                            <a href="#" className="text_font">
                                (წესები და პირობები)
                            </a>
                        </label>
                    </div>
                    {errors.terms && (
                        <div className="text-danger small text_font">{errors.terms}</div>
                    )}

                    {/* Submit Button */}
                    <div className="text-center">
                        <Button
                            size={"sm"}
                            type={"submit"}
                            variant={"my-btn-blue"}
                            className={
                                "justify-content-center title_font fw-bolder w-100"
                            }
                            disabled={loading || cartLoading || items.length === 0}
                        >
                            {loading ? "დამუშავება..." : "შეკვეთის გაფორმება"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}

// "use client";
//
// import React, { useState, useEffect, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import { useCart } from "@/shared/hooks/useCart";
// import { axiosInstance } from "@/shared/hooks/useHttp";
// import { toast } from "react-toastify";
// import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
// import styles from "../../[lang]/profile/Profile.module.css";
// import TextField from "@/shared/components/ui/textfield/Textfield";
// import { Alert } from "@/shared/components/ui/alert/alert";
// import TealCheckbox from "@/shared/components/ui/tealCheckbox/tealCheckbox";
// import Button from "@/shared/components/ui/button/Button";
// import { Form } from "react-bootstrap";
//
// // Google Maps Config
// const mapContainerStyle = {
//     width: '100%',
//     height: '400px',
//     borderRadius: '8px',
//     marginTop: '15px'
// };
//
// const defaultCenter = {
//     lat: 41.7151, // თბილისი
//     lng: 44.8271
// };
//
// // City Interface
// interface City {
//     id: number;
//     key: string;
//     name: string;
// }
//
// export default function CheckoutForm() {
//     const router = useRouter();
//     const { items, total, clearCart, loading: cartLoading } = useCart();
//
//     // Form State
//     const [formData, setFormData] = useState({
//         name: "",
//         phone: "",
//         email: "",
//         city_id: 1,
//         address: "",
//         notes: "",
//         delivery_method: "delivery",
//         latitude: null as number | null,
//         longitude: null as number | null,
//     });
//
//     // UI State
//     const [cityOpen, setCityOpen] = useState(false);
//     const [cities, setCities] = useState<City[]>([]);
//     const [agreeTerms, setAgreeTerms] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [errors, setErrors] = useState<Record<string, string>>({});
//
//     // Map State
//     const [mapCenter, setMapCenter] = useState(defaultCenter);
//     const [markerPosition, setMarkerPosition] = useState(defaultCenter);
//     const [isMapLoaded, setIsMapLoaded] = useState(false);
//     const [isGeocodingFromMap, setIsGeocodingFromMap] = useState(false);
//
//     // Load cities from backend
//     useEffect(() => {
//         loadCities();
//     }, []);
//
//     // Get selected city name for display
//     const selectedCityName = cities.find(city => city.id === formData.city_id)?.name || "თბილისი";
//
//     // Geocode address when user types (only if not updating from map click)
//     useEffect(() => {
//         if (formData.address && selectedCityName && isMapLoaded && !isGeocodingFromMap) {
//             const timer = setTimeout(() => {
//                 geocodeAddress(`${formData.address}, ${selectedCityName}, Georgia`);
//             }, 1000); // Debounce for 1 second
//
//             return () => clearTimeout(timer);
//         }
//     }, [formData.address, formData.city_id, selectedCityName, isMapLoaded, isGeocodingFromMap]);
//
//     const loadCities = async () => {
//         try {
//             const response = await axiosInstance.get("/config/checkout");
//
//             if (response.data && Array.isArray(response.data.cities)) {
//                 setCities(response.data.cities);
//
//                 const tbilisi = response.data.cities.find((city: City) => city.key === "tbilisi");
//                 if (tbilisi) {
//                     setFormData(prev => ({ ...prev, city_id: tbilisi.id }));
//                 } else if (response.data.cities.length > 0) {
//                     setFormData(prev => ({ ...prev, city_id: response.data.cities[0].id }));
//                 }
//             }
//         } catch (error) {
//             console.error("Error loading cities:", error);
//             toast.error("ქალაქების ჩატვირთვისას დაფიქსირდა შეცდომა");
//         }
//     };
//
//     // Forward Geocoding: Address → Coordinates
//     const geocodeAddress = useCallback(async (address: string) => {
//         if (!address.trim() || !window.google) return;
//
//         try {
//             const geocoder = new window.google.maps.Geocoder();
//             geocoder.geocode({ address }, (results, status) => {
//                 if (status === 'OK' && results?.[0]) {
//                     const location = results[0].geometry.location;
//                     const newPosition = {
//                         lat: location.lat(),
//                         lng: location.lng()
//                     };
//                     setMapCenter(newPosition);
//                     setMarkerPosition(newPosition);
//                     setFormData(prev => ({
//                         ...prev,
//                         latitude: newPosition.lat,
//                         longitude: newPosition.lng
//                     }));
//                 }
//             });
//         } catch (error) {
//             console.error("Geocoding error:", error);
//         }
//     }, []);
//
//     // Reverse Geocoding: Coordinates → Address
//     const reverseGeocode = useCallback(async (lat: number, lng: number) => {
//         if (!window.google) return;
//
//         setIsGeocodingFromMap(true);
//
//         try {
//             const geocoder = new window.google.maps.Geocoder();
//             const latlng = { lat, lng };
//
//             geocoder.geocode({ location: latlng }, (results, status) => {
//                 if (status === 'OK' && results?.[0]) {
//                     const address = results[0].formatted_address;
//
//                     // Update address field with geocoded address
//                     setFormData(prev => ({
//                         ...prev,
//                         address: address,
//                         latitude: lat,
//                         longitude: lng
//                     }));
//
//                     toast.success("მისამართი წარმატებით განახლდა");
//                 } else {
//                     toast.error("მისამართის მიღება ვერ მოხერხდა");
//                 }
//
//                 // Reset flag after a short delay
//                 setTimeout(() => setIsGeocodingFromMap(false), 500);
//             });
//         } catch (error) {
//             console.error("Reverse geocoding error:", error);
//             setIsGeocodingFromMap(false);
//         }
//     }, []);
//
//     // Handle map click - user clicks on map to set marker
//     const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
//         if (event.latLng) {
//             const lat = event.latLng.lat();
//             const lng = event.latLng.lng();
//
//             const newPosition = { lat, lng };
//             setMarkerPosition(newPosition);
//             setMapCenter(newPosition);
//
//             // Get address from coordinates
//             reverseGeocode(lat, lng);
//         }
//     }, [reverseGeocode]);
//
//     // Handle marker drag - user drags the marker
//     const handleMarkerDragEnd = useCallback((event: google.maps.MapMouseEvent) => {
//         if (event.latLng) {
//             const lat = event.latLng.lat();
//             const lng = event.latLng.lng();
//
//             const newPosition = { lat, lng };
//             setMarkerPosition(newPosition);
//             setMapCenter(newPosition);
//
//             // Get address from new coordinates
//             reverseGeocode(lat, lng);
//         }
//     }, [reverseGeocode]);
//
//     // Handle input change
//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//
//         if (errors[name]) {
//             setErrors(prev => ({ ...prev, [name]: "" }));
//         }
//     };
//
//     // Validate form
//     const validateForm = (): boolean => {
//         const newErrors: Record<string, string> = {};
//
//         if (!formData.name.trim()) {
//             newErrors.name = "სახელი და გვარი აუცილებელია";
//         }
//
//         if (!formData.phone.trim()) {
//             newErrors.phone = "ტელეფონი აუცილებელია";
//         }
//
//         // if (!formData.email.trim()) {
//         //     newErrors.email = "ელ-ფოსტა აუცილებელია";
//         // }
//
//         if (formData.delivery_method === "delivery" && !formData.address.trim()) {
//             newErrors.address = "მისამართი აუცილებელია მიტანისთვის";
//         }
//
//         if (!agreeTerms) {
//             newErrors.terms = "გთხოვთ დაეთანხმოთ წესებს და პირობებს";
//         }
//
//         if (items.length === 0) {
//             toast.error("კალათა ცარიელია");
//             return false;
//         }
//
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };
//
//     // Submit order
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//
//         if (!validateForm()) {
//             toast.error("გთხოვთ შეავსოთ ყველა სავალდებულო ველი");
//             return;
//         }
//
//         setLoading(true);
//
//         try {
//             const orderItems = items.map(item => ({
//                 product_id: item.product_id,
//                 name: item.name,
//                 quantity: item.quantity,
//                 price: item.price,
//                 color: item.color,
//                 size: item.size,
//                 materials: item.materials,
//                 print_type: item.print_type,
//                 extras: item.extras,
//                 custom_dimensions: item.custom_dimensions,
//                 uploaded_file: item.uploaded_file,
//             }));
//
//             const response = await axiosInstance.post("/orders", {
//                 name: formData.name,
//                 // email: formData.email,
//                 phone: formData.phone,
//                 city_id: formData.city_id,
//                 address: formData.delivery_method === "delivery" ? formData.address : "მე წავიღებ",
//                 latitude: formData.latitude,
//                 longitude: formData.longitude,
//                 notes: formData.notes,
//                 payment_method: "cash",
//                 items: orderItems,
//                 total: total,
//             });
//
//             if (response.data.success) {
//                 toast.success("შეკვეთა წარმატებით შეიქმნა!");
//                 await clearCart();
//                 router.push(`/order-success?order=${response.data.data.order_number}`);
//             }
//         } catch (error: any) {
//             console.error("Order error:", error);
//             toast.error(error.response?.data?.message || "შეკვეთის შექმნისას დაფიქსირდა შეცდომა");
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     // Handle city dropdown toggle
//     const handleCityToggle = (e: React.MouseEvent) => {
//         e.preventDefault();
//         e.stopPropagation();
//         setCityOpen(!cityOpen);
//     };
//
//     // Handle city selection
//     const handleCitySelect = (cityId: number) => {
//         setFormData(prev => ({ ...prev, city_id: cityId }));
//         setCityOpen(false);
//     };
//
//     // Handle map load
//     const handleMapLoad = () => {
//         setIsMapLoaded(true);
//     };
//
//     return (
//         <div data-aos="fade-up">
//             {/* Alert */}
//             {Object.keys(errors).length > 0 && (
//                 <div className={styles.errorBox}>
//                     <Alert
//                         className={"w-100"}
//                         message="ჩვენი სერვისით სარგებლობისთვის, გთხოვთ შეავსოთ ყველა ველი"
//                     />
//                 </div>
//             )}
//
//             {/* Form */}
//             <form onSubmit={handleSubmit}>
//                 <div className={styles.formWrapper}>
//                     {/* Name */}
//                     <TextField
//                         label="სახელი და გვარი"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleInputChange}
//                         placeholder="თქვენი სახელი და გვარი"
//                         className="title_font"
//                         error={errors.name}
//                         disabled={loading}
//                     />
//
//                     {/* Phone */}
//                     <TextField
//                         label="მობილური"
//                         name="phone"
//                         value={formData.phone}
//                         onChange={handleInputChange}
//                         placeholder="მიუთითეთ მობილური ტელეფონი"
//                         className="title_font"
//                         error={errors.phone}
//                         disabled={loading}
//                     />
//
//                     {/* Email */}
//                     {/*<TextField*/}
//                     {/*    label="ელ-ფოსტა"*/}
//                     {/*    name="email"*/}
//                     {/*    type="email"*/}
//                     {/*    value={formData.email}*/}
//                     {/*    onChange={handleInputChange}*/}
//                     {/*    placeholder="მიუთითეთ ელ-ფოსტა"*/}
//                     {/*    className="title_font"*/}
//                     {/*    error={errors.email}*/}
//                     {/*    disabled={loading}*/}
//                     {/*/>*/}
//
//                     {/* Delivery Method */}
//                     <div>
//                         <h5 className="fw-bolder">მიტანის მეთოდი</h5>
//                         <div>
//                             <TealCheckbox
//                                 label={'ადგილზე მიტანა'}
//                                 className={'title_font fw-bold'}
//                                 checked={formData.delivery_method === "delivery"}
//                                 onChange={() => setFormData(prev => ({
//                                     ...prev,
//                                     delivery_method: "delivery"
//                                 }))}
//                                 disabled={loading}
//                             />
//                         </div>
//                         <div>
//                             <TealCheckbox
//                                 label={'მე წავიღებ'}
//                                 className={'title_font fw-bold'}
//                                 checked={formData.delivery_method === "pickup"}
//                                 onChange={() => setFormData(prev => ({
//                                     ...prev,
//                                     delivery_method: "pickup"
//                                 }))}
//                                 disabled={loading}
//                             />
//                         </div>
//                     </div>
//
//                     {/* City Dropdown - Only show if delivery */}
//                     {formData.delivery_method === "delivery" && (
//                         <div className={styles.dropdown}>
//                             <label className="fw-bolder">ქალაქი</label>
//                             <button
//                                 className={styles.dropdownToggle}
//                                 onClick={handleCityToggle}
//                                 type="button"
//                                 disabled={loading || cities.length === 0}
//                             >
//                                 {cities.length === 0 ? "იტვირთება..." : selectedCityName}
//                                 <span className={styles.dropdownArrow}>▾</span>
//                             </button>
//                             {cityOpen && cities.length > 0 && (
//                                 <ul className={styles.dropdownMenu}>
//                                     {cities.map((city) => (
//                                         <li
//                                             key={city.id}
//                                             className={`${styles.dropdownItem} ${city.id === formData.city_id ? styles.active : ''}`}
//                                             onClick={() => handleCitySelect(city.id)}
//                                         >
//                                             {city.name}
//                                         </li>
//                                     ))}
//                                 </ul>
//                             )}
//                         </div>
//                     )}
//
//                     {/* Address - Only show if delivery */}
//                     {formData.delivery_method === "delivery" && (
//                         <TextField
//                             label="თქვენი მისამართი"
//                             name="address"
//                             value={formData.address}
//                             onChange={handleInputChange}
//                             placeholder="მისამართი"
//                             className="title_font"
//                             error={errors.address}
//                             disabled={loading}
//                         />
//                     )}
//
//                     {/* Notes Textarea */}
//                     <div>
//                         <label className="fw-bolder">დამატებითი დეტალები</label>
//                         <div>
//                             <Form.Control
//                                 as="textarea"
//                                 rows={3}
//                                 name="notes"
//                                 value={formData.notes}
//                                 onChange={handleInputChange}
//                                 placeholder="გთხოვთ მიუთითოთ სადარბაზო, სართული ან სხვა დამატებითი დეტალები"
//                                 className='text_font'
//                                 disabled={loading}
//                             />
//                         </div>
//                     </div>
//
//                     {/* Google Map - Only show if delivery */}
//                     {formData.delivery_method === "delivery" && (
//                         <div className={styles.mapContainer}>
//                             <label className="fw-bolder mb-2">
//                                 თქვენი მისამართი რუკაზე
//                                 <small className="d-block text-muted fw-normal mt-1">
//                                     რუკაზე დააწკაპუნეთ ან გადაიტანეთ მარკერი თქვენი ზუსტი მისამართისთვის
//                                 </small>
//                             </label>
//                             <LoadScript
//                                 googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
//                                 onLoad={handleMapLoad}
//                             >
//                                 <GoogleMap
//                                     mapContainerStyle={mapContainerStyle}
//                                     center={mapCenter}
//                                     zoom={15}
//                                     onClick={handleMapClick}
//                                     options={{
//                                         streetViewControl: false,
//                                         mapTypeControl: false,
//                                         fullscreenControl: true,
//                                     }}
//                                 >
//                                     <Marker
//                                         position={markerPosition}
//                                         draggable={true}
//                                         onDragEnd={handleMarkerDragEnd}
//                                     />
//                                 </GoogleMap>
//                             </LoadScript>
//                             {formData.latitude && formData.longitude && (
//                                 <small className="text-muted d-block mt-2">
//                                     კოორდინატები: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
//                                 </small>
//                             )}
//                         </div>
//                     )}
//
//                     {/* Terms Checkbox */}
//                     <div className={styles.checkboxWrapper}>
//                         <label
//                             htmlFor="terms"
//                             className="d-flex gap-1 align-items-center"
//                         >
//                             <TealCheckbox
//                                 className="text_font"
//                                 label={"ვეთანხმები პირობებს და პოლიტიკას"}
//                                 checked={agreeTerms}
//                                 onChange={(e) => setAgreeTerms(e.target.checked)}
//                                 disabled={loading}
//                             />
//                             <a href="#" className="text_font">
//                                 (წესები და პირობები)
//                             </a>
//                         </label>
//
//                     </div>
//                     {errors.terms && (
//                         <div className="text-danger small text_font">{errors.terms}</div>
//                     )}
//                     {/* Submit Button */}
//                     <div className="text-center">
//                         <Button
//                             size={"sm"}
//                             type={"submit"}
//                             variant={"my-btn-blue"}
//                             className={
//                                 "justify-content-center title_font fw-bolder w-100"
//                             }
//                             disabled={loading || cartLoading || items.length === 0}
//                         >
//                             {loading ? "დამუშავება..." : "შეკვეთის გაფორმება"}
//                         </Button>
//                     </div>
//                 </div>
//             </form>
//         </div>
//     );
// }