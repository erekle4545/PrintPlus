@php use App\Helpers\Core\Helper; @endphp
    <!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="home" content="/{{ app()->getLocale() }}">


    @php
        $title = Helper::appSeo('title');
        if (isset($metaTitle)) {
            $title = $metaTitle;
        }
        if (!empty($articleMetas['title'])) {
            $title = $articleMetas['title'];
        }

        $description = Helper::appSeo('description');
        if (isset($metaDescription)) {
            $description = $metaDescription;
        }
        if (!empty($articleMetas['descr'])) {
            $description = $articleMetas['descr'];
        }
        $url = url()->current();

        if (isset($metaUrl)) {
            $url = $metaUrl;
        }

        $_image = Helper::appSeo('image');
        if (isset($shareImage) && $shareImage != '/assets/no-preview.jpg') {
            $_image = $shareImage;
        }
        if (!empty($articleMetas['image']) && $articleMetas['image'] != '/assets/no-preview.jpg') {
            $_image = $articleMetas['image'];
        }
    @endphp
    <title>{{ $title }}</title>
    <meta name="description" content="{{ $description  }}">
    <meta name="keywords" content="{{ isset($metaKeywords) ? $metaKeywords : Helper::appSeo('keywords') }}">
    <link rel="canonical" href="{{URL::current()}}"/>
    <meta property="og:url" content="{{ $url }}">
    <meta property="og:site_name" content="">
    <meta property="og:title" content="{{ $title }}"/>
    <meta property="og:type" content="{{ !empty($articleMetas) ? $articleMetas['type'] : 'website' }}">
    <meta property="og:image:width" content="600"/>
    <meta property="og:image:height" content="315"/>
    <meta property="og:image" content="{{ $_image }}"/>
    <meta property="og:description" content="{{ $description }}"/>
    <meta property="fb:app_id" content="{{ Helper::appSeo('fb_api') }}"/>
    <meta name="robots" content="index,follow,all">
    <meta name="robots" content="noindex, nofollow">
    <meta itemprop="name" content=""/>
    <meta itemprop="image" content="{{ $_image }}"/>
    <meta name="twitter:title" content="{{ $title }}"/>
    <meta name="twitter:url" content="{{ url()->current() }}"/>
    <meta name="twitter:type" content="{{ !empty($articleMetas) ? $articleMetas['type'] : '' }}">
    <meta name="twitter:description" content="{{ $description }}"/>
    <meta name="twitter:image" content="{{ $_image }}"/>
    {{--    css styles --}}
    <link rel="stylesheet" href="{{asset('assets/css/bootstrap.min.css')}}"/>
    <link rel="stylesheet" href="{{asset('assets/css/responsive.css')}}"/>
    <link rel="stylesheet" href="{{asset('assets/css/custom.css')}}"/>
    <link rel="stylesheet" href="{{asset('assets/css/style.css')}}"/>
    <link rel="stylesheet" href="{{asset('css/web/app.css')}}"/>

</head>
<body>
@include('web.components.header.header')
<main>
    @yield('content')
</main>
@include('web.components.footer.footer')
<!-- custom js -->
<script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v16.0"></script>

<script src="{{asset('assets/js/jquery-3.2.1.min.js')}}"></script>
<script src="{{asset('assets/js/popper.min.js')}}"></script>
<script src="{{asset('assets/js/bootstrap.min.js')}}"></script>

<script src="{{asset('assets/js/jquery.superslides.min.js')}}"></script>
<script src="{{asset('assets/js/bootstrap-select.js')}}"></script>
<script src="{{asset('assets/js/inewsticker.js')}}"></script>
<script src="{{asset('assets/js/bootsnav.js')}}"></script>
<script src="{{asset('assets/js/images-loded.min.js')}}"></script>
<script src="{{asset('assets/js/isotope.min.js')}}"></script>
<script src="{{asset('assets/js/owl.carousel.min.js')}}"></script>
<script src="{{asset('assets/js/baguetteBox.min.js')}}"></script>
<script src="{{asset('assets/js/form-validator.min.js')}}"></script>
<script src="{{asset('assets/js/contact-form-script.js')}}"></script>
<script src="{{asset('assets/js/custom.js')}}"></script>
<script src="{{asset('assets/js/main.js')}}"></script>
<script src="{{asset('js/web/app.js')}}"></script>
</body>
</html>



