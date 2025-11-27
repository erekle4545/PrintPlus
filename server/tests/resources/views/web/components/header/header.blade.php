<!-- Start Main Top -->
<header class="main-header">
    <!-- Start Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light navbar-default bootsnav">
        <div class="container">
            <!-- Start Header Navigation -->
            <div class="navbar-header">
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-menu" aria-controls="navbars-rs-food" aria-expanded="false" aria-label="Toggle navigation">
                    <i class="fa fa-bars"></i>
                </button>

                <a class="navbar-brand" style="font: bold 60px black;" href="{{URL::to(app()->currentLocale())}}">
{{--                    Gm-Parts--}}
                    @if(isset(\app('Contact')->info->covers) && count(\app('Contact')->info->covers) !=0)
                        <img src="{{Helper::getThumbImage(!is_null(\app('Contact')->info)?\app('Contact')->info->covers:[],config('files.covers.header_logo.id'))}}" class="logo" alt="">
                    @else
                        Gm-Parts
                    @endif
                </a>
            </div>
            <!-- End Header Navigation -->

            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse" id="navbar-menu">
                <ul class="nav navbar-nav ml-auto" data-in="fadeInDown" data-out="fadeOutUp">
                    @widget('Menu', ['type' => config('menu.positions.header'), 'view' => 'menu'])

                </ul>
            </div>
            <!-- /.navbar-collapse -->

            <!-- Start Atribute Navigation -->
            <div class="attr-nav">
                <ul>
                    <li class="search"><a href="#"><i class="fa fa-search"></i></a></li>
                    <li class="" style=" text-transform:uppercase">
                            @foreach (Language::languages()  as $language)
                                @php
                                    $url = explode('/', url()->current());
                                    $url[3] = $language;
                                @endphp
                            @if(app()->currentLocale() != $language)
                                <a class="{{app()->currentLocale() == $language?'active':'' }}" href="{{ implode('/', $url) }}" >
                                    {{app()->currentLocale() != $language?$language:'' }}
                                </a>
                            @endif

                            @endforeach
                    </li>
                    <li class="side-menu">
                        <a class="m-hide" href="tel:{{str_replace(' ', '', \app('Contact')->phone) }}" title="{{str_replace(' ', '', \app('Contact')->phone) }}">
                            <i class="fa fa-phone"></i>
{{--                                                        <span class="badge">3</span>--}}
{{--                                                        <p>My Cart</p>--}}
                            <span class=" "> {{\app('Contact')->phone}}</span>
                        </a>
                    </li>
                </ul>
            </div>
            <!-- End Atribute Navigation -->

        </div>

        <div class="w-100 text-right d-phone">
            <a href="tel:{{str_replace(' ', '', \app('Contact')->phone) }}" title="{{str_replace(' ', '', \app('Contact')->phone) }}">
                <i class="fa fa-phone"></i>
                {{--                            <span class="badge">3</span>--}}
                {{--                            <p>My Cart</p>--}}
                <span class=" "> {{\app('Contact')->phone}}</span>
            </a>
        </div>

        <!-- Start Side Menu -->
{{--        <div class="side">--}}
{{--            <a href="#" class="close-side"><i class="fa fa-times"></i></a>--}}
{{--            <li class="cart-box">--}}
{{--                <ul class="cart-list">--}}
{{--                    <li>--}}
{{--                        <a href="#" class="photo"><img src="images/img-pro-01.jpg" class="cart-thumb" alt="" /></a>--}}
{{--                        <h6><a href="#">Delica omtantur </a></h6>--}}
{{--                        <p>1x - <span class="price">$80.00</span></p>--}}
{{--                    </li>--}}
{{--                    <li>--}}
{{--                        <a href="#" class="photo"><img src="images/img-pro-02.jpg" class="cart-thumb" alt="" /></a>--}}
{{--                        <h6><a href="#">Omnes ocurreret</a></h6>--}}
{{--                        <p>1x - <span class="price">$60.00</span></p>--}}
{{--                    </li>--}}
{{--                    <li>--}}
{{--                        <a href="#" class="photo"><img src="images/img-pro-03.jpg" class="cart-thumb" alt="" /></a>--}}
{{--                        <h6><a href="#">Agam facilisis</a></h6>--}}
{{--                        <p>1x - <span class="price">$40.00</span></p>--}}
{{--                    </li>--}}
{{--                    <li class="total">--}}
{{--                        <a href="#" class="btn btn-default hvr-hover btn-cart">VIEW CART</a>--}}
{{--                        <span class="float-right"><strong>Total</strong>: $180.00</span>--}}
{{--                    </li>--}}
{{--                </ul>--}}
{{--            </li>--}}
{{--        </div>--}}
        <!-- End Side Menu -->
    </nav>
    <!-- End Navigation -->

</header>
<!-- End Main Top -->

<!-- Start Top Search -->
<div class="top-search">

    <div class="container">
        <div class="input-group">
            <span class="input-group-addon"><i class="fa fa-search"></i></span>
            <input type="text" class="form-control search-terms" placeholder="{{Language::translate('search')}}">
            <span class="input-group-addon close-search"><i class="fa fa-times"></i></span>
        </div>
        <div class="search_result"></div>
    </div>
</div>
<!-- End Top Search -->

{{--<header>--}}
{{--    <div class="header-area">--}}
{{--        <div class="main-header">--}}
{{--            <div class="header-bottom header-sticky">--}}
{{--                <div class="container-fluid">--}}
{{--                    <div    class="d-flex align-items-center justify-content-between flex-wrap"  >--}}
{{--                        <div class="header-info-left d-flex aling-items-center">--}}
{{--                            <div class="ms-4 me-5" >--}}
{{--                                <a href="{{URL::to(app()->currentLocale())}}" ><img height="100px" src="{{asset('assets/img/logo/logo.png')}}" alt="" /></a>--}}
{{--                            </div>--}}
{{--                            <ul class="address">--}}
{{--                                <li>--}}
{{--                                    <i class="fas fa-map-marker-alt"></i>{{\app('Contact')->info->address}}--}}
{{--                                </li>--}}
{{--                            </ul>--}}
{{--                        </div>--}}
{{--                        <div class="menu-wrapper d-flex align-items-center">--}}
{{--                            <div class="main-menu d-none d-lg-block">--}}
{{--                                <nav>--}}
{{--                                    <ul id="navigation">--}}
{{--                                        @widget('Menu', ['type' => config('menu.positions.header'), 'view' => 'menu'])--}}


{{--                                    </ul>--}}
{{--                                </nav>--}}
{{--                            </div>--}}
{{--                            <div  class="header-right-btn f-right d-flex align-items-center" >--}}
{{--                                <a href="#" class="header-btn2 d-none d-lg-block" ><i class="fas fa-phone-alt"></i> {{\app('Contact')->phone}}</a>--}}
{{--                            </div>--}}
{{--                        </div>--}}

{{--                        <div class="col-12">--}}
{{--                            <div class="mobile_menu d-block d-lg-none"></div>--}}
{{--                        </div>--}}
{{--                    </div>--}}
{{--                </div>--}}
{{--            </div>--}}
{{--        </div>--}}
{{--    </div>--}}
{{--</header>--}}
