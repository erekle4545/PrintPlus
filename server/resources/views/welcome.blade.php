<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>orqidea.ge</title>
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="home" content="/{{ app()->getLocale() }}">
        <link rel="apple-touch-icon" href="https://orqidea.ge/images/fab.png" />
        <link type="text/css" rel="stylesheet" href="{{asset('css/style.css')}}">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <link rel="canonical" href="https://orqidea.ge" />
        <meta name="robots" content="index,follow,all">
        <meta name="google-site-verification" content="1GnTqrxfi-DX4qpi3PDTbrGnX1MHrtBcRdYIeocOia0" />
        <meta name="robots" content="noindex">

        {{Helper::appSeo()}}

        <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
            integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
            crossorigin="anonymous"
        />

        <script src="https://cdn.jsdelivr.net/npm/react/umd/react.production.min.js" crossorigin></script>
        <script src="https://cdn.jsdelivr.net/npm/react-dom/umd/react-dom.production.min.js" crossorigin></script>
        <script src="https://cdn.jsdelivr.net/npm/react-bootstrap@next/dist/react-bootstrap.min.js"  crossorigin></script>
    </head>
    <body>
    <div id="root"></div>
        @vitereactrefresh
        @vite('resources/js/app.jsx')
    </body>
</html>
