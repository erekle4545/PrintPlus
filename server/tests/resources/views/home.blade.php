@extends('layouts.app')
@section('content')
    @include('web.home.slider')
    @include('web.home.categories')
    @include('web.home.banners')
    @include('web.home.products')
    @include('web.home.blog')
    @include('web.home.gallery')
{{--    @include('web.components.footer.contact')--}}
@endsection
