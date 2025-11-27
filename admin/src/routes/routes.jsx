import React from "react";
import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import Layout from "../components/layout/Layout";

// Pages
import Home from "../modules/homePage";
import MenuList from "../modules/menu/menuList";
import CreatePage from "../modules/page/createPage";
import PageList from "../modules/page/pageList";
import CreatePost from "../modules/content/post/createPost";
import PostList from "../modules/content/post/postList";
import CreateService from "../modules/content/services/createService";
import ServiceList from "../modules/content/services/serviceList";
import CreateCategory from "../modules/category/createCategory";
import CategoryList from "../modules/category/categoryList";
import CreateProduct from "../modules/products/createProduct";
import ProductList from "../modules/products/productList";
import CreateSlider from "../modules/content/slider/createSlider";
import SliderList from "../modules/content/slider/sliderList";
import CreateTeam from "../modules/content/team/createTeam";
import TeamList from "../modules/content/team/TeamList";
import CreateGallery from "../modules/content/gallery/createGallery";
import GalleryList from "../modules/content/gallery/galleryList";
import MediaList from "../modules/media/mediaList";
import CreateLang from "../language/createLang";
import Users from "../modules/users/users";
import Dictionary from "../modules/dictionary/dictionary";
import Settings from "../modules/settings/settings";

import Login from "../modules/login/login";
import NotFound from "../components/tamplate/notFound";

function Router() {
    return (
        <Routes>

            {/* PUBLIC */}
            <Route path="/login" element={<Login />} />

            {/* PROTECTED */}
            <Route element={<ProtectedRoute />}>
                {/* Layout wrapper */}
                <Route element={<Layout />}>

                    {/* Dashboard / Home */}
                    <Route index element={<Home />} />
                    <Route path="/" element={<Home />} />
                    <Route path="dashboard/*" element={<Home />} />

                    {/* Menu */}
                    <Route path="menu" element={<MenuList />} />
                    <Route path="menu/edit/:id" element={<MenuList />} />

                    {/* Page */}
                    <Route path="page/create" element={<CreatePage />} />
                    <Route path="page/edit/:id" element={<CreatePage />} />
                    <Route path="pages" element={<PageList />} />

                    {/* Post */}
                    <Route path="post/create" element={<CreatePost />} />
                    <Route path="post/edit/:id" element={<CreatePost />} />
                    <Route path="posts" element={<PostList />} />

                    {/* Service */}
                    <Route path="service/create" element={<CreateService />} />
                    <Route path="service/edit/:id" element={<CreateService />} />
                    <Route path="service" element={<ServiceList />} />

                    {/* Category */}
                    <Route path="category/create" element={<CreateCategory />} />
                    <Route path="category/edit/:id" element={<CreateCategory />} />
                    <Route path="categories" element={<CategoryList />} />

                    {/* Product */}
                    <Route path="product/create" element={<CreateProduct />} />
                    <Route path="product/edit/:id" element={<CreateProduct />} />
                    <Route path="products" element={<ProductList />} />

                    {/* Slider */}
                    <Route path="slider/create" element={<CreateSlider />} />
                    <Route path="slider/edit/:id" element={<CreateSlider />} />
                    <Route path="sliders" element={<SliderList />} />

                    {/* Team */}
                    <Route path="team/create" element={<CreateTeam />} />
                    <Route path="team/edit/:id" element={<CreateTeam />} />
                    <Route path="team" element={<TeamList />} />

                    {/* Gallery */}
                    <Route path="gallery/create" element={<CreateGallery />} />
                    <Route path="gallery/edit/:id" element={<CreateGallery />} />
                    <Route path="gallery" element={<GalleryList />} />

                    {/* Settings */}
                    <Route path="settings" element={<Settings />} />
                    <Route path="settings/edit/:id" element={<Settings />} />

                    {/* Others */}
                    <Route path="media-files" element={<MediaList />} />
                    <Route path="lang" element={<CreateLang />} />
                    <Route path="users" element={<Users />} />
                    <Route path="dictionary" element={<Dictionary />} />

                </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />

        </Routes>
    );
}

export default Router;
