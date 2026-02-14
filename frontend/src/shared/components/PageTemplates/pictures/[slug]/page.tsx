'use client';

import Cover from "@/shared/components/theme/header/cover/cover";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
// import { Form } from "react-bootstrap";
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

interface PicturesPageDetailsProps {
    product: Product;
}

export default function PicturesPageDetails({ product }: PicturesPageDetailsProps) {
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
    const sizes = product?.product_attributes?.sizes || product?.sizes || [];
    const materials = product?.product_attributes?.materials || product?.materials || [];
    const printTypes = product?.product_attributes?.print_types || product?.print_types || [];
    const extras = product?.product_attributes?.extras || product?.extras || [];

    const [selectedMaterial, setSelectedMaterial] = useState<number | null>(null);
    const [selectedSize, setSelectedSize] = useState<number | null>(null);
    const [selectedExtras, setSelectedExtras] = useState<number[]>([]);
    const [selectedPrintTypes, setSelectedPrintTypes] = useState<number[]>([]);
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
        if (extras && extras.length > 0 && selectedExtras.length === 0) {
            setSelectedExtras([extras[0].id]);
        }
        if (printTypes && printTypes.length > 0 && selectedPrintTypes.length === 0) {
            setSelectedPrintTypes([printTypes[0].id]);
        }
    }, [materials, sizes, extras, printTypes, selectedMaterial, selectedSize, selectedExtras.length, selectedPrintTypes.length]);

    // ფოტოების რაოდენობის მიხედვით quantity-ს განახლება
    useEffect(() => {
        if (uploadedFiles.length > 0 && uploadedFiles.length > quantity) {
            setQuantity(uploadedFiles.length);
        }
    }, [uploadedFiles.length, quantity]);

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

        selectedExtras.forEach(extraId => {
            const extra = extras?.find(e => e.id === extraId);
            if (extra && extra.base_price) {
                total += Number(extra.base_price);
            }
        });

        selectedPrintTypes.forEach(printTypeId => {
            const printType = printTypes?.find(pt => pt.id === printTypeId);
            if (printType && printType.base_price) {
                total += Number(printType.base_price);
            }
        });

        return total;
    };

    const price = calculatePrice();

    // ფოტოების quantity-ებიდან ჯამის გამოთვლა
    const totalFilesQuantity = uploadedFiles.reduce((sum, file) => sum + (file.quantity || 1), 0);

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

        selectedExtras.forEach(extraId => {
            const extra = extras?.find(e => e.id === extraId);
            if (extra) extrasArr.push(extra.name);
        });

        selectedPrintTypes.forEach(printTypeId => {
            const printType = printTypes?.find(pt => pt.id === printTypeId);
            if (printType) extrasArr.push(printType.name);
        });

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
        const selectedExtrasData = extras
            ?.filter(e => selectedExtras.includes(e.id))
            .map(e => e.name);

        const material = materials?.find(m => m.id === selectedMaterial);
        const coverData = getCoverData();

        setIsAddingToCart(true);

        try {
            await addItem({
                id: Date.now(),
                product_id: product.id,
                name: product.info.name,
                price: price,
                quantity: totalFilesQuantity || quantity,
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

    const toggleExtra = (extraId: number) => {
        setSelectedExtras(prev =>
            prev.includes(extraId)
                ? prev.filter(id => id !== extraId)
                : [...prev, extraId]
        );
    };

    const togglePrintType = (printTypeId: number) => {
        setSelectedPrintTypes(prev =>
            prev.includes(printTypeId)
                ? prev.filter(id => id !== printTypeId)
                : [...prev, printTypeId]
        );
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

    // Minimum quantity უნდა იყოს ფოტოების ჯამური რაოდენობა
    const minQuantity = Math.max(1, totalFilesQuantity);

    return (
        <>
            <Cover />
            <div className="container py-4" data-aos={"fade-up"}>
                <HeaderTitle title={product.info.name} slug={product.info.slug} />
                <div className="row">
                    <div className="col-12 col-md-8 col-lg-9">
                        <div className='section-brands p-4'>
                            {/* File Uploader */}
                            <h5 className="mt-4 fw-bolder">{t('upload_file')}</h5>
                            <FileUploader
                                uploadUrl={`${process.env.NEXT_PUBLIC_FILE_URL}api/web/image/resize`}
                                headers={{
                                    Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''}`
                                }}
                                showImage={true}
                                fieldName="file[]"
                                accept="application/pdf,image/*"
                                multiple
                                maxSizeMB={50}
                                className={'text_font'}
                                autoUpload={false}
                                showQuantity={true}
                                onComplete={handleFileUploadComplete}
                                onError={handleFileUploadError}
                            />

                            {/* Uploaded Files List */}
                            {uploadedFiles.length > 0 && (
                                <div className="mt-3 mb-3">
                                    <h6 className="fw-bolder">{t('uploaded_files')} ({uploadedFiles.length}) - {t('total_quantity', 'სულ')}: {totalFilesQuantity}</h6>
                                    <ul className="list-group">
                                        {uploadedFiles.map((file, index) => (
                                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                                <div className="d-flex flex-column">
                                                    <span className="text-truncate" title={file.name}>
                                                        {file.name} {file.quantity && file.quantity > 1 ? `(${file.quantity})` : ''}
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
                                                    {isDeleting ? t('deleting') : t('delete','წაშლა')}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {/* Materials */}
                            {/* Materials */}
                            {materials.length > 0 && (
                                <div className="mb-3">
                                    <div className="fw-semibold mb-2">{t('select_material')}</div>
                                    <div className="d-grid gap-2">
                                        {materials.map((material) => (
                                            <label key={material.id} className={'fw-bolder'}>
                                                <TealCheckbox
                                                    label={`${material.name} ${material.base_price > 0 ? `+${material.base_price}₾` : ''}`}
                                                    checked={selectedMaterial === material.id}
                                                    onChange={() => setSelectedMaterial(material.id)}
                                                    disabled={isAddingToCart || cartLoading}
                                                />
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Sizes */}
                            {sizes && sizes.length > 0 && (
                                <>
                                    <h5 className="mt-4 fw-bolder">{t('select_size')}</h5>
                                    {sizes.map((size) => (
                                        <div key={size.id}>
                                            <TealCheckbox
                                                label={`${size.name} (${size.width} x ${size.height})${size.base_price && size.base_price > 0 ? ` (+${size.base_price}₾)` : ''}`}
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
                                                label={`${printType.name}${printType.base_price && printType.base_price > 0 ? ` (+${printType.base_price}₾)` : ''}`}
                                                checked={selectedPrintTypes.includes(printType.id)}
                                                onChange={() => togglePrintType(printType.id)}
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
                                                label={`${extra.name}${extra.base_price && extra.base_price > 0 ? ` (+${extra.base_price}₾)` : ''}`}
                                                checked={selectedExtras.includes(extra.id)}
                                                onChange={() => toggleExtra(extra.id)}
                                            />
                                        </div>
                                    ))}
                                </>
                            )}

                            {/* Quantity */}
                            {/*<h5 className="mt-4 fw-bolder">{t('quantity')}</h5>*/}
                            {/*<div className="d-flex align-items-center">*/}
                            {/*    <button*/}
                            {/*        className={'btn btn-sm btn-light qty-btn-item fw-bolder'}*/}
                            {/*        onClick={() => setQuantity(Math.max(minQuantity, quantity - 1))}*/}
                            {/*        disabled={isAddingToCart || cartLoading || quantity <= minQuantity}*/}
                            {/*    >*/}
                            {/*        -*/}
                            {/*    </button>*/}
                            {/*    <span className="mx-1 qty-span-item">{quantity}</span>*/}
                            {/*    <button*/}
                            {/*        className={'btn btn-sm btn-light qty-btn-item fw-bolder'}*/}
                            {/*        onClick={() => setQuantity(quantity + 1)}*/}
                            {/*        disabled={isAddingToCart || cartLoading}*/}
                            {/*    >*/}
                            {/*        +*/}
                            {/*    </button>*/}
                            {/*</div>*/}

                            <div className='mt-3 gap-2 text_font text-muted d-flex align-items-center align-content-center'>
                                <div><InfoIcon /></div>
                                <div>{t('bulk_order_info_picture')}</div>
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


                        </div>
                    </div>

                    <div className="col-12 col-md-4 col-lg-3 mt-4 mt-lg-0">
                        <OrderSidebar
                            disabled={!uploadedFiles.length}
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