'use client';

import Cover from "@/shared/components/theme/header/cover/cover";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { Form } from "react-bootstrap";
import TealCheckbox from "@/shared/components/ui/tealCheckbox/tealCheckbox";
import { HeaderTitle } from "@/shared/components/theme/page/components/headerTitle";
import CheckIcon from '@/shared/assets/icons/check/check.svg';
import InfoIcon from '@/shared/assets/icons/info/info.svg';
import FileUploader from "@/shared/components/ui/uploader/FileUploader";
import OrderSidebar from "@/shared/components/ui/orderSidebar/OrderSidebar";
import { Product } from "@/types/product/productTypes";
import { getImageUrl } from "@/shared/utils/imageHelper";
import { useCart } from "@/shared/hooks/useCart";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useFileUpload } from "@/shared/hooks/file/useFileUpload";
import { useLanguage } from "@/context/LanguageContext";

interface BrandPageDetailsProps {
    product: Product;
}

export default function BrandPageDetails({ product }: BrandPageDetailsProps) {
    const router = useRouter();
    const { addItem, loading: cartLoading } = useCart();
    const { t } = useLanguage();

    const {
        uploadedFiles,
        addFiles,
        deleteFile,
        getCoverData,
        isDeleting
    } = useFileUpload();

    // Product-დან მონაცემების ამოღება - product_attributes-დან თუ არსებობს
    const sizes = product.product_attributes?.sizes || product.sizes || [];
    const materials = product.product_attributes?.materials || product.materials || [];
    const printTypes = product.product_attributes?.print_types || product.print_types || [];
    const extras = product.product_attributes?.extras || product.extras || [];

    const [selectedMaterial, setSelectedMaterial] = useState<number | null>(null);
    const [selectedSize, setSelectedSize] = useState<number | null>(null);
    // const [selectedExtras, setSelectedExtras] = useState<number[]>([]);
    // const [selectedPrintTypes, setSelectedPrintTypes] = useState<number[]>([]);
    const [selectedExtra, setSelectedExtra] = useState<number | null>(null);
    const [selectedPrintType, setSelectedPrintType] = useState<number | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [comment, setComment] = useState<string>("");
    const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);

    const hasProcessedFiles = useRef(false);

    useEffect(() => {
        if (materials && materials.length > 0 && selectedMaterial === null) {
            setSelectedMaterial(materials[0].id);
        }
        if (sizes && sizes.length > 0 && selectedSize === null) {
            setSelectedSize(sizes[0].id);
        }
        if (extras && extras.length > 0 && selectedExtra === null) {
            setSelectedExtra(extras[0].id);
        }
        if (printTypes && printTypes.length > 0 && selectedPrintType === null) {
            setSelectedPrintType(printTypes[0].id);
        }
    }, [materials, sizes, extras, printTypes, selectedMaterial, selectedSize,selectedExtra, selectedPrintType]);

    const calculatePrice = () => {
        let total = Number(product.sale_price || product.price || 0);

        if (selectedMaterial) {
            const material = materials?.find(m => m.id === selectedMaterial);
            if (material && material.base_price) {
                total += Number(material.base_price);
            }
        }

        if (selectedSize) {
            const size = sizes?.find(s => s.id === selectedSize);
            if (size && size.base_price) {
                total += Number(size.base_price);
            }
        }

        if (selectedExtra) {
            const extra = extras?.find(e => e.id === selectedExtra);
            if (extra?.base_price) {
                total += Number(extra.base_price);
            }
        }

        if (selectedPrintType) {
            const printType = printTypes?.find(pt => pt.id === selectedPrintType);
            if (printType?.base_price) {
                total += Number(printType.base_price);
            }
        }

        return total;
    };

    const price = calculatePrice();

    const getExtrasArray = () => {
        const extrasArr: string[] = [];

        if (selectedMaterial) {
            const material = materials?.find(m => m.id === selectedMaterial);
            if (material) extrasArr.push(`${t('material')}: ${material.name}`);
        }

        if (selectedSize) {
            const size = sizes?.find(s => s.id === selectedSize);
            if (size) extrasArr.push(`${t('size')}: ${size.name}`);
        }

        if (selectedExtra) {
            const extra = extras?.find(e => e.id === selectedExtra);
            if (extra) extrasArr.push(extra.name);
        }

        if (selectedPrintType) {
            const printType = printTypes?.find(pt => pt.id === selectedPrintType);
            if (printType) extrasArr.push(printType.name);
        }

        return extrasArr;
    };

    const handleFileUploadComplete = (items: any[]) => {
        if (hasProcessedFiles.current) {
            return;
        }

        // console.log("✅ Upload complete:", items);

        const files = items
            .filter(item => item.status === 'done' && item.uploadedFileId)
            .map(item => ({
                file_id: item.uploadedFileId,
                url: item.response?.url || item.response?.data?.url || '',
                name: item.name || 'file',
                quantity: item.quantity || 1,
                cover_type: 'image'
            }));

        if (files.length > 0) {
            hasProcessedFiles.current = true;
            addFiles(files);
            toast.success(t('files_uploaded_count' ));
        }
    };

    const handleAddToCart = async () => {
        if (!selectedMaterial && materials && materials.length > 0) {
            toast.warning(t('please_select_material'));
            return;
        }

        if (!selectedSize && sizes && sizes.length > 0) {
            toast.warning(t('please_select_size'));
            return;
        }

        const size = sizes?.find(s => s.id === selectedSize);

        const selectedExtrasData: string[] = selectedExtra
            ? extras
            ?.filter(e => e.id === selectedExtra)
            .map(e => e.name) || []
            : [];

        const material = materials?.find(m => m.id === selectedMaterial);
        const coverData = getCoverData();

        setIsAddingToCart(true);

        try {
            await addItem({
                id: Date.now(),
                product_id: product.id,
                name: product.info.name,
                price: price,
                quantity: quantity,
                image: product.info.covers && product.info.covers.length > 0
                    ? getImageUrl(product.info.covers[0].output_path)
                    : undefined,
                discount: product.sale_price || undefined,
                materials: material?.name,
                extras: selectedExtrasData,
                size: size?.name,
                custom_dimensions: getExtrasArray(),
                uploaded_file: coverData.uploaded_file,
                cover_id: coverData.cover_ids,
                cover_type: coverData.cover_types,
            });

            toast.success(t('product_added_to_cart'));

            if (uploadedFiles.length > 0) {
                // console.log('Order created with files:', {
                //     product_id: product.id,
                //     cover_ids: coverData.cover_ids,
                //     cover_types: coverData.cover_types,
                //     files_count: uploadedFiles.length
                // });
            }

        } catch (error) {
            console.error('❌ Error adding to cart:', error);
            toast.error(t('error_adding_product'));
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleOrderClick = async () => {
        await handleAddToCart();

        if (!isAddingToCart) {
            setTimeout(() => {
                router.push('/cart');
            }, 500);
        }
    };


    const handleFileUploadError = (items: any[]) => {
        console.error("❌ Upload error:", items);
        toast.error(t('file_upload_error'));
    };

    const handleRemoveFile = async (fileId: number, index: number) => {
        const success = await deleteFile(fileId, index);

        if (success && uploadedFiles.length === 1) {
            hasProcessedFiles.current = false;
        }
    };

    return (
        <>
            <Cover />
            <div className="container py-4" data-aos={"fade-up"}>
                <HeaderTitle title={product.info.name} slug={product.info.slug} />
                <div className="row">
                    <div className="col-12 col-md-8 col-lg-9">
                        <div className='section-brands p-4'>
                            {/* Materials */}
                            {materials && materials.length > 0 && (
                                <>
                                    <h5 className="mb-3 fw-bolder">{t('select_material')}</h5>
                                    <div className="row">
                                        {materials.map((material) => {
                                            const isSelected = selectedMaterial === material.id;
                                            const materialImage = material.covers && material.covers.length > 0
                                                ? material.covers[0]
                                                : null;

                                            return (
                                                <div className="col-6 col-md-3 mb-4" key={material.id}>
                                                    <div
                                                        role="button"
                                                        tabIndex={0}
                                                        onClick={() => setSelectedMaterial(material.id)}
                                                        onKeyDown={(e) =>
                                                            (e.key === "Enter" || e.key === " ") && setSelectedMaterial(material.id)
                                                        }
                                                        className={`product-card text-center p-2 ${isSelected ? "is-selected" : ""}`}
                                                        aria-pressed={isSelected}
                                                    >
                                                        <div className="thumb">
                                                            {materialImage ? (
                                                                <Image
                                                                    src={getImageUrl(materialImage.output_path)}
                                                                    alt={material.name}
                                                                    fill
                                                                    sizes="(max-width: 768px) 50vw, 25vw"
                                                                    className="thumb-img"
                                                                />
                                                            ) : (
                                                                <div className="thumb-placeholder d-flex align-items-center justify-content-center bg-light">
                                                                    <span className="text-muted">{t('no_image')}</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {isSelected && (
                                                            <span className="selected-badge" aria-hidden="true">
                                                                <span className="badge-circle">
                                                                    <CheckIcon />
                                                                </span>
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="mt-2 text-center fw-bolder">
                                                        {material.name}
                                                        {material.base_price && material.base_price > 0 && (
                                                            <div className="text-muted small">
                                                                +{material.base_price}₾
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}

                            {/* Sizes */}
                            {sizes && sizes.length > 0 && (
                                <>
                                    <h5 className="mt-4 fw-bolder">{t('select_size')}</h5>
                                    {sizes.map((size) => (
                                        <div key={size.id}>
                                            <TealCheckbox
                                                label={`${size.name} (${size.width} x ${size.height})${size.base_price && size.base_price > 0 ? ` ${size.base_price}₾` : ''}`}
                                                checked={selectedSize === size.id}
                                                onChange={() => setSelectedSize(size.id)}
                                            />
                                        </div>
                                    ))}
                                </>
                            )}

                            {/* Print Types */}
                            {printTypes && printTypes.length > 0 && (
                                <>
                                    <h5 className="mt-4 fw-bolder">{t('select_print_method')}</h5>
                                    {printTypes.map((printType) => (
                                        <div key={printType.id}>
                                            <TealCheckbox
                                                label={`${printType.name}${printType.base_price && printType.base_price > 0 ? ` ${printType.base_price}₾` : ''}`}

                                                checked={selectedPrintType === printType.id}
                                                onChange={() => setSelectedPrintType(printType.id)}
                                            />
                                        </div>
                                    ))}
                                </>
                            )}

                            {/* Extras */}
                            {extras && extras.length > 0 && (
                                <>
                                    <h5 className="mt-4 fw-bolder">{t('additional_options')}</h5>
                                    {extras.map((extra) => (
                                        <div key={extra.id}>
                                            <TealCheckbox
                                                label={`${extra.name}${extra.base_price && extra.base_price > 0 ? `  ${extra.base_price}₾ ` : ''}`}
                                                checked={selectedExtra === extra.id}
                                                onChange={() => setSelectedExtra(extra.id)}
                                            />
                                        </div>
                                    ))}
                                </>
                            )}

                            {/* Quantity */}
                            <h5 className="mt-4 fw-bolder">{t('quantity')}</h5>
                            <div className="d-flex align-items-center">
                                <button
                                    className={'btn btn-sm btn-light qty-btn-item fw-bolder'}
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={isAddingToCart || cartLoading}
                                >
                                    -
                                </button>
                                <span className="mx-1 qty-span-item">{quantity}</span>
                                <button
                                    className={'btn btn-sm btn-light qty-btn-item fw-bolder'}
                                    onClick={() => setQuantity(quantity + 1)}
                                    disabled={isAddingToCart || cartLoading}
                                >
                                    +
                                </button>
                            </div>

                            <div className='mt-3 gap-2 text_font text-muted d-flex align-items-center align-content-center'>
                                <div><InfoIcon /></div>
                                <div>{t('bulk_order_info')}</div>
                            </div>

                            {/*/!* Comment *!/*/}
                            {/*<h5 className="mt-4 fw-bolder">{t('additional_details')}</h5>*/}
                            {/*<Form.Control*/}
                            {/*    as="textarea"*/}
                            {/*    rows={3}*/}
                            {/*    placeholder={t('additional_details_placeholder')}*/}
                            {/*    value={comment}*/}
                            {/*    className='text_font'*/}
                            {/*    onChange={(e) => setComment(e.target.value)}*/}
                            {/*    disabled={isAddingToCart || cartLoading}*/}
                            {/*/>*/}

                            {/* File Uploader */}
                            <h5 className="mt-4 fw-bolder">{t('upload_file')}</h5>
                            <FileUploader
                                uploadUrl={`${process.env.NEXT_PUBLIC_FILE_URL}api/web/image/resize`}
                                headers={{
                                    Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''}`
                                }}
                                fieldName="file[]"
                                accept="application/pdf,image/*"
                                multiple
                                maxSizeMB={50}
                                className={'text_font'}
                                autoUpload={false}
                                showQuantity={false}
                                onComplete={handleFileUploadComplete}
                                onError={handleFileUploadError}
                            />

                            {/* Uploaded Files List */}
                            {uploadedFiles.length > 0 && (
                                <div className="mt-3">
                                    <h6 className="fw-bolder">{t('uploaded_files')} ({uploadedFiles.length}):</h6>
                                    <ul className="list-group">
                                        {uploadedFiles.map((file, index) => (
                                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                                <div className="d-flex flex-column">
                                                    <span className="text-truncate" title={file.name}>
                                                        {file.name}
                                                    </span>
                                                    <small className="text-muted">
                                                        {t('file_id')}: {file.file_id}
                                                    </small>
                                                </div>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleRemoveFile(file.file_id, index)}
                                                    disabled={isAddingToCart || cartLoading || isDeleting}
                                                >
                                                    {isDeleting ? t('deleting') : t('delete')}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-12 col-md-4 col-lg-3 mt-4 mt-lg-0">
                        <OrderSidebar
                            price={price}
                            quantity={quantity}
                            onOrderClick={handleOrderClick}
                            onAddToCart={handleAddToCart}
                            isLoading={isAddingToCart || cartLoading}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

// 'use client';
//
// import Cover from "@/shared/components/theme/header/cover/cover";
// import Image from "next/image";
// import React, { useState, useEffect, useRef } from "react";
// import { Form } from "react-bootstrap";
// import TealCheckbox from "@/shared/components/ui/tealCheckbox/tealCheckbox";
// import { HeaderTitle } from "@/shared/components/theme/page/components/headerTitle";
// import CheckIcon from '@/shared/assets/icons/check/check.svg';
// import InfoIcon from '@/shared/assets/icons/info/info.svg';
// import FileUploader from "@/shared/components/ui/uploader/FileUploader";
// import OrderSidebar from "@/shared/components/ui/orderSidebar/OrderSidebar";
// import { Product } from "@/types/product/productTypes";
// import { getImageUrl } from "@/shared/utils/imageHelper";
// import { useCart } from "@/shared/hooks/useCart";
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";
// import { useFileUpload } from "@/shared/hooks/file/useFileUpload";
// import { useLanguage } from "@/context/LanguageContext";
//
// interface BrandPageDetailsProps {
//     product: Product;
// }
//
// export default function BrandPageDetails({ product }: BrandPageDetailsProps) {
//     const router = useRouter();
//     const { addItem, loading: cartLoading } = useCart();
//     const { t } = useLanguage();
//
//     const {
//         uploadedFiles,
//         addFiles,
//         deleteFile,
//         getCoverData,
//         isDeleting
//     } = useFileUpload();
//
//     // Product-დან მონაცემების ამოღება - product_attributes-დან თუ არსებობს
//     const sizes = product.product_attributes?.sizes || product.sizes || [];
//     const materials = product.product_attributes?.materials || product.materials || [];
//     const printTypes = product.product_attributes?.print_types || product.print_types || [];
//     const extras = product.product_attributes?.extras || product.extras || [];
//
//     const [selectedMaterial, setSelectedMaterial] = useState<number | null>(null);
//     const [selectedSize, setSelectedSize] = useState<number | null>(null);
//     const [selectedExtras, setSelectedExtras] = useState<number[]>([]);
//     const [selectedPrintTypes, setSelectedPrintTypes] = useState<number[]>([]);
//     const [quantity, setQuantity] = useState<number>(1);
//     const [comment, setComment] = useState<string>("");
//     const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
//
//     const hasProcessedFiles = useRef(false);
//
//     useEffect(() => {
//         if (materials && materials.length > 0 && selectedMaterial === null) {
//             setSelectedMaterial(materials[0].id);
//         }
//         if (sizes && sizes.length > 0 && selectedSize === null) {
//             setSelectedSize(sizes[0].id);
//         }
//         if (extras && extras.length > 0 && selectedExtras.length === 0) {
//             setSelectedExtras([extras[0].id]);
//         }
//         if (printTypes && printTypes.length > 0 && selectedPrintTypes.length === 0) {
//             setSelectedPrintTypes([printTypes[0].id]);
//         }
//     }, [materials, sizes, extras, printTypes, selectedMaterial, selectedSize, selectedExtras.length, selectedPrintTypes.length]);
//
//     const calculatePrice = () => {
//         let total = Number(product.sale_price || product.price || 0);
//
//         if (selectedMaterial) {
//             const material = materials?.find(m => m.id === selectedMaterial);
//             if (material && material.base_price) {
//                 total += Number(material.base_price);
//             }
//         }
//
//         if (selectedSize) {
//             const size = sizes?.find(s => s.id === selectedSize);
//             if (size && size.base_price) {
//                 total += Number(size.base_price);
//             }
//         }
//
//         selectedExtras.forEach(extraId => {
//             const extra = extras?.find(e => e.id === extraId);
//             if (extra && extra.base_price) {
//                 total += Number(extra.base_price);
//             }
//         });
//
//         selectedPrintTypes.forEach(printTypeId => {
//             const printType = printTypes?.find(pt => pt.id === printTypeId);
//             if (printType && printType.base_price) {
//                 total += Number(printType.base_price);
//             }
//         });
//
//         return total;
//     };
//
//     const price = calculatePrice();
//
//     const getExtrasArray = () => {
//         const extrasArr: string[] = [];
//
//         if (selectedMaterial) {
//             const material = materials?.find(m => m.id === selectedMaterial);
//             if (material) extrasArr.push(`${t('material')}: ${material.name}`);
//         }
//
//         if (selectedSize) {
//             const size = sizes?.find(s => s.id === selectedSize);
//             if (size) extrasArr.push(`${t('size')}: ${size.name}`);
//         }
//
//         selectedExtras.forEach(extraId => {
//             const extra = extras?.find(e => e.id === extraId);
//             if (extra) extrasArr.push(extra.name);
//         });
//
//         selectedPrintTypes.forEach(printTypeId => {
//             const printType = printTypes?.find(pt => pt.id === printTypeId);
//             if (printType) extrasArr.push(printType.name);
//         });
//
//         return extrasArr;
//     };
//
//     const handleFileUploadComplete = (items: any[]) => {
//         if (hasProcessedFiles.current) {
//             return;
//         }
//
//         // console.log("✅ Upload complete:", items);
//
//         const files = items
//             .filter(item => item.status === 'done' && item.uploadedFileId)
//             .map(item => ({
//                 file_id: item.uploadedFileId,
//                 url: item.response?.url || item.response?.data?.url || '',
//                 name: item.name || 'file',
//                 quantity: item.quantity || 1,
//                 cover_type: 'image'
//             }));
//
//         if (files.length > 0) {
//             hasProcessedFiles.current = true;
//             addFiles(files);
//             toast.success(t('files_uploaded_count' ));
//         }
//     };
//
//     const handleAddToCart = async () => {
//         if (!selectedMaterial && materials && materials.length > 0) {
//             toast.warning(t('please_select_material'));
//             return;
//         }
//
//         if (!selectedSize && sizes && sizes.length > 0) {
//             toast.warning(t('please_select_size'));
//             return;
//         }
//
//         const size = sizes?.find(s => s.id === selectedSize);
//         const selectedExtrasData = extras
//             ?.filter(e => selectedExtras.includes(e.id))
//             .map(e => e.name);
//
//         const material = materials?.find(m => m.id === selectedMaterial);
//         const coverData = getCoverData();
//
//         setIsAddingToCart(true);
//
//         try {
//             await addItem({
//                 id: Date.now(),
//                 product_id: product.id,
//                 name: product.info.name,
//                 price: price,
//                 quantity: quantity,
//                 image: product.info.covers && product.info.covers.length > 0
//                     ? getImageUrl(product.info.covers[0].output_path)
//                     : undefined,
//                 discount: product.sale_price || undefined,
//                 materials: material?.name,
//                 extras: selectedExtrasData,
//                 size: size?.name,
//                 custom_dimensions: getExtrasArray(),
//                 uploaded_file: coverData.uploaded_file,
//                 cover_id: coverData.cover_ids,
//                 cover_type: coverData.cover_types,
//             });
//
//             toast.success(t('product_added_to_cart'));
//
//             if (uploadedFiles.length > 0) {
//                 // console.log('Order created with files:', {
//                 //     product_id: product.id,
//                 //     cover_ids: coverData.cover_ids,
//                 //     cover_types: coverData.cover_types,
//                 //     files_count: uploadedFiles.length
//                 // });
//             }
//
//         } catch (error) {
//             console.error('❌ Error adding to cart:', error);
//             toast.error(t('error_adding_product'));
//         } finally {
//             setIsAddingToCart(false);
//         }
//     };
//
//     const handleOrderClick = async () => {
//         await handleAddToCart();
//
//         if (!isAddingToCart) {
//             setTimeout(() => {
//                 router.push('/cart');
//             }, 500);
//         }
//     };
//
//     const toggleExtra = (extraId: number) => {
//         setSelectedExtras(prev =>
//             prev.includes(extraId)
//                 ? prev.filter(id => id !== extraId)
//                 : [...prev, extraId]
//         );
//     };
//
//     const togglePrintType = (printTypeId: number) => {
//         setSelectedPrintTypes(prev =>
//             prev.includes(printTypeId)
//                 ? prev.filter(id => id !== printTypeId)
//                 : [...prev, printTypeId]
//         );
//     };
//
//     const handleFileUploadError = (items: any[]) => {
//         console.error("❌ Upload error:", items);
//         toast.error(t('file_upload_error'));
//     };
//
//     const handleRemoveFile = async (fileId: number, index: number) => {
//         const success = await deleteFile(fileId, index);
//
//         if (success && uploadedFiles.length === 1) {
//             hasProcessedFiles.current = false;
//         }
//     };
//
//     return (
//         <>
//             <Cover />
//             <div className="container py-4" data-aos={"fade-up"}>
//                 <HeaderTitle title={product.info.name} slug={product.info.slug} />
//                 <div className="row">
//                     <div className="col-12 col-md-8 col-lg-9">
//                         <div className='section-brands p-4'>
//                             {/* Materials */}
//                             {materials && materials.length > 0 && (
//                                 <>
//                                     <h5 className="mb-3 fw-bolder">{t('select_material')}</h5>
//                                     <div className="row">
//                                         {materials.map((material) => {
//                                             const isSelected = selectedMaterial === material.id;
//                                             const materialImage = material.covers && material.covers.length > 0
//                                                 ? material.covers[0]
//                                                 : null;
//
//                                             return (
//                                                 <div className="col-6 col-md-3 mb-4" key={material.id}>
//                                                     <div
//                                                         role="button"
//                                                         tabIndex={0}
//                                                         onClick={() => setSelectedMaterial(material.id)}
//                                                         onKeyDown={(e) =>
//                                                             (e.key === "Enter" || e.key === " ") && setSelectedMaterial(material.id)
//                                                         }
//                                                         className={`product-card text-center p-2 ${isSelected ? "is-selected" : ""}`}
//                                                         aria-pressed={isSelected}
//                                                     >
//                                                         <div className="thumb">
//                                                             {materialImage ? (
//                                                                 <Image
//                                                                     src={getImageUrl(materialImage.output_path)}
//                                                                     alt={material.name}
//                                                                     fill
//                                                                     sizes="(max-width: 768px) 50vw, 25vw"
//                                                                     className="thumb-img"
//                                                                 />
//                                                             ) : (
//                                                                 <div className="thumb-placeholder d-flex align-items-center justify-content-center bg-light">
//                                                                     <span className="text-muted">{t('no_image')}</span>
//                                                                 </div>
//                                                             )}
//                                                         </div>
//
//                                                         {isSelected && (
//                                                             <span className="selected-badge" aria-hidden="true">
//                                                                 <span className="badge-circle">
//                                                                     <CheckIcon />
//                                                                 </span>
//                                                             </span>
//                                                         )}
//                                                     </div>
//
//                                                     <div className="mt-2 text-center fw-bolder">
//                                                         {material.name}
//                                                         {material.base_price && material.base_price > 0 && (
//                                                             <div className="text-muted small">
//                                                                 +{material.base_price}₾
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             );
//                                         })}
//                                     </div>
//                                 </>
//                             )}
//
//                             {/* Sizes */}
//                             {sizes && sizes.length > 0 && (
//                                 <>
//                                     <h5 className="mt-4 fw-bolder">{t('select_size')}</h5>
//                                     {sizes.map((size) => (
//                                         <div key={size.id}>
//                                             <TealCheckbox
//                                                 label={`${size.name} (${size.width} x ${size.height})${size.base_price && size.base_price > 0 ? ` ${size.base_price}₾` : ''}`}
//                                                 checked={selectedSize === size.id}
//                                                 onChange={() => setSelectedSize(size.id)}
//                                             />
//                                         </div>
//                                     ))}
//                                 </>
//                             )}
//
//                             {/* Print Types */}
//                             {printTypes && printTypes.length > 0 && (
//                                 <>
//                                     <h5 className="mt-4 fw-bolder">{t('select_print_method')}</h5>
//                                     {printTypes.map((printType) => (
//                                         <div key={printType.id}>
//                                             <TealCheckbox
//                                                 label={`${printType.name}${printType.base_price && printType.base_price > 0 ? ` ${printType.base_price}₾` : ''}`}
//                                                 checked={selectedPrintTypes.includes(printType.id)}
//                                                 onChange={() => togglePrintType(printType.id)}
//                                             />
//                                         </div>
//                                     ))}
//                                 </>
//                             )}
//
//                             {/* Extras */}
//                             {extras && extras.length > 0 && (
//                                 <>
//                                     <h5 className="mt-4 fw-bolder">{t('additional_options')}</h5>
//                                     {extras.map((extra) => (
//                                         <div key={extra.id}>
//                                             <TealCheckbox
//                                                 label={`${extra.name}${extra.base_price && extra.base_price > 0 ? `  ${extra.base_price}₾ ` : ''}`}
//                                                 checked={selectedExtras.includes(extra.id)}
//                                                 onChange={() => toggleExtra(extra.id)}
//                                             />
//                                         </div>
//                                     ))}
//                                 </>
//                             )}
//
//                             {/* Quantity */}
//                             <h5 className="mt-4 fw-bolder">{t('quantity')}</h5>
//                             <div className="d-flex align-items-center">
//                                 <button
//                                     className={'btn btn-sm btn-light qty-btn-item fw-bolder'}
//                                     onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                                     disabled={isAddingToCart || cartLoading}
//                                 >
//                                     -
//                                 </button>
//                                 <span className="mx-1 qty-span-item">{quantity}</span>
//                                 <button
//                                     className={'btn btn-sm btn-light qty-btn-item fw-bolder'}
//                                     onClick={() => setQuantity(quantity + 1)}
//                                     disabled={isAddingToCart || cartLoading}
//                                 >
//                                     +
//                                 </button>
//                             </div>
//
//                             <div className='mt-3 gap-2 text_font text-muted d-flex align-items-center align-content-center'>
//                                 <div><InfoIcon /></div>
//                                 <div>{t('bulk_order_info')}</div>
//                             </div>
//
//                             {/*/!* Comment *!/*/}
//                             {/*<h5 className="mt-4 fw-bolder">{t('additional_details')}</h5>*/}
//                             {/*<Form.Control*/}
//                             {/*    as="textarea"*/}
//                             {/*    rows={3}*/}
//                             {/*    placeholder={t('additional_details_placeholder')}*/}
//                             {/*    value={comment}*/}
//                             {/*    className='text_font'*/}
//                             {/*    onChange={(e) => setComment(e.target.value)}*/}
//                             {/*    disabled={isAddingToCart || cartLoading}*/}
//                             {/*/>*/}
//
//                             {/* File Uploader */}
//                             <h5 className="mt-4 fw-bolder">{t('upload_file')}</h5>
//                             <FileUploader
//                                 uploadUrl={`${process.env.NEXT_PUBLIC_FILE_URL}api/web/image/resize`}
//                                 headers={{
//                                     Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''}`
//                                 }}
//                                 fieldName="file[]"
//                                 accept="application/pdf,image/*"
//                                 multiple
//                                 maxSizeMB={50}
//                                 className={'text_font'}
//                                 autoUpload={false}
//                                 showQuantity={false}
//                                 onComplete={handleFileUploadComplete}
//                                 onError={handleFileUploadError}
//                             />
//
//                             {/* Uploaded Files List */}
//                             {uploadedFiles.length > 0 && (
//                                 <div className="mt-3">
//                                     <h6 className="fw-bolder">{t('uploaded_files')} ({uploadedFiles.length}):</h6>
//                                     <ul className="list-group">
//                                         {uploadedFiles.map((file, index) => (
//                                             <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
//                                                 <div className="d-flex flex-column">
//                                                     <span className="text-truncate" title={file.name}>
//                                                         {file.name}
//                                                     </span>
//                                                     <small className="text-muted">
//                                                         {t('file_id')}: {file.file_id}
//                                                     </small>
//                                                 </div>
//                                                 <button
//                                                     className="btn btn-sm btn-outline-danger"
//                                                     onClick={() => handleRemoveFile(file.file_id, index)}
//                                                     disabled={isAddingToCart || cartLoading || isDeleting}
//                                                 >
//                                                     {isDeleting ? t('deleting') : t('delete')}
//                                                 </button>
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//
//                     <div className="col-12 col-md-4 col-lg-3 mt-4 mt-lg-0">
//                         <OrderSidebar
//                             price={price}
//                             quantity={quantity}
//                             onOrderClick={handleOrderClick}
//                             onAddToCart={handleAddToCart}
//                             isLoading={isAddingToCart || cartLoading}
//                         />
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }