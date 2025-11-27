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

    <div class="about-box-main">
        <div class="container">
            <div class="row">
                <div class="col-lg-4">
                    <div class="banner-frame"> <img width="100%" class="img-fluid" src="{{Helper::getThumbImage(!is_null($services->info)?$services->info->covers:[],config('files.covers.default.id'))}}" alt="" />
                    </div>
                </div>
                <div class="col-lg-8">
                    <h2 class="noo-sh-title-top">{{Helper::checkInfo($services,'title')}}</h2>
                    {{Carbon\Carbon::parse($services->created_at)->format('Y M d')}}
                    {!! $services->info->text !!}

                </div>
            </div>

        </div>
    </div>

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
{{--    <section class="services-section section-padding40 section-bg2 fix " data-background="assets/img/gallery/section-bg3.png" >--}}
{{--        <div class="container-fluid">--}}
{{--            <div class="row">--}}

{{--                <div class="col-xl-12 offset-xl-1 col-lg-12">--}}
{{--                    @if(isset($services))--}}

{{--                            <div class="row align-items-center">--}}
{{--                                <div class="col-xl-4 col-lg-8 col-md-8 col-sm-8">--}}
{{--                                    <div class="single-cat">--}}
{{--                                        <div class="cat-icon">--}}
{{--                                            <img src="{{Helper::getThumbImage(!is_null($services->info)?$services->info->covers:[],config('files.covers.default.id'))}}" alt="{{Helper::checkInfo($services,'title')}}" />--}}
{{--                                        </div>--}}
{{--                                    </div>--}}
{{--                                </div>--}}
{{--                                <div class="col-xl-7 col-lg-7 col-md-12 col-sm-12">--}}
{{--                                    <div class="single-cat mb-30">--}}
{{--                                        <div class="cat-cap">--}}
{{--                                            <h5>--}}
{{--                                                <a href="{{URL::to(Language::current().'/'.Helper::checkInfo($servicesPage,'slug').'/'.$services->id.'-'.Helper::checkInfo($services,'slug'))}}"--}}
{{--                                                >{{Helper::checkInfo($services,'title')}}</a >--}}
{{--                                            </h5>--}}
{{--                                            <p>--}}
{{--                                                {!! $services->info->text !!}--}}
{{--                                            </p>--}}
{{--                                        </div>--}}
{{--                                    </div>--}}
{{--                                </div>--}}
{{--                            </div>--}}


{{--                    @endif--}}


{{--                </div>--}}
{{--            </div>--}}
{{--        </div>--}}
{{--    </section>--}}


@stop
