import Cover from "@/shared/components/theme/header/cover/cover";
import {HeaderTitle} from "@/shared/components/theme/page/components/headerTitle";

import {PageData} from '@/types/page/page'
import {generateSlug} from "@/shared/utils/mix";
interface TextPageProps {
    page: PageData;
}
export default function TextPage({ page }: TextPageProps) {

    const url = generateSlug(page.info.slug,page.id,'p');

    return (<>
            <Cover/>
            <div className="container py-4">
                <HeaderTitle title={page.info.title} slug={url}/>
                <div className='text_font'    dangerouslySetInnerHTML={{ __html: page.info.text }}>
                </div>
            </div>
        </>
    );
}
