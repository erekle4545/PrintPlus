'use client';
import React from 'react';
import Button from "@/shared/components/ui/button/Button";
import Cat1 from "@/shared/assets/icons/home/cat_1.svg"
import Cat2 from "@/shared/assets/icons/home/cat_2.svg"
import Cat3 from "@/shared/assets/icons/home/cat_3.svg"
import {TextPages} from "@/types/page/page";
import {useLanguage} from "@/context/LanguageContext";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {generateSlug} from "@/shared/utils/mix";



interface HomeTextPagesProps {
    homeTextPages: TextPages[];
    locale: string;
}
const HomeTextPages: React.FC<HomeTextPagesProps> = ({ homeTextPages }) => {
    if (homeTextPages.length === 0) return null;
    const route = useRouter();

    const {t} = useLanguage();

    const HomeTextPageList = ()=>{
        return homeTextPages?.map(({id,info},index)=>{
            // colors
            const bgColors = [
                '#F1CB44','#D77BD9','#6E64D9'
            ];
            // icons
            const icons = [
                <Cat1/>, <Cat2/>, <Cat3/>
            ];
            // slug
            const url = generateSlug(info?.slug, id, 'p');
            // image
            const image = info?.covers[index]?.output_path;

           return  (
               <div key={id} className="col-12 col-md-4 col-xl-3" >
                   <div className="p-4 rounded-4" style={{ backgroundColor:bgColors[index] }}>
                       <h5 className="fw-bold text-white mb-4 mt-3">{info?.title}</h5>
                       <div className="d-flex justify-content-center mb-3 ">
                           <div
                               className="d-flex col-xl-2 justify-content-center align-items-center"
                               style={{
                                   width: '120px',
                                   height: '120px',
                                   borderRadius: '50%',
                                   border: '3px dashed white',
                               }}
                           >
                               {image?<Image src={image} alt={info?.title} width={64} height={64}/>:icons[index]}
                           </div>
                       </div>
                       <Button onClick={()=>route.push(url)} className="btn btn-white fw-bold mt-3 mb-3 " variant="my-btn-light">
                           {t('readMore','სრულად')}  →
                       </Button>
                   </div>
               </div>
           )
        });
    }
    return (
        <div className="text-center my-5" >
            <h3 className="fw-bold mb-4" data-aos="zoom-in"	>{t('how_to_work', 'როგორ ვმუშაობთ')}</h3>

            <div className="row justify-content-center g-3" data-aos="fade-up">
                {HomeTextPageList()}
                {/* ბლოკი 1 */}
            {/*    <div className="col-12 col-md-4 col-xl-3" >*/}
            {/*        <div className="p-4 rounded-4" style={{ backgroundColor: '#F1CB44' }}>*/}
            {/*            <h5 className="fw-bold text-white mb-4 mt-3">დიზაინი</h5>*/}
            {/*            <div className="d-flex justify-content-center mb-3 ">*/}
            {/*                <div*/}
            {/*                    className="d-flex col-xl-2 justify-content-center align-items-center"*/}
            {/*                    style={{*/}
            {/*                        width: '120px',*/}
            {/*                        height: '120px',*/}
            {/*                        borderRadius: '50%',*/}
            {/*                        border: '3px dashed white',*/}
            {/*                    }}*/}
            {/*                >*/}
            {/*                    <Cat1/>*/}
            {/*                    /!*<Image src="/icons/design-icon.svg" alt="დიზაინი" width={64} height={64} />*!/*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*            <Button className="btn btn-white fw-bold mt-3 mb-3 " variant="my-btn-light">*/}
            {/*                სრულად →*/}
            {/*            </Button>*/}
            {/*        </div>*/}
            {/*    </div>*/}

            {/*    /!* ბლოკი 2 *!/*/}
            {/*    <div className="col-12 col-md-4 col-xl-3">*/}
            {/*        <div className="p-4 rounded-4" style={{ backgroundColor: '#D77BD9' }}>*/}
            {/*            <h5 className="fw-bold text-white mb-4 mt-3">ბეჭდვა</h5>*/}
            {/*            <div className="d-flex justify-content-center mb-3">*/}
            {/*                <div*/}
            {/*                    className="d-flex justify-content-center align-items-center"*/}
            {/*                    style={{*/}
            {/*                        width: '120px',*/}
            {/*                        height: '120px',*/}
            {/*                        borderRadius: '50%',*/}
            {/*                        border: '3px dashed white',*/}
            {/*                    }}*/}
            {/*                >*/}
            {/*                    <Cat2/>*/}

            {/*                </div>*/}
            {/*            </div>*/}
            {/*            <Button className="btn btn-white fw-bold mt-3 mb-3 " variant="my-btn-light">*/}
            {/*                სრულად →*/}
            {/*            </Button>*/}
            {/*        </div>*/}
            {/*    </div>*/}

            {/*    /!* ბლოკი 3 *!/*/}
            {/*    <div className="col-12 col-md-4 col-xl-3">*/}
            {/*        <div className="p-4 rounded-4" style={{ backgroundColor: '#6E64D9' }}>*/}
            {/*            <h5 className="fw-bold text-white mb-4 mt-3">მიწოდება</h5>*/}
            {/*            <div className="d-flex justify-content-center mb-3">*/}
            {/*                <div*/}
            {/*                    className="d-flex justify-content-center align-items-center"*/}
            {/*                    style={{*/}
            {/*                        width: '120px',*/}
            {/*                        height: '120px',*/}
            {/*                        borderRadius: '50%',*/}
            {/*                        border: '3px dashed white',*/}
            {/*                    }}*/}
            {/*                >*/}
            {/*                    <Cat3/>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*            <Button className="btn btn-white fw-bold mt-3 mb-3 " variant="my-btn-light">*/}
            {/*                სრულად →*/}
            {/*            </Button>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            </div>
        </div>
    )
}

export default HomeTextPages;