import Link from "next/link";

interface HeaderTitleProps {
    title: string;
    slug: []
}
export const HeaderTitle = ({ title,slug }: HeaderTitleProps) => {

    return (
        <div className="text-center">
            <nav>
                <ol className="breadcrumb current-url-box justify-content-center custom-breadcrumb">
                    <li className="breadcrumb-item text_font">
                        <Link href="/">მომსახაურება</Link>
                    </li>
                    <li
                        className="breadcrumb-item text_font active"
                        aria-current="page"
                    >
                        ბრენირება
                    </li>
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
