@extends('layouts.app')
@section('content')
    <div class="all-title-box"  style="background-image: url('{{Helper::getThumbImage(!is_null($page->info)?$page->info->covers:[],config('files.covers.page_cover.id'))}}');">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <h2>{{Helper::checkInfo($page,'title')}}</h2>
                    <ul class="breadcrumb">
                        <li class="breadcrumb-item"><a href="{{url()->previous() }}">{{Language::translate('back')}}</a></li>
                        <li class="breadcrumb-item active">{{Helper::checkInfo($page,'title')}}</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <div class="shop-detail-box-main">
        <div class="container">
            <div class="row">
                <div class="col-xl-5 col-lg-5 col-md-6">
                    <div id="carousel-example-1" class="single-product-slider carousel slide" data-ride="carousel">
                        @if(count($product->info->covers) > 1)
                            <div class="carousel-inner" role="listbox">
                                @php
                                    foreach($product->info->covers as $key => $row){
                                        if($key = 1){
                                            $k = 'active';
                                        }else{
                                            $k = null;
                                        }
                                        echo '
                                            <div class="carousel-item '.$k.'"> <img class="d-block w-100" src="'.asset($row->output_path).'" alt="First slide"> </div>
                                        ';
                                    }
                                @endphp
                            </div>
                            <a class="carousel-control-prev" href="#carousel-example-1" role="button" data-slide="prev">
                                <i class="fa fa-angle-left" aria-hidden="true"></i>
                                <span class="sr-only">Previous</span>
                            </a>
                            <a class="carousel-control-next" href="#carousel-example-1" role="button" data-slide="next">
                                <i class="fa fa-angle-right" aria-hidden="true"></i>
                                <span class="sr-only">Next</span>
                            </a>
                        @else
                            <img class="d-block w-100" src="{{Helper::getThumbImage(!is_null($product->info)?$product->info->covers:[],config('files.covers.default.id'))}}" alt="First slide">

                        @endif

                       @if(count($product->info->covers) > 1)
                            <ol class="carousel-indicators">
                                @php
                                    foreach($product->info->covers as $row){
                                        echo '
                                         <li data-target="#carousel-example-1" data-slide-to="0" class="active">
                                                <img class="d-block w-100 img-fluid" src="'.asset($row->output_path).'" alt="" />
                                            </li>
                                        ';
                                    }
                                 @endphp
                            </ol>
                        @endif
                    </div>
                </div>
                <div class="col-xl-7 col-lg-7 col-md-6">
                    <div class="single-product-details">
                        <h2>{{$product->info->name}}</h2>
                        <h5>
                            {{$product->sale_price?"<del> $product->price ₾</del> ".number_format($product->sale_price ):number_format($product->price)}} ₾

                        </h5>
{{--                        <p class="available-stock"><span> More than 20 available / <a href="#">8 sold </a></span><p>--}}
                        <h4>{{Language::translate('description')}}:</h4>
                        <p>
                        {!! $product->info->text !!}
                        </p>
{{--                        <ul>--}}
{{--                            <li>--}}
{{--                                <div class="form-group quantity-box">--}}
{{--                                    <label class="control-label">Quantity</label>--}}
{{--                                    <input class="form-control" value="0" min="0" max="20" type="number">--}}
{{--                                </div>--}}
{{--                            </li>--}}
{{--                        </ul>--}}

{{--                        <div class="price-box-bar">--}}
{{--                            <div class="cart-and-bay-btn">--}}
{{--                                <a class="btn hvr-hover" data-fancybox-close="" href="#">Buy New</a>--}}
{{--                                <a class="btn hvr-hover" data-fancybox-close="" href="#">Add to cart</a>--}}
{{--                            </div>--}}
{{--                        </div>--}}

{{--                        <div class="add-to-btn">--}}
{{--                            <div class="add-comp">--}}
{{--                                <a class="btn hvr-hover" href="#"><i class="fas fa-heart"></i> Add to wishlist</a>--}}
{{--                                <a class="btn hvr-hover" href="#"><i class="fas fa-sync-alt"></i> Add to Compare</a>--}}
{{--                            </div>--}}
{{--                            <div class="share-bar">--}}
{{--                                <a class="btn hvr-hover" href="#"><i class="fab fa-facebook" aria-hidden="true"></i></a>--}}
{{--                                <a class="btn hvr-hover" href="#"><i class="fab fa-google-plus" aria-hidden="true"></i></a>--}}
{{--                                <a class="btn hvr-hover" href="#"><i class="fab fa-twitter" aria-hidden="true"></i></a>--}}
{{--                                <a class="btn hvr-hover" href="#"><i class="fab fa-pinterest-p" aria-hidden="true"></i></a>--}}
{{--                                <a class="btn hvr-hover" href="#"><i class="fab fa-whatsapp" aria-hidden="true"></i></a>--}}
{{--                            </div>--}}
{{--                        </div>--}}
                    </div>
                </div>
            </div>

            <div class="row my-5">
                <div class="card card-outline-secondary  col-xl-12">
                    <div class="card-header">
                        <h2>{{Language::translate('commnets')}}</h2>
                    </div>
                    <div class="card-body  ">
                        <div id="fb-root"></div>

                        <div class="fb-comments col-12" data-href="{{url()->current()}}" data-width="100%" data-numposts="5"></div>

                        {{--                        <div class="media mb-3">--}}
{{--                            <div class="mr-2">--}}
{{--                                <img class="rounded-circle border p-1" src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_160c142c97c%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_160c142c97c%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2213.5546875%22%20y%3D%2236.5%22%3E64x64%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" alt="Generic placeholder image">--}}
{{--                            </div>--}}
{{--                            <div class="media-body">--}}
{{--                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis et enim aperiam inventore, similique necessitatibus neque non! Doloribus, modi sapiente laboriosam aperiam fugiat laborum. Sequi mollitia, necessitatibus quae sint natus.</p>--}}
{{--                                <small class="text-muted">Posted by Anonymous on 3/1/18</small>--}}
{{--                            </div>--}}
{{--                        </div>--}}
{{--                        <hr>--}}
{{--                        <div class="media mb-3">--}}
{{--                            <div class="mr-2">--}}
{{--                                <img class="rounded-circle border p-1" src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_160c142c97c%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_160c142c97c%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2213.5546875%22%20y%3D%2236.5%22%3E64x64%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" alt="Generic placeholder image">--}}
{{--                            </div>--}}
{{--                            <div class="media-body">--}}
{{--                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis et enim aperiam inventore, similique necessitatibus neque non! Doloribus, modi sapiente laboriosam aperiam fugiat laborum. Sequi mollitia, necessitatibus quae sint natus.</p>--}}
{{--                                <small class="text-muted">Posted by Anonymous on 3/1/18</small>--}}
{{--                            </div>--}}
{{--                        </div>--}}
{{--                        <hr>--}}
{{--                        <div class="media mb-3">--}}
{{--                            <div class="mr-2">--}}
{{--                                <img class="rounded-circle border p-1" src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_160c142c97c%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_160c142c97c%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2213.5546875%22%20y%3D%2236.5%22%3E64x64%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" alt="Generic placeholder image">--}}
{{--                            </div>--}}
{{--                            <div class="media-body">--}}
{{--                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis et enim aperiam inventore, similique necessitatibus neque non! Doloribus, modi sapiente laboriosam aperiam fugiat laborum. Sequi mollitia, necessitatibus quae sint natus.</p>--}}
{{--                                <small class="text-muted">Posted by Anonymous on 3/1/18</small>--}}
{{--                            </div>--}}
{{--                        </div>--}}
{{--                        <hr>--}}
{{--                        <a href="#" class="btn hvr-hover">Leave a Review</a>--}}
                    </div>
                </div>
            </div>
            @if(count($otherProduct) > 3)
                <div class="row my-5">
                    <div class="col-lg-12">
                        <div class="title-all text-center">
                            <h1>{{Language::translate('featured_products')}}</h1>
                            <p>{{Language::translate('featured_products_text')}}</p>
                        </div>
                        <div class="featured-products-box owl-carousel owl-theme">

                            @foreach($otherProduct as $row)
                            <div class="item">
                                <div class="products-single fix">
                                    <div class="box-img-hover">
                                        <img src="{{Helper::getThumbImage(!is_null($row->info)?$row->info->covers:[],config('files.covers.default.id'))}}" class="img-fluid" alt="Image">
                                        <div class="mask-icon">
    {{--                                        <ul>--}}
    {{--                                            <li><a href="#" data-toggle="tooltip" data-placement="right" title="View"><i class="fas fa-eye"></i></a></li>--}}
    {{--                                            <li><a href="#" data-toggle="tooltip" data-placement="right" title="Compare"><i class="fas fa-sync-alt"></i></a></li>--}}
    {{--                                            <li><a href="#" data-toggle="tooltip" data-placement="right" title="Add to Wishlist"><i class="far fa-heart"></i></a></li>--}}
    {{--                                        </ul>--}}
                                            <a  class="cart" href="{{Helper::makeUrl($page->info->slug.'/'.$row->id.'-'.$row->info->slug)}}">{{Language::translate('details')}}</a>
                                        </div>
                                    </div>
                                    <div class="why-text">
                                        <a href="{{Helper::makeUrl($page->info->slug.'/'.$row->id.'-'.$row->info->slug)}}"><h4>{{$row->info->name}}</h4></a>
                                        <h5> {{$row->sale_price?:$row->price}} ₾</h5>
                                    </div>
                                </div>
                            </div>
                            @endforeach



                        </div>
                    </div>
                </div>
            @endif
        </div>
    </div>
@stop
