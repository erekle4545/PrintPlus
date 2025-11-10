import React from "react";
import {Routes, Route} from "react-router-dom";

import NotFound from "../content/page/notFound";
// import MediaList from "../content/media/mediaList";
import Login from "../login/login";
import Users from "../content/users/users";
// import CreateProduct from "../content/product/createProduct";
import SectionIndex from "../template/section/sectionIndex";
import CreateCategory from "../content/category/createCategory";
import CategoryList from "../content/category/categoryList";
import ProductList from "../content/product/productList";
import CreateCustomer from "../content/customers/createCustomer";
import CustomerList from "../content/customers/customerList";
import FilterCategory from "../content/category/filterCategory";
import CreateOrder from "../content/order/createOrder";
import OrderList from "../content/order/orderList";
import CreateUser from "../content/users/createUser";
import Permissions from "../content/users/permission/permissions";
import Roles from "../content/users/role/roles";
import Details from "../content/product/details";
import OrderTransfer from "../content/order/orderTransfer";
import ScrollToTop from "../components/scroll/scrollToTop";




function Router() {

    return(<>
        <ScrollToTop>
            <Routes>
                <Route index element={ <SectionIndex/>} />
                <Route path="/" element={<SectionIndex/>} />
                <Route path="/dashboard" element={<SectionIndex/>} />

                <Route path={'products'}>
                    <Route index element={<ProductList/>}/>
                    {/*<Route path='create' element={<CreateProduct/>}/>*/}
                    {/*<Route path='edit/:id' element={<CreateProduct/>}/>*/}

                </Route>
                <Route path='product/:slug/:id' element={<Details/>}/>


                <Route path={'category'}>
                    <Route index element={<CategoryList/>}/>
                    <Route path='create' element={<CreateCategory/>}/>
                    <Route path='edit/:id' element={<CreateCategory/>}/>
                    <Route path=":slug/:category_id" element={<FilterCategory/>} />
                </Route>

                <Route path={'customers'}>
                    <Route index element={<CustomerList/>}/>
                    <Route path='create' element={<CreateCustomer/>}/>
                    <Route path='edit/:id' element={<CreateCustomer/>}/>
                </Route>

                <Route path={'orders'}>
                    <Route index element={<OrderList/>}/>
                    <Route path='create' element={<CreateOrder/>}/>
                    <Route path='edit/:id' element={<CreateOrder/>}/>
                    <Route path='transfer/:order_id' element={<OrderTransfer/>}/>
                </Route>

                {/*<Route path='media-files' element={<MediaList/>} />*/}
                <Route path={'users'}>
                    <Route  index element={<Users/>} />
                    <Route path='register' element={<CreateUser/>}/>
                    <Route path='permissions/:id' element={<Permissions/>}/>
                    <Route path='roles' element={<Roles/>}/>
                </Route>
                <Route path={'login'} element={<Login/>} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </ScrollToTop>
        </>
    )
}
export default Router;
