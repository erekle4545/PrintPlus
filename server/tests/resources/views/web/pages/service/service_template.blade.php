@extends('layouts.app')
@section('content')

    <div class="all-title-box"  style="background-image: url('{{Helper::getThumbImage(!is_null($servicesPage->info)?$servicesPage->info->covers:[],config('files.covers.page_cover.id'))}}');">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <h2>{{Helper::checkInfo($servicesPage,'title')}}</h2>
                    <ul class="breadcrumb">
                        <li class="breadcrumb-item"><a href="{{url()->previous() }}">{{Language::translate('back')}}</a></li>
                        <li class="breadcrumb-item active">{{Helper::checkInfo($servicesPage,'title')}}</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    @if(isset($services))
        @foreach($services as $row)
            <div class="about-box-main" style="padding: 20px 0px;">
                <div class="container my-news-cards">
                    <div class="row">
                        <div class="col-lg-4">
                            <a href="{{Helper::makeUrl($servicesPage->info->slug.'/'.$row->id.'-'.$row->info->slug)}}" class="banner-frame"> <img  class="img-fluid" src="{{Helper::getThumbImage(!is_null($row->info)?$row->info->covers:[],config('files.covers.default.id'))}}" alt="" />
                            </a>
                        </div>
                        <div class="col-lg-8">
                            <a class="text-dark" href="{{Helper::makeUrl($servicesPage->info->slug.'/'.$row->id.'-'.$row->info->slug)}}"> <h2 class="noo-sh-title-top mt-3">{{Helper::checkInfo($row,'title')}}</h2></a>
                            {{$row->info->description}}
                            <div>
                                <a class="btn hvr-hover" href="{{Helper::makeUrl($servicesPage->info->slug.'/'.$row->id.'-'.$row->info->slug)}}">{{Language::translate('readMore')}}</a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        @endforeach
        <div class="pagination">
            {{ $services->fragment('foo')->links('pagination::bootstrap-4') }}

        </div>
    @endif

{{--    <div class="slider-area slider-bg4" style="background-image: url('{{Helper::getThumbImage(!is_null($servicesPage->info)?$servicesPage->info->covers:[],config('files.covers.page_cover.id'))}}');">--}}
{{--        <div  class="single-slider hero-overly d-flex align-items-center slider-height2" >--}}
{{--            <div class="container">--}}
{{--                <div class="row">--}}
{{--                    <div class="col-xl-7 col-lg-6 col-md-8">--}}
{{--                        <div class="hero__caption hero__caption2 pt-50">--}}
{{--                            <h1>{{Helper::checkInfo($servicesPage,'title')}}</h1>--}}
{{--                            <p>--}}
{{--                                {{Helper::checkInfo($servicesPage,'description')}}--}}

{{--                            </p>--}}
{{--                        </div>--}}
{{--                    </div>--}}
{{--                </div>--}}
{{--            </div>--}}
{{--        </div>--}}
{{--    </div>--}}

{{--    <section class="services-section section-padding40 section-bg2 fix" data-background="assets/img/gallery/section-bg3.png" >--}}
{{--        <div class="container-fluid">--}}
{{--            <div class="row">--}}

{{--                <div class="col-xl-12 offset-xl-1 col-lg-12">--}}
{{--                    @if(isset($services))--}}
{{--                        @foreach($services as $row)--}}
{{--                            <div class="row align-items-center">--}}
{{--                                <div class="col-xl-7 col-lg-8 col-md-8 col-sm-8">--}}
{{--                                    <div class="single-cat">--}}
{{--                                        <div class="cat-icon">--}}
{{--                                            <img src="{{Helper::getThumbImage(!is_null($row->info)?$row->info->covers:[],config('files.covers.default.id'))}}" alt="{{Helper::checkInfo($row,'title')}}" />--}}
{{--                                        </div>--}}
{{--                                    </div>--}}
{{--                                </div>--}}
{{--                                <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4">--}}
{{--                                    <div class="single-cat mb-30">--}}
{{--                                        <div class="cat-cap">--}}
{{--                                            <h5>--}}
{{--                                                <a href="{{URL::to(Language::current().'/'.Helper::checkInfo($servicesPage,'slug').'/'.$row->id.'-'.Helper::checkInfo($row,'slug'))}}"--}}
{{--                                                >{{Helper::checkInfo($row,'title')}}</a >--}}
{{--                                            </h5>--}}
{{--                                            <p>--}}
{{--                                                {{Helper::checkInfo($row,'description')}}--}}
{{--                                            </p>--}}
{{--                                            <a href="{{URL::to(Language::current().'/'.Helper::checkInfo($servicesPage,'slug').'/'.$row->id.'-'.Helper::checkInfo($row,'slug'))}}" class="browse-btn">Explore Now</a>--}}
{{--                                        </div>--}}
{{--                                    </div>--}}
{{--                                </div>--}}
{{--                            </div>--}}

{{--                        @endforeach--}}
{{--                    @endif--}}
{{--                </div>--}}
{{--            </div>--}}
{{--        </div>--}}
{{--    </section>--}}
{{--    <br/>--}}
{{--    <div class="pagination d-flex justify-content-center m-5">--}}
{{--        {{ $services->fragment('foo')->links('pagination::bootstrap-4') }}--}}
{{--    </div>--}}
{{--    <br/>--}}
@endsection
