"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/shared/hooks/useCart";
import { axiosInstance } from "@/shared/hooks/useHttp";
import { toast } from "react-toastify";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import styles from "../../[lang]/profile/Profile.module.css";
import { HeaderTitle } from "@/shared/components/theme/page/components/headerTitle";
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
    lat: 41.7151, // თბილისი
    lng: 44.8271
};

export default function CheckoutForm() {
    const router = useRouter();
    const { items, total, clearCart, loading: cartLoading } = useCart();

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        city: "თბილისი",
        address: "",
        notes: "",
        delivery_method: "delivery", // delivery or pickup
    });

    // UI State
    const [cityOpen, setCityOpen] = useState(false);
    const [cities, setCities] = useState<string[]>([]);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Map State
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [markerPosition, setMarkerPosition] = useState(defaultCenter);

    // Load cities from backend
    useEffect(() => {
        loadCities();
    }, []);

    // Geocode address when it changes
    useEffect(() => {
        if (formData.address && formData.city) {
            geocodeAddress(`${formData.address}, ${formData.city}, Georgia`);
        }
    }, [formData.address, formData.city]);

    const loadCities = async () => {
        try {
            const response = await axiosInstance.get("/config/cities");
            if (response.data.success) {
                setCities(response.data.data || []);
            }
        } catch (error) {
            console.error("Error loading cities:", error);
            // Fallback
            setCities(["თბილისი", "ბათუმი", "ქუთაისი", "ზუგდიდი"]);
        }
    };

    // Geocode address to get coordinates
    const geocodeAddress = useCallback(async (address: string) => {
        if (!address.trim()) return;

        try {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ address }, (results, status) => {
                if (status === 'OK' && results?.[0]) {
                    const location = results[0].geometry.location;
                    const newPosition = {
                        lat: location.lat(),
                        lng: location.lng()
                    };
                    setMapCenter(newPosition);
                    setMarkerPosition(newPosition);
                }
            });
        } catch (error) {
            console.error("Geocoding error:", error);
        }
    }, []);

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

        if (!formData.email.trim()) {
            newErrors.email = "ელ-ფოსტა აუცილებელია";
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
            const orderItems = items.map(item => ({
                product_id: item.product_id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                color: item.color,
                size: item.size,
                materials: item.materials,
                print_type: item.print_type,
                extras: item.extras,
                custom_dimensions: item.custom_dimensions,
                uploaded_file: item.uploaded_file,
            }));

            const response = await axiosInstance.post("/web/orders", {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                city: formData.city,
                address: formData.delivery_method === "delivery" ? formData.address : "მე წავიღებ",
                notes: formData.notes,
                payment_method: "cash",
                items: orderItems,
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

                    {/* Email */}
                    <TextField
                        label="ელ-ფოსტა"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="მიუთითეთ ელ-ფოსტა"
                        className="title_font"
                        error={errors.email}
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

                    {/* City Dropdown - Only show if delivery */}
                    {formData.delivery_method === "delivery" && (
                        <div className={styles.dropdown}>
                            <label className="fw-bolder">ქალაქი</label>
                            <button
                                className={styles.dropdownToggle}
                                onClick={() => setCityOpen(!cityOpen)}
                                type="button"
                                disabled={loading}
                            >
                                {formData.city} <span className={styles.dropdownArrow}>▾</span>
                            </button>
                            {cityOpen && (
                                <ul className={styles.dropdownMenu}>
                                    {cities.map((city) => (
                                        <li
                                            key={city}
                                            className={styles.dropdownItem}
                                            onClick={() => {
                                                setFormData(prev => ({ ...prev, city }));
                                                setCityOpen(false);
                                            }}
                                        >
                                            {city}
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

                    {/* Google Map - Only show if delivery and address entered */}
                    {formData.delivery_method === "delivery" && formData.address && (
                        <div className={styles.mapContainer}>
                            <label className="fw-bolder mb-2">თქვენი მისამართი რუკაზე</label>
                            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
                                <GoogleMap
                                    mapContainerStyle={mapContainerStyle}
                                    center={mapCenter}
                                    zoom={15}
                                >
                                    <Marker
                                        position={markerPosition}
                                        animation={google.maps.Animation.DROP}
                                    />
                                </GoogleMap>
                            </LoadScript>
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
                        {errors.terms && (
                            <div className="text-danger small mt-1">{errors.terms}</div>
                        )}
                    </div>

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
// import React, { useState } from "react";
// import styles from "../../[lang]/profile/Profile.module.css";
// import { HeaderTitle } from "@/shared/components/theme/page/components/headerTitle";
// import TextField from "@/shared/components/ui/textfield/Textfield";
// import { Alert } from "@/shared/components/ui/alert/alert";
// import TealCheckbox from "@/shared/components/ui/tealCheckbox/tealCheckbox";
// import Button from "@/shared/components/ui/button/Button";
// import {Form} from "react-bootstrap";
//
// export default function CheckoutForm() {
//     const [cityOpen, setCityOpen] = useState(false);
//
//     const [city, setCity] = useState("თბილისი");
//
//     const cityOptions = ["თბილისი", "ბათუმი", "ქუთაისი", "ზუგდიდი"];
//
//     return (
//         <div data-aos="fade-up">
//
//             {/* Alert */}
//             <div className={styles.errorBox}>
//                 <Alert
//                     className={"w-100"}
//                     message="ჩვენი სერვისით სარგებლობისთვის, გთხოვთ შეავსოთ ყველა ველი"
//                 />
//             </div>
//
//             {/* Form */}
//             <div className={styles.formWrapper}>
//                 <TextField
//                     label="სახელი და გვარი"
//                     placeholder="თქვენი სახელი და გვარი"
//                     className="title_font"
//                 />
//                 <TextField
//                     label="მობილური"
//                     placeholder="მიუთითეთ მობილური ტელეფონი"
//                     className="title_font"
//                 />
//                 <TextField
//                     label="ელ-ფოსტა"
//                     placeholder="მიუთითეთ ელ-ფოსტა"
//                     className="title_font"
//                 />
//                 <div>
//                     <h5 className=" fw-bolder">მიტანის მეთოდი</h5>
//                     <div>
//                         <TealCheckbox
//                             label={'ადგილზე მიტანა'}
//                             className={'title_font fw-bold'}
//                             // checked={''}
//                             onChange={() =>''}
//                         />
//                     </div>
//                     <div>
//                         <TealCheckbox
//                             label={'მე წავიღებ'}
//                             className={'title_font fw-bold'}
//                             // checked={''}
//                             onChange={() =>''}
//                         />
//                     </div>
//                 </div>
//                 {/* Dropdown */}
//                 <div className={styles.dropdown}>
//                     <label className=" fw-bolder">ქალაქი</label>
//                     <button
//                         className={styles.dropdownToggle}
//                         onClick={() => setCityOpen(!cityOpen)}
//                         type="button"
//                     >
//                         {city} <span className={styles.dropdownArrow}>▾</span>
//                     </button>
//                     {cityOpen && (
//                         <ul className={styles.dropdownMenu}>
//                             {cityOptions.map((option) => (
//                                 <li
//                                     key={option}
//                                     className={styles.dropdownItem}
//                                     onClick={() => {
//                                         setCity(option);
//                                         setCityOpen(false);
//                                     }}
//                                 >
//                                     {option}
//                                 </li>
//                             ))}
//                         </ul>
//                     )}
//                 </div>
//
//                 <TextField
//                     label="თქვენი მისამართი"
//                     placeholder="მისამართი"
//                     className="title_font"
//                 />
//                 <div>
//                     <label className=" fw-bolder">დეტალები</label>
//                     <div>
//                         <Form.Control
//                             as="textarea"
//                             rows={3}
//                             placeholder="გთხოვთ მიუთითოთ სადარბაზო, სართული ან სხვა დამატებითი დეტალები"
//                             // value={comment}
//                             className='text_font'
//                             // onChange={(e) => setComment(e.target.value)}
//                          />
//                     </div>
//                 </div>
//                 {/* Checkbox */}
//                 <div className={styles.checkboxWrapper}>
//                     <label
//                         htmlFor="terms"
//                         className="d-flex gap-1 align-items-center"
//                     >
//                         <TealCheckbox
//                             className="text_font"
//                             label={"ვეთანხმები პირობებს და პოლიტიკას"}
//                         />
//                         <a href="#" className="text_font">
//                             (წესები და პირობები)
//                         </a>
//                     </label>
//                 </div>
//
//                 {/* Button */}
//                 <div className="text-center">
//                     <Button
//                         size={"sm"}
//                         type={"button"}
//                         variant={"my-btn-blue"}
//                         className={
//                             "justify-content-center title_font fw-bolder w-100"
//                         }
//                     >
//                         შენახვა
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     );
// }
