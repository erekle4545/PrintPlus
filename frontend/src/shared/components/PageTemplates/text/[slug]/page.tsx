import Cover from "@/shared/components/theme/header/cover/cover";
import {HeaderTitle} from "@/shared/components/theme/page/components/headerTitle";

import {PageData} from '@/types/page/page'
import {generateSlug} from "@/shared/utils/mix";
import {getFirstImage} from "@/shared/utils/imageHelper";
import Image from "next/image";
import {COVER_TYPES, hasCover} from "@/types/cover/cover";
interface TextPageProps {
    page: PageData;
}
export default function TextPage({ page }: TextPageProps) {

    const url = generateSlug(page.info.slug,page.id,'p');
    const coverImage = getFirstImage(page.info?.covers, 1, 'original');

    return (<>
            {
                hasCover(page.info?.covers, 'page_cover')?
                <Cover img={getFirstImage(page.info?.covers, COVER_TYPES.page_cover.id, 'original')}/>:
                <Cover/>
            }

            <div className="container  col-xl-8 m-auto py-4">
                <HeaderTitle title={page.info.title} slug={url} />

                {page.info?.covers?.length > 0 && (
                    <div className="relative w-full aspect-video mb-4">
                        <Image
                            src={coverImage}
                            alt={page.info.title || "Cover image"}
                            width={1200}
                            height={600}
                            className="w-100 h-auto"
                            priority
                        />
                    </div>
                )}

                <div
                    className="text_font"
                    dangerouslySetInnerHTML={{ __html: page.info.text }}
                />
            </div>
        </>
    );
}
