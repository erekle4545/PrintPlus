import Cover from "@/shared/components/theme/header/cover/cover";
import {HeaderTitle} from "@/shared/components/theme/page/components/headerTitle";

import {PageData} from '@/types/page/page'
interface TextPageProps {
    page: PageData;
}
export default function TextPage({ page }: TextPageProps) {

    console.log(page.info)

    return (<>
            <Cover/>
            <div className="container py-4">
                <HeaderTitle title={page.info.title} slug={[]}/>

                <div className='text_font'    dangerouslySetInnerHTML={{ __html: page.info.text }}>

                </div>

            </div>
        </>
    );
}
