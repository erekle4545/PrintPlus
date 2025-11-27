@extends('layouts.app')
@section('content')
{{--    {{Components::currentLocation(Helper::checkInfo($page,'title'))}}--}}
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

<div class="about-box-main">
    <div class="container">
        <div class="row">
            <div class="col-lg-4">
                <div class="banner-frame"> <img width="100%" class="img-fluid" src="{{Helper::getThumbImage(!is_null($news->info)?$news->info->covers:[],config('files.covers.default.id'))}}" alt="" />
                </div>
            </div>
            <div class="col-lg-8">
                <h2 class="noo-sh-title-top">{{Helper::checkInfo($news,'title')}}</h2>
                {{Carbon\Carbon::parse($news->created_at)->format('Y M d')}}
                {!! $news->info->text !!}

            </div>
        </div>
        <div class="row my-4">
            <div class="col-12">
                <h2 class="noo-sh-title">{{Language::translate('otherArticle')}}</h2>
            </div>
            @foreach($otherNews as $row)

                <div class="col-sm-6 col-lg-3">
                    <div class="hover-team">
                        <a href="{{Helper::makeUrl($page->info->slug.'/'.$row->id.'-'.$row->info->slug)}}" class="our-team">
                            <img src="{{Helper::getThumbImage(!is_null($row->info)?$row->info->covers:[],config('files.covers.default.id'))}}" alt="" />
                            <a href="{{Helper::makeUrl($page->info->slug.'/'.$row->id.'-'.$row->info->slug)}}" class="team-content">
                                <h3 class="title">{{$row->info->title}} </h3>
                            </a>
{{--                            <ul class="social">--}}
{{--                                <li>--}}
{{--                                    <a href="#" class="fab fa-facebook"></a>--}}
{{--                                </li>--}}
{{--                                <li>--}}
{{--                                    <a href="#" class="fab fa-twitter"></a>--}}
{{--                                </li>--}}
{{--                                <li>--}}
{{--                                    <a href="#" class="fab fa-google-plus"></a>--}}
{{--                                </li>--}}
{{--                                <li>--}}
{{--                                    <a href="#" class="fab fa-youtube"></a>--}}
{{--                                </li>--}}
{{--                            </ul>--}}
{{--                            <div  class="icon"> <i class="fa fa-plus" aria-hidden="true"></i> </div>--}}
                        </a>
                        <div class="team-description">
                            <p> {{$row->info->description}} </p>
                        </div>
                        <hr class="my-0"> </div>
                </div>
            @endforeach
        </div>
    </div>
</div>


@stop
