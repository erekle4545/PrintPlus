// BrandPage.tsx (Server Component)
import Cover from "@/shared/components/theme/header/cover/cover";
import {HeaderTitle} from "@/shared/components/theme/page/components/headerTitle";
import {BrandsList} from "./BrandsList";
import {generateSlug} from "@/shared/utils/mix";

interface BrandPageProps {
    page: any;
    products: any[];
}

export default function BrandsPage({page, products}: BrandPageProps) {

    const url = generateSlug(page.info?.slug,page?.id,'c');

    return (
        <>
            <Cover/>
            <div className="container py-4">
                <HeaderTitle title={page?.info?.title} slug={url}/>
                <BrandsList products={products} pageSlug={page.info?.slug} />
            </div>
        </>
    );
}