import Link from "next/link";
import {useLanguage} from "@/context/LanguageContext";
import LocalizedLink from "@/shared/components/LocalizedLink/LocalizedLink";

interface HeaderTitleProps {
    title: string;
    slug: string
}
export const HeaderTitle = ({ title,slug }: HeaderTitleProps) => {
    const {t} = useLanguage();
    return (
        <div className="text-center">
            <nav>
                <ol className="breadcrumb current-url-box justify-content-center custom-breadcrumb">
                    <li className="breadcrumb-item text_font">
                        <Link href="/">{t('home','home')}</Link>
                    </li>
                    {slug&&<li
                        className="breadcrumb-item text_font active"
                        aria-current="page"
                    >
                        <LocalizedLink href={slug}>{title}</LocalizedLink>
                    </li>}
                </ol>
            </nav>

            <h2
                className="fw-bolder title_font_bold"
                data-aos={"fade-up"}
            >
                {title || null}
            </h2>
        </div>
    );
};
