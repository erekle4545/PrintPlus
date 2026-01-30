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
import TermsModal from "@/shared/components/theme/modal/TermsModal";
import {useLanguage} from "@/context/LanguageContext";
import PayIcon from "../../../shared/assets/icons/order/order_cart_pay.svg";
import VisaIcon from "../../../shared/assets/icons/order/visa.svg";
import MasterCardIcon from "../../../shared/assets/icons/order/master_card.svg";
import AmexIcon from "../../../shared/assets/icons/order/amex.svg";
import Image from "next/image";

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
    const {t, currentLanguage} = useLanguage();

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
    const selectedCityName = cities.find(city => city.id === formData.city_id)?.name || t('checkout.tbilisi');

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
            toast.error(t('checkout.config.error'));
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
                    toast.success(t('checkout.address.updated'));
                } else {
                    toast.error(t('checkout.address.error'));
                }
                setTimeout(() => setIsGeocodingFromMap(false), 500);
            });
        } catch (error) {
            console.error("Reverse geocoding error:", error);
            setIsGeocodingFromMap(false);
        }
    }, [t]);

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
            newErrors.name = t('checkout.validation.name');
        }

        if (!formData.phone.trim()) {
            newErrors.phone = t('checkout.validation.phone');
        }

        if (formData.delivery_method === "delivery" && !formData.address.trim()) {
            newErrors.address = t('checkout.validation.address');
        }

        if (!agreeTerms) {
            newErrors.terms = t('checkout.validation.terms');
        }

        if (items.length === 0) {
            toast.error(t('checkout.validation.empty.cart'));
            return false;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * Check if selected payment method is card payment
     */
    const isCardPayment = (): boolean => {
        return ['card', 'bog_card', 'online'].includes(formData.payment_method);
    };

    // Calculate subtotal (total without delivery)
    const calculateSubtotal = (): number => {
        return items.reduce((sum, item) => {
            const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
            return sum + (price * item.quantity);
        }, 0);
    };

    // Calculate delivery cost (15 GEL for delivery, 0 for pickup)
    const calculateDeliveryCost = (): number => {
        return formData.delivery_method === "delivery" ? 0 : 0;
    };

    // Calculate discount if any
    const calculateDiscount = (): number => {
        // You can add discount logic here
        return 0;
    };

    // Parse custom dimensions from JSON string
    const parseCustomDimensions = (dimensionsStr: string | null): string[] => {
        if (!dimensionsStr) return [];
        try {
            return JSON.parse(dimensionsStr);
        } catch {
            return [];
        }
    };

    // Submit order
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error(t('checkout.validation.fill.all'));
            return;
        }

        setLoading(true);

        try {
            // Get cart IDs from items
            const cartIds = items.map(item => item.id);

            // Create order
            const response = await axiosInstance.post("/orders", {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                city_id: formData.city_id,
                address: formData.delivery_method === "delivery" ? formData.address : t('checkout.pickup.label'),
                latitude: formData.latitude,
                longitude: formData.longitude,
                notes: formData.notes,
                payment_method: formData.payment_method,
                cart_ids: cartIds,
                total: total,
            });

            if (response.data.success) {
                const orderData = response.data.data;

                // Clear cart
                await clearCart();

                // Check if card payment
                if (isCardPayment()) {
                    // Initialize BOG payment
                    try {
                        const paymentResponse = await axiosInstance.post('/payments/initialize', {
                            order_id: orderData.id,
                            language: currentLanguage?.code || 'ka',
                        });

                        if (paymentResponse.data.success && paymentResponse.data.payment_url) {
                            // Redirect to BOG payment page
                            toast.success(t('checkout.order.success'));
                            window.location.href = paymentResponse.data.payment_url;
                            return;
                        } else {
                            toast.warning('გადახდის ინიციალიზაცია ვერ მოხერხდა, გადახდა შეგიძლიათ შეკვეთის გვერდიდან');
                            router.push(`/${currentLanguage?.code}/order-success?order=${orderData.order_number}`);
                        }
                    } catch (paymentError: any) {
                        console.error('Payment initialization error:', paymentError);
                        toast.warning('გადახდის ინიციალიზაცია ვერ მოხერხდა, გადახდა შეგიძლიათ შეკვეთის გვერდიდან');
                        router.push(`/${currentLanguage?.code}/order-success?order=${orderData.order_number}`);
                    }
                } else {
                    // For cash/bank_transfer - go directly to success page
                    toast.success(t('checkout.order.success'));
                    router.push(`/${currentLanguage?.code}/order-success?order=${orderData.order_number}`);
                }
            }
        } catch (error: any) {
            console.error("Order error:", error);
            toast.error(error.response?.data?.message || t('checkout.order.error'));
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

    const subtotal = calculateSubtotal();
    const deliveryCost = calculateDeliveryCost();
    const discount = calculateDiscount();

    return (
        <>
            <div data-aos="fade-up">


                {/* Form */}
                <form onSubmit={handleSubmit} className={'row'}>
                    <div className={'col-xl-8'} data-aos="fade-right">
                        {/* Alert */}
                        {Object.keys(errors).length > 0 && (
                            <div className={styles.errorBox}>
                                <Alert
                                    className={"w-100"}
                                    message={t('checkout.alert.fill.fields')}
                                />
                            </div>
                        )}

                        <label className="fw-bold mb-3 title_font d-block fs-5">
                            {t('checkout.order.details','შეკვეთის დეტალები')}
                        </label>
                        {/* Name */}
                        <div className="mb-3">
                            <TextField
                                label={t('checkout.form.name.label')}
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder={t('checkout.form.name.placeholder')}
                                className="title_font"
                                error={errors.name}
                                disabled={loading}
                            />
                        </div>

                        {/* Phone */}
                        <div className="mb-3">
                            <TextField
                                label={t('checkout.form.phone.label')}
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder={t('checkout.form.phone.placeholder')}
                                className="title_font"
                                error={errors.phone}
                                disabled={loading}
                            />
                        </div>

                        {/* Delivery Method */}
                        <div className="mb-3">
                            <label className="fw-bold mb-2 title_font d-block">{t('checkout.delivery.method')}</label>
                            <div>
                                <TealCheckbox
                                    label={t('checkout.delivery.home')}
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
                                    label={t('checkout.delivery.pickup')}
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

                        {/* City Dropdown - Only show if delivery */}
                        {formData.delivery_method === "delivery" && (
                            <div className={`${styles.dropdown} mb-3`}>
                                <label className="fw-bold mb-2 title_font d-block">{t('checkout.form.city')}</label>
                                <button
                                    className={styles.dropdownToggle}
                                    onClick={handleCityToggle}
                                    type="button"
                                    disabled={loading || cities.length === 0}
                                >
                                    {cities.length === 0 ? t('checkout.loading') : selectedCityName}
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
                            <div className="mb-3">
                                <TextField
                                    label={t('checkout.form.address.label')}
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder={t('checkout.form.address.placeholder')}
                                    className="title_font"
                                    error={errors.address}
                                    disabled={loading}
                                />
                            </div>
                        )}

                        {/* Notes Textarea */}
                        <div className="mb-3">
                            <label className="fw-bold mb-2 title_font d-block">{t('checkout.form.notes.label')}</label>
                            <div>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    placeholder={t('checkout.form.notes.placeholder')}
                                    className='text_font'
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Google Map - Only show if delivery */}
                        {formData.delivery_method === "delivery" && (
                            <div className={`${styles.mapContainer} mb-3`}>
                                <label className="fw-bold mb-2 title_font d-block">
                                    {t('checkout.map.title')}
                                </label>
                                <small className="d-block text-muted mb-2 text_font">
                                    {t('checkout.map.instruction')}
                                </small>
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
                                        {t('checkout.map.coordinates')}: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                                    </small>
                                )}
                            </div>
                        )}
                    </div>

                    <div className={'col-xl-4 col-sm-12'} data-aos="fade-left">
                        {/* ORDER ITEMS SECTION */}
                        {items.length > 0 && (
                            <div className="mb-4">
                                <label className="fw-bold mb-3 title_font d-block fs-5">
                                    {t('checkout.order.items','შეკვეთილი პროდუქტები')}
                                </label>

                                {/* Cart Items List */}
                                <div className="border rounded p-3 mb-3" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                    {items.map((item, index) => {
                                        const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;

                                        return (
                                            <div
                                                key={item.id}
                                                className="d-flex gap-3 align-items-start mb-3 pb-3 border-bottom last:border-0"
                                                data-aos="fade-up"
                                                data-aos-delay={index * 50}
                                            >
                                                {/* Product Image */}
                                                {item.image && (
                                                    <div style={{ width: '80px', height: '80px', flexShrink: 0 }}>
                                                        <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            width={80}
                                                            height={80}
                                                            style={{ objectFit: 'cover', borderRadius: '8px' }}
                                                        />
                                                    </div>
                                                )}

                                                {/* Product Details */}
                                                <div className="flex-grow-1">
                                                    <h6 className="fw-bold mb-2 title_font">{item.name}</h6>

                                                    {/* Color */}
                                                    {item.color && (
                                                        <div className="text-muted small text_font mb-1">
                                                            <span className="fw-semibold">{t('checkout.color','ფერი')}:</span> {item.color}
                                                        </div>
                                                    )}

                                                    {/* Size */}
                                                    {item.size && (
                                                        <div className="text-muted small text_font mb-1">
                                                            <span className="fw-semibold">{t('checkout.size','ზომა')}:</span> {item.size}
                                                        </div>
                                                    )}

                                                    {/* Materials */}
                                                    {item.materials && (
                                                        <div className="text-muted small text_font mb-1">
                                                            <span className="fw-semibold">{t('checkout.materials','მასალა')}:</span> {item.materials}
                                                        </div>
                                                    )}

                                                    {/* Print Type */}
                                                    {item.print_type && (
                                                        <div className="text-muted small text_font mb-1">
                                                            <span className="fw-semibold">{t('checkout.print_type','ბეჭდვის ტიპი')}:</span> {item.print_type}
                                                        </div>
                                                    )}

                                                    {/* Extras */}
                                                    {item.extras && (
                                                        <div className="text-muted small text_font mb-1">
                                                            <span className="fw-semibold">{t('checkout.extras','დამატებითი')}:</span> {item.extras}
                                                        </div>
                                                    )}

                                                    {/* Quantity and Price */}
                                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                                        <span className="text-muted small text_font">
                                                            {t('checkout.quantity','რაოდენობა')}: {item.quantity}
                                                        </span>
                                                        <span className="fw-bold title_font">
                                                            {(price * item.quantity).toFixed(2)} ₾
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Price Summary */}
                                <div className="border rounded p-3 mb-3" data-aos="fade-up" data-aos-delay="100">
                                    {discount > 0 && (
                                        <div className="d-flex justify-content-between mb-2 text-success">
                                            <span className="text_font">{t('checkout.discount','ფასდაკლება')}:</span>
                                            <span className="fw-bold title_font">-{discount.toFixed(2)} ₾</span>
                                        </div>
                                    )}
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text_font">{t('checkout.delivery.price','მიწოდება')}:</span>
                                        <span className="fw-bold title_font">{deliveryCost.toFixed(2)} ₾</span>
                                    </div>

                                    <hr />

                                    <div className="d-flex justify-content-between">
                                        <span className="fw-bold title_font fs-5">{t('checkout.total.price','სულ ჯამი')}:</span>
                                        <span className="fw-bold title_font fs-5 text-primary">
                                            {total.toFixed(2)} ₾
                                        </span>
                                    </div>
                                </div>

                                {/* Payment Methods */}
                                <div className="mb-3" data-aos="fade-up" data-aos-delay="150">
                                    <label className="fw-bold mb-2 title_font d-block fs-6">{t('checkout.payment.method')}</label>
                                    {paymentMethods.map((method) => (
                                        <div key={method.id}>
                                            <TealCheckbox
                                                label={method.name}
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

                                {/* Card Payment Info */}
                                {isCardPayment() && (
                                    <div className="alert alert-light mb-3 small text_font" data-aos="fade-up" data-aos-delay="200">
                                        <strong>ბარათით გადახდა:</strong> შეკვეთის დადასტურების შემდეგ გადახვალთ უსაფრთხო გადახდის გვერდზე
                                    </div>
                                )}

                                {/* Card Logos */}
                                {isCardPayment() && (
                                    <div className={'d-flex justify-content-center align-items-center gap-3 p-2 mb-3'} data-aos="zoom-in" data-aos-delay="250">
                                        <VisaIcon/>
                                        <MasterCardIcon/>
                                        <AmexIcon/>
                                    </div>
                                )}

                                {/* Terms Checkbox */}
                                <div className="mb-3" data-aos="fade-up" data-aos-delay="300">
                                    <label
                                        htmlFor="terms"
                                        className="d-flex gap-1 align-items-center"
                                    >
                                        <TealCheckbox
                                            className="text_font"
                                            label={t('checkout.terms.agree')}
                                            checked={agreeTerms}
                                            onChange={(e) => setAgreeTerms(e.target.checked)}
                                            disabled={loading}
                                        />

                                        <div data-bs-toggle="modal" data-bs-target="#termsModal"
                                             className="fw-bolder text_font cursor-pointer text-primary">
                                            ({t('checkout.terms.link')})
                                        </div>
                                    </label>
                                    {errors.terms && (
                                        <div className="text-danger small text_font mt-1">{errors.terms}</div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div className="text-center" data-aos="fade-up" data-aos-delay="350">
                                    <Button
                                        size={"sm"}
                                        type={"submit"}
                                        variant={"my-btn-blue"}
                                        className={
                                            "justify-content-center title_font fw-bolder w-100"
                                        }
                                        disabled={loading || cartLoading || items.length === 0}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" />
                                                {isCardPayment() ? 'გადახდის გვერდზე გადასვლა...' : t('checkout.button.processing')}
                                            </>
                                        ) : (
                                            isCardPayment() ?
                                                <div className={'d-flex gap-2 justify-content-center align-items-center'}>
                                                    <PayIcon/>  {t('checkout.payment')}
                                                </div>:
                                                t('checkout.button.submit')
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </div>
            <TermsModal id="termsModal" type={6} />
        </>
    );
}
//
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
// import TermsModal from "@/shared/components/theme/modal/TermsModal";
// import {useLanguage} from "@/context/LanguageContext";
// import PayIcon from "../../../shared/assets/icons/order/order_cart_pay.svg";
// import VisaIcon from "../../../shared/assets/icons/order/visa.svg";
// import MasterCardIcon from "../../../shared/assets/icons/order/master_card.svg";
// import AmexIcon from "../../../shared/assets/icons/order/amex.svg";
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
//     lat: 41.7151,
//     lng: 44.8271
// };
//
// // Interfaces
// interface City {
//     id: number;
//     key: string;
//     name: string;
// }
//
// interface PaymentMethod {
//     id: string;
//     key: string;
//     name: string;
//     icon: string;
// }
//
// export default function CheckoutForm() {
//     const router = useRouter();
//     const { items, total, clearCart, loading: cartLoading } = useCart();
//     const {t, currentLanguage} = useLanguage();
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
//         payment_method: "cash",
//         latitude: null as number | null,
//         longitude: null as number | null,
//     });
//
//     // UI State
//     const [cityOpen, setCityOpen] = useState(false);
//     const [cities, setCities] = useState<City[]>([]);
//     const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
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
//     // Load config from backend
//     useEffect(() => {
//         loadConfig();
//     }, []);
//
//     // Get selected city name for display
//     const selectedCityName = cities.find(city => city.id === formData.city_id)?.name || t('checkout.tbilisi');
//
//     // Geocode address when user types
//     useEffect(() => {
//         if (formData.address && selectedCityName && isMapLoaded && !isGeocodingFromMap) {
//             const timer = setTimeout(() => {
//                 geocodeAddress(`${formData.address}, ${selectedCityName}, Georgia`);
//             }, 1000);
//
//             return () => clearTimeout(timer);
//         }
//     }, [formData.address, formData.city_id, selectedCityName, isMapLoaded, isGeocodingFromMap]);
//
//     const loadConfig = async () => {
//         try {
//             const response = await axiosInstance.get("/config/checkout");
//
//             if (response.data) {
//                 if (Array.isArray(response.data.cities)) {
//                     setCities(response.data.cities);
//                     const tbilisi = response.data.cities.find((city: City) => city.key === "tbilisi");
//                     if (tbilisi) {
//                         setFormData(prev => ({ ...prev, city_id: tbilisi.id }));
//                     }
//                 }
//
//                 if (Array.isArray(response.data.paymentMethods)) {
//                     setPaymentMethods(response.data.paymentMethods);
//                 }
//             }
//         } catch (error) {
//             console.error("Error loading config:", error);
//             toast.error(t('checkout.config.error'));
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
//                     setFormData(prev => ({
//                         ...prev,
//                         address: address,
//                         latitude: lat,
//                         longitude: lng
//                     }));
//                     toast.success(t('checkout.address.updated'));
//                 } else {
//                     toast.error(t('checkout.address.error'));
//                 }
//                 setTimeout(() => setIsGeocodingFromMap(false), 500);
//             });
//         } catch (error) {
//             console.error("Reverse geocoding error:", error);
//             setIsGeocodingFromMap(false);
//         }
//     }, [t]);
//
//     // Handle map click
//     const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
//         if (event.latLng) {
//             const lat = event.latLng.lat();
//             const lng = event.latLng.lng();
//             const newPosition = { lat, lng };
//             setMarkerPosition(newPosition);
//             setMapCenter(newPosition);
//             reverseGeocode(lat, lng);
//         }
//     }, [reverseGeocode]);
//
//     // Handle marker drag
//     const handleMarkerDragEnd = useCallback((event: google.maps.MapMouseEvent) => {
//         if (event.latLng) {
//             const lat = event.latLng.lat();
//             const lng = event.latLng.lng();
//             const newPosition = { lat, lng };
//             setMarkerPosition(newPosition);
//             setMapCenter(newPosition);
//             reverseGeocode(lat, lng);
//         }
//     }, [reverseGeocode]);
//
//     // Handle input change
//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
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
//             newErrors.name = t('checkout.validation.name');
//         }
//
//         if (!formData.phone.trim()) {
//             newErrors.phone = t('checkout.validation.phone');
//         }
//
//         if (formData.delivery_method === "delivery" && !formData.address.trim()) {
//             newErrors.address = t('checkout.validation.address');
//         }
//
//         if (!agreeTerms) {
//             newErrors.terms = t('checkout.validation.terms');
//         }
//
//         if (items.length === 0) {
//             toast.error(t('checkout.validation.empty.cart'));
//             return false;
//         }
//
//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };
//
//     /**
//      * Check if selected payment method is card payment
//      */
//     const isCardPayment = (): boolean => {
//         return ['card', 'bog_card', 'online'].includes(formData.payment_method);
//     };
//
//     // Submit order
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//
//         if (!validateForm()) {
//             toast.error(t('checkout.validation.fill.all'));
//             return;
//         }
//
//         setLoading(true);
//
//         try {
//             // Get cart IDs from items
//             const cartIds = items.map(item => item.id);
//
//             // Create order
//             const response = await axiosInstance.post("/orders", {
//                 name: formData.name,
//                 email: formData.email,
//                 phone: formData.phone,
//                 city_id: formData.city_id,
//                 address: formData.delivery_method === "delivery" ? formData.address : t('checkout.pickup.label'),
//                 latitude: formData.latitude,
//                 longitude: formData.longitude,
//                 notes: formData.notes,
//                 payment_method: formData.payment_method,
//                 cart_ids: cartIds,
//                 total: total,
//             });
//
//             if (response.data.success) {
//                 const orderData = response.data.data;
//
//                 // Clear cart
//                 await clearCart();
//
//                 // Check if card payment
//                 if (isCardPayment()) {
//                     // Initialize BOG payment
//                     try {
//                         const paymentResponse = await axiosInstance.post('/payments/initialize', {
//                             order_id: orderData.id,
//                             language: currentLanguage?.code || 'ka',
//                         });
//
//                         if (paymentResponse.data.success && paymentResponse.data.payment_url) {
//                             // Redirect to BOG payment page
//                             toast.success(t('checkout.order.success'));
//                             window.location.href = paymentResponse.data.payment_url;
//                             return; // Stop further execution
//                         } else {
//                             // Payment initialization failed - redirect to order page with error
//                             toast.warning('გადახდის ინიციალიზაცია ვერ მოხერხდა, გადახდა შეგიძლიათ შეკვეთის გვერდიდან');
//                             router.push(`/${currentLanguage?.code}/order-success?order=${orderData.order_number}`);
//                         }
//                     } catch (paymentError: any) {
//                         console.error('Payment initialization error:', paymentError);
//                         toast.warning('გადახდის ინიციალიზაცია ვერ მოხერხდა, გადახდა შეგიძლიათ შეკვეთის გვერდიდან');
//                         router.push(`/${currentLanguage?.code}/order-success?order=${orderData.order_number}`);
//                     }
//                 } else {
//                     // For cash/bank_transfer - go directly to success page
//                     toast.success(t('checkout.order.success'));
//                     router.push(`/${currentLanguage?.code}/order-success?order=${orderData.order_number}`);
//                 }
//             }
//         } catch (error: any) {
//             console.error("Order error:", error);
//             toast.error(error.response?.data?.message || t('checkout.order.error'));
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
//         <>
//             <div data-aos="fade-up">
//                 {/* Alert */}
//                 {Object.keys(errors).length > 0 && (
//                     <div className={styles.errorBox}>
//                         <Alert
//                             className={"w-100"}
//                             message={t('checkout.alert.fill.fields')}
//                         />
//                     </div>
//                 )}
//
//                 {/* Form */}
//                 <form onSubmit={handleSubmit}>
//                     <div className={styles.formWrapper}>
//                         {/* Name */}
//                         <TextField
//                             label={t('checkout.form.name.label')}
//                             name="name"
//                             value={formData.name}
//                             onChange={handleInputChange}
//                             placeholder={t('checkout.form.name.placeholder')}
//                             className="title_font"
//                             error={errors.name}
//                             disabled={loading}
//                         />
//
//                         {/* Phone */}
//                         <TextField
//                             label={t('checkout.form.phone.label')}
//                             name="phone"
//                             value={formData.phone}
//                             onChange={handleInputChange}
//                             placeholder={t('checkout.form.phone.placeholder')}
//                             className="title_font"
//                             error={errors.phone}
//                             disabled={loading}
//                         />
//
//                         {/* Delivery Method */}
//                         <div>
//                             <h5 className="fw-bolder">{t('checkout.delivery.method')}</h5>
//                             <div>
//                                 <TealCheckbox
//                                     label={t('checkout.delivery.home')}
//                                     className={'title_font fw-bold'}
//                                     checked={formData.delivery_method === "delivery"}
//                                     onChange={() => setFormData(prev => ({
//                                         ...prev,
//                                         delivery_method: "delivery"
//                                     }))}
//                                     disabled={loading}
//                                 />
//                             </div>
//                             <div>
//                                 <TealCheckbox
//                                     label={t('checkout.delivery.pickup')}
//                                     className={'title_font fw-bold'}
//                                     checked={formData.delivery_method === "pickup"}
//                                     onChange={() => setFormData(prev => ({
//                                         ...prev,
//                                         delivery_method: "pickup"
//                                     }))}
//                                     disabled={loading}
//                                 />
//                             </div>
//                         </div>
//
//                         {/* City Dropdown - Only show if delivery */}
//                         {formData.delivery_method === "delivery" && (
//                             <div className={styles.dropdown}>
//                                 <label className="fw-bolder">{t('checkout.form.city')}</label>
//                                 <button
//                                     className={styles.dropdownToggle}
//                                     onClick={handleCityToggle}
//                                     type="button"
//                                     disabled={loading || cities.length === 0}
//                                 >
//                                     {cities.length === 0 ? t('checkout.loading') : selectedCityName}
//                                     <span className={styles.dropdownArrow}>▾</span>
//                                 </button>
//                                 {cityOpen && cities.length > 0 && (
//                                     <ul className={styles.dropdownMenu}>
//                                         {cities.map((city) => (
//                                             <li
//                                                 key={city.id}
//                                                 className={`${styles.dropdownItem} ${city.id === formData.city_id ? styles.active : ''}`}
//                                                 onClick={() => handleCitySelect(city.id)}
//                                             >
//                                                 {city.name}
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 )}
//                             </div>
//                         )}
//
//                         {/* Address - Only show if delivery */}
//                         {formData.delivery_method === "delivery" && (
//                             <TextField
//                                 label={t('checkout.form.address.label')}
//                                 name="address"
//                                 value={formData.address}
//                                 onChange={handleInputChange}
//                                 placeholder={t('checkout.form.address.placeholder')}
//                                 className="title_font"
//                                 error={errors.address}
//                                 disabled={loading}
//                             />
//                         )}
//
//                         {/* Notes Textarea */}
//                         <div>
//                             <label className="fw-bolder">{t('checkout.form.notes.label')}</label>
//                             <div>
//                                 <Form.Control
//                                     as="textarea"
//                                     rows={3}
//                                     name="notes"
//                                     value={formData.notes}
//                                     onChange={handleInputChange}
//                                     placeholder={t('checkout.form.notes.placeholder')}
//                                     className='text_font'
//                                     disabled={loading}
//                                 />
//                             </div>
//                         </div>
//
//                         {/* Google Map - Only show if delivery */}
//                         {formData.delivery_method === "delivery" && (
//                             <div className={styles.mapContainer}>
//                                 <label className="fw-bolder mb-2">
//                                     {t('checkout.map.title')}
//                                     <small className="d-block text-muted fw-normal mt-1">
//                                         {t('checkout.map.instruction')}
//                                     </small>
//                                 </label>
//                                 <LoadScript
//                                     googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
//                                     onLoad={handleMapLoad}
//                                 >
//                                     <GoogleMap
//                                         mapContainerStyle={mapContainerStyle}
//                                         center={mapCenter}
//                                         zoom={15}
//                                         onClick={handleMapClick}
//                                         options={{
//                                             streetViewControl: false,
//                                             mapTypeControl: false,
//                                             fullscreenControl: true,
//                                         }}
//                                     >
//                                         <Marker
//                                             position={markerPosition}
//                                             draggable={true}
//                                             onDragEnd={handleMarkerDragEnd}
//                                         />
//                                     </GoogleMap>
//                                 </LoadScript>
//                                 {formData.latitude && formData.longitude && (
//                                     <small className="text-muted d-block mt-2">
//                                         {t('checkout.map.coordinates')}: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
//                                     </small>
//                                 )}
//                             </div>
//                         )}
//
//                         {/* Payment Methods */}
//                         <div>
//                             <h5 className="fw-bolder">{t('checkout.payment.method')}</h5>
//                             {paymentMethods.map((method) => (
//                                 <div key={method.id}>
//                                     <TealCheckbox
//                                         label={method.name}
//                                         className={'title_font fw-bold'}
//                                         checked={formData.payment_method === method.id}
//                                         onChange={() => setFormData(prev => ({
//                                             ...prev,
//                                             payment_method: method.id
//                                         }))}
//                                         disabled={loading}
//                                     />
//                                 </div>
//                             ))}
//                         </div>
//
//                         {/* Card Payment Info */}
//                         {isCardPayment() && (
//                             <div className="alert alert-light m-0 small text_font">
//                                 <strong> ბარათით გადახდა:</strong> შეკვეთის დადასტურების შემდეგ გადახვალთ უსაფრთხო გადახდის გვერდზე
//                             </div>
//                         )}
//
//                         {/* Terms Checkbox */}
//                         <div className={styles.checkboxWrapper}>
//                             <label
//                                 htmlFor="terms"
//                                 className="d-flex gap-1 align-items-center"
//                             >
//                                 <TealCheckbox
//                                     className="text_font"
//                                     label={t('checkout.terms.agree')}
//                                     checked={agreeTerms}
//                                     onChange={(e) => setAgreeTerms(e.target.checked)}
//                                     disabled={loading}
//                                 />
//
//                                 <div data-bs-toggle="modal" data-bs-target="#termsModal"
//                                      className="fw-bolder text_font cursor-pointer">
//                                     ({t('checkout.terms.link')})
//                                 </div>
//                             </label>
//                         </div>
//                         {errors.terms && (
//                             <div className="text-danger small text_font">{errors.terms}</div>
//                         )}
//
//                         {isCardPayment() &&<div className={'d-flex justify-content-center align-items-center gap-3 p-2'}>
//                             <VisaIcon/>
//                             <MasterCardIcon/>
//                             <AmexIcon/>
//                         </div>}
//                         {/* Submit Button */}
//                         <div className="text-center">
//                             <Button
//                                 size={"sm"}
//                                 type={"submit"}
//                                 variant={"my-btn-blue"}
//                                 className={
//                                     "justify-content-center title_font fw-bolder w-100"
//                                 }
//                                 disabled={loading || cartLoading || items.length === 0}
//                             >
//                                 {loading ? (
//                                     <>
//                                         <span className="spinner-border spinner-border-sm me-2" />
//                                         {isCardPayment() ? 'გადახდის გვერდზე გადასვლა...' : t('checkout.button.processing')}
//                                     </>
//                                 ) : (
//                                         isCardPayment() ?
//                                             <div className={'d-flex gap-2 justify-content-center align-items-center'}>
//                                                 <PayIcon/>  {t('checkout.payment')}
//                                             </div>:
//                                             t('checkout.button.submit')
//
//                                 )}
//                             </Button>
//                         </div>
//                     </div>
//                 </form>
//             </div>
//             <TermsModal id="termsModal" type={6} />
//         </>
//     );
// }