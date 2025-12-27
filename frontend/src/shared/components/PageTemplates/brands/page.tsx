// shared/components/PageTemplates/brands/page.tsx
import Image from "next/image";
import Cover from "@/shared/components/theme/header/cover/cover";
import {HeaderTitle} from "@/shared/components/theme/page/components/headerTitle";
import LocalizedLink from "@/shared/components/LocalizedLink/LocalizedLink";
import {getFirstImage} from "@/shared/utils/imageHelper";
import {generateSlug} from "@/shared/utils/mix";

interface BrandPageProps {
    page: {
        id:number,
        info: {
            slug: string;
            title: string;
        };
    };
    products: any[];
}

export default function BrandsPage({page, products}: BrandPageProps) {
    // url
    const url = generateSlug(page.info?.slug,page.id,'c');

    return (
        <>
            <Cover/>
            <div className="container py-4">
                <HeaderTitle title={`${page.info?.title}`} slug={url}/>
                <ul className="row py-3 list-unstyled g-4">
                    {products?.map((product) => {
                        const img = getFirstImage(product.info?.covers);
                        const url = generateSlug(
                            page.info?.slug + '/' + product.info?.slug,
                            product.id,
                            'pr'
                        );

                        return (
                            <li
                                key={product.id}
                                className="col-12 col-md-4 col-sm-6 col-xl-3 d-flex"
                            >
                                <div className="brand-card text-center p-3 w-100 h-100 d-flex flex-column justify-content-between">
                                    <LocalizedLink href={url}>
                                        <Image
                                            src={img}
                                            alt={product.info?.name || ''}
                                            width={200}
                                            height={200}
                                            className="img-box"
                                        />
                                        <h4 className="mt-3 title_font fw-bolder">
                                            {product.info?.name}
                                        </h4>
                                    </LocalizedLink>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    );
}