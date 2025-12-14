'use client';

import Link from 'next/link';
import MenuArrow from '@/shared/assets/icons/menu/menuArrow.svg';

export default function DesktopMenu() {

    return (
        <div className="main-menu d-none d-xl-flex align-items-center gap-4">
            <div className="dropdown">
                <div className="menu-link d-inline-flex align-items-center gap-1">
                    ჩვენ შესახებ <MenuArrow />
                </div>
                <ul className="dropdown-menu">
                    <li>
                        <Link href="/pages/about" className="dropdown-item">კომპანია</Link>
                    </li>
                    <li>
                        <Link href="/pages/gallery" className="dropdown-item">გალერეა</Link>
                    </li>
                    <li>
                        <Link href="/pages/brands" className="dropdown-item">ბრენდი</Link>
                    </li>
                    <li>
                        <Link href="/pages/products" className="dropdown-item">პროდუქტები</Link>
                    </li>
                    <li>
                        <Link href="/pages/calculate/page" className="dropdown-item">კალკულატორის გვერდი</Link>
                    </li>
                    <li>
                        <Link href="/pages/borders" className="dropdown-item">ჩარცოები</Link>
                    </li>
                    <li>
                        <Link href="/pages/text/test" className="dropdown-item">ტექსტური გვერდი</Link>
                    </li>
                </ul>
            </div>
            <div className="dropdown">
                <div className="menu-link d-inline-flex align-items-center gap-1">
                    მომსახურება <MenuArrow />
                </div>
                <ul className="dropdown-menu">
                    <li className="dropdown-submenu position-relative">
                        <div className="dropdown-item d-inline-flex align-items-center gap-1">
                            ბრენდი <MenuArrow />
                        </div>
                        <ul className="dropdown-menu position-absolute">
                            <li>
                                <Link href="/services/print-on-pillows" className="dropdown-item">ბალიშზე ბეჭდვა</Link>
                            </li>
                            <li>
                                <Link href="/services/mugs" className="dropdown-item">ჭიქებზე ბეჭდვა</Link>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <Link href="/services/design" className="dropdown-item">დიზაინი</Link>
                    </li>
                </ul>
            </div>

            <Link href="/pages/products" className="menu-link">პროდუქტები</Link>
            <Link href="/faq" className="menu-link">FAQ</Link>
        </div>
    );
}


