'use client';

import Link from "next/link";
import Image from "next/image";
import Cover from "@/components/theme/header/cover/cover";
import { HeaderTitle } from "@/components/theme/page/components/headerTitle";

// NOTE: use /borders/* links instead of /products/*
const categories = [
    { slug: "/pages/borders/frames",       name: "ჩარჩოები",               image: "/assets/img/products/pro_2.png" },
    { slug: "/pages/borders/stationery",   name: "საკანცელარო ნივთები",    image: "/assets/img/products/pro_2.png" },
    { slug: "/pages/borders/stickers",     name: "სტიკერები",              image: "/assets/img/products/pro_2.png" },
    { slug: "/pages/borders/photo-albums", name: "საოჯახო ალბომები",        image: "/assets/img/products/pro_2.png" },
    { slug: "/pages/borders/gift-cards",   name: "სასაჩუქრე ბარათები",      image: "/assets/img/products/pro_2.png" },
    { slug: "/pages/borders/calendars",    name: "კალენდრები",             image: "/assets/img/products/pro_2.png" },
    { slug: "/pages/borders/tshirts",      name: "ბრენდირებული მაისურები",  image: "/assets/img/products/pro_2.png" },
    { slug: "/pages/borders/posters",      name: "პოსტერები",              image: "/assets/img/products/pro_2.png" },
    { slug: "/pages/borders/notebooks",    name: "დღიურები/ბლოკნოტები",     image: "/assets/img/products/pro_2.png" },
    { slug: "/pages/borders/prints",       name: "პოსტერი/პრინტი",          image: "/assets/img/products/pro_1.png" },
];

export default function BordersPage() {
    return (
        <>
            <Cover/>
            <div className="container py-4">
                <HeaderTitle title="ჩარჩოები" slug={[]} />

                {/* Grid */}
                <ul className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-3 g-lg-4 list-unstyled justify-content-center">
                    {categories.map((item) => (
                        <li key={item.slug} className="col d-flex" data-aos="zoom-in">
                            <Link href={item.slug} className="text-decoration-none d-flex w-100" aria-label={item.name}>
                                <div className="borders-card p-3 w-100 text-center d-flex flex-column">
                                    {/* square thumbnail */}
                                    <div className="borders-thumb mx-auto">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            style={{ objectFit: "contain" }} // keep full image inside the square
                                            sizes="(max-width: 576px) 50vw, (max-width: 1200px) 25vw, 220px"
                                        />
                                    </div>

                                    <h3 className="mt-3 title_font borders-card-title text-dark fw-bold">
                                        {item.name}
                                    </h3>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
