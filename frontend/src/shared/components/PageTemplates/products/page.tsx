'use client';

import Link from "next/link";
import Image from "next/image";
import Cover from "@/shared/components/theme/header/cover/cover";
import { HeaderTitle } from "@/shared/components/theme/page/components/headerTitle";
import {generateSlug} from "@/shared/utils/mix";
import {getFirstImage} from "@/shared/utils/imageHelper";


interface ProductPageProps {
    page: {
        id:number,
        info: {
            slug: string;
            title: string;
        };
    };
    products: any[];
}

export default function ProductPage({page, products}: ProductPageProps) {

    const url = generateSlug(page.info?.slug,page.id,'c');


    return (
        <>
            <Cover key={1}/>

            <div className="container py-4">
                <HeaderTitle title={page.info?.title} slug={url} />

                {/* Grid */}
                <ul className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-3 g-lg-4 list-unstyled justify-content-center">
                    {products.map((product,index) => {
                        const img = getFirstImage(product.info?.covers);
                        const url = generateSlug(
                            page.info?.slug + '/' + product.info?.slug,
                            product.id,
                            'pr'
                        );

                       return (
                            <li key={index} className="col d-flex" data-aos="zoom-in">
                                <Link href={url} className="text-decoration-none d-flex w-100"
                                      aria-label={product.info?.name}>
                                    <div className="borders-card p-3 w-100 text-center d-flex flex-column">
                                        {/* square thumbnail */}
                                        <div className="borders-thumb mx-auto">
                                            <Image
                                                src={img}
                                                alt={product.info?.name}
                                                fill
                                                style={{objectFit: "contain"}} // keep full image inside the square
                                                sizes="(max-width: 576px) 50vw, (max-width: 1200px) 25vw, 220px"
                                            />
                                        </div>

                                        <h3 className="mt-3 title_font borders-card-title text-dark fw-bold">
                                            {product.info?.name}sds
                                        </h3>
                                    </div>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </>
    );
}
