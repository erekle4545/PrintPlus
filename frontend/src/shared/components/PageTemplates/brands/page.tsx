'use client';

import Link from "next/link";
import Image from "next/image";
import Cover from "@/shared/components/theme/header/cover/cover";
import {HeaderTitle} from "@/shared/components/theme/page/components/headerTitle";

const brands = [
    { slug: "/pages/brands/nike", name: "ბალიშზე ბეჭდვა" },
    { slug: "/pages/brands/adidas", name: "ბრელოკზე ბეჭდვა" },
    { slug: "/pages/brands/puma", name: "კეპზე ბეჭდვა" },
    { slug: "/pages/brands/puma-test", name: "კეპზე ბეჭდვა" },
];

export default function BrandsPage() {
    return (<>
        <Cover/>
        <div className="container py-4">
            <HeaderTitle title={'ბრენდების სია'} slug={[]}/>
            <ul className="row py-3 list-unstyled g-4">
                {brands.map((brand) => (
                    <li
                        data-aos="zoom-in"
                        key={brand.slug}
                        className="col-12 col-md-4 col-sm-6 col-xl-3 d-flex"
                    >
                        <div className="brand-card text-center p-3 w-100 h-100 d-flex flex-column justify-content-between">
                            <Link href={brand.slug}>
                                <Image
                                    src={'/assets/img/products/pro_2.png'}
                                    alt={brand.name}
                                    width={200}
                                    height={200}
                                    className="img-box "
                                />
                                <h4 className="mt-3 title_font fw-bolder">{brand.name}</h4>
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    </>);
}
