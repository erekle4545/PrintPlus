// BrandsList.tsx (Client Component)
'use client';

import {useEffect} from "react";
import Image from "next/image";
import LocalizedLink from "@/shared/components/LocalizedLink/LocalizedLink";
import {getFirstImage} from "@/shared/utils/imageHelper";
import {generateSlug} from "@/shared/utils/mix";
import 'aos/dist/aos.css';

interface Product {
    id: number;
    info?: {
        title?: string;
        slug?: string;
        covers?: any;
    };
}

interface BrandsListProps {
    products: Product[];
    pageSlug?: string;
}

export function BrandsList({products, pageSlug}: BrandsListProps) {


    return (
        <ul className="row py-3 list-unstyled g-4">
            {products?.map((product) => {
                const img = getFirstImage(product.info?.covers);
                const url = generateSlug(
                    pageSlug + '/' + product.info?.slug,
                    product.id,
                    'c'
                );

                return (
                    <li
                        data-aos="zoom-in"
                        key={product.id}
                        className="col-12 col-md-4 col-sm-6 col-xl-3 d-flex"
                    >
                        <div className="brand-card text-center p-3 w-100 h-100 d-flex flex-column justify-content-between">
                            <LocalizedLink href={url}>
                                <Image
                                    src={img}
                                    alt={product.info?.title || ''}
                                    width={200}
                                    height={200}
                                    className="img-box"
                                />
                                <h4 className="mt-3 title_font fw-bolder">
                                    {product.info?.title}
                                </h4>
                            </LocalizedLink>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}