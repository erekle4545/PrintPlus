'use client';

import Link from "next/link";
import Image from "next/image";
import Cover from "@/shared/components/theme/header/cover/cover";
import { HeaderTitle } from "@/shared/components/theme/page/components/headerTitle";

// TODO: replace image paths with your real files under /public/assets/products/*
const categories = [
    { slug: "/products/frames",        name: "ჩარჩოები",              image: "/assets/img/products/pro_2.png" },
    { slug: "/products/stationery",    name: "საკანცელარო ნივთები",   image: "/assets/img/products/pro_2.png" },
    { slug: "/products/stickers",      name: "სტიკერები",             image: "/assets/img/products/pro_2.png" },
    { slug: "/products/photo-albums",  name: "საოჯახო ალბომები",       image: "/assets/img/products/pro_2.png" },
    { slug: "/products/gift-cards",    name: "სასაჩუქრე ბარათები",     image: "/assets/img/products/pro_2.png" },
    { slug: "/products/calendars",     name: "კალენდრები",            image: "/assets/products/calendars.jpg" },
    { slug: "/products/tshirts",       name: "ბრენდირებული მაისურები", image: "/assets/products/tshirts.jpg" },
    { slug: "/products/posters",       name: "პოსტერები",             image: "/assets/products/posters.jpg" },
    { slug: "/products/notebooks",     name: "დღიურები/ბლოკნოტები",    image: "/assets/products/notebooks.jpg" },
    { slug: "/products/prints",        name: "პოსტერი/პრინტი",         image: "/assets/products/prints.jpg" },
];

export default function ProductsPage() {
    return (
        <>
            <Cover />
            <div className="container py-4">
                <HeaderTitle title="ჩვენი პროდუქტებია" slug={ ''} />

                {/* Grid */}
                <ul className="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4 list-unstyled justify-content-center">
                    {categories.map((item) => (
                        <li key={item.slug} className="col d-flex" data-aos="zoom-in">
                            <div className="product-card text-center p-3 w-100 h-100 d-flex flex-column justify-content-between">
                                <Link href={item.slug} aria-label={item.name} className="text-decoration-none">
                                    {/* Circle thumbnail */}
                                    <div className="thumb-wrap mx-auto">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-fit-cover"
                                            sizes="(max-width: 576px) 60vw, (max-width: 1200px) 30vw, 200px"
                                            priority={false}
                                        />
                                    </div>

                                    <h1 className="mt-3 title_font product-card-title fw-bolder text-dark">{item.name}</h1>
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>


        </>
    );
}
