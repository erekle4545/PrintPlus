// BrandPage.tsx (Server Component)
import Cover from "@/shared/components/theme/header/cover/cover";
import {HeaderTitle} from "@/shared/components/theme/page/components/headerTitle";
import {BrandsList} from "./BrandsList";

interface BrandPageProps {
    page: any;
    products: any[];
}

export default function BrandsPage({page, products}: BrandPageProps) {
    return (
        <>
            <Cover/>
            <div className="container py-4">
                <HeaderTitle title={'ბრენდების სია'} slug={''}/>
                <BrandsList products={products} pageSlug={page.info?.slug} />
            </div>
        </>
    );
}