@extends('layouts.app')
@section('content')

    <div class="slider-area slider-bg4" style="background-image: url({{Helper::getThumbImage(!is_null($page->info)?$page->info->covers:[],config('files.covers.page_cover.id'))}});">
        <div  class="single-slider hero-overly d-flex align-items-center slider-height2" >
            <div class="container">
                <div class="row">
                    <div class="col-xl-7 col-lg-6 col-md-8">
                        <div class="hero__caption hero__caption2 pt-50">
                            <h1>{{Helper::checkInfo($page,'title')}}</h1>
                            <p>
                                {{Helper::checkInfo($page,'description')}}

                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="container box_1170">
            <div class="section-top-border">
                <h3 class="mb-30">{{$news->info->title}}</h3>
                <div class="singleNewsDate">
                    <span>{{Carbon\Carbon::parse($news->created_at)->format('d')}}</span>
                    <span>{{Carbon\Carbon::parse($news->created_at)->format('M')}}</span>
                    <span>{{Carbon\Carbon::parse($news->created_at)->format('Y')}}</span>
                </div>
                <div class="row">
                    <div class="col-md-3">
                        <img src="{{Helper::getThumbImage(!is_null($news->info)?$news->info->covers:[],config('files.covers.default.id'))}}" alt="{{$news->info->title}}" class="img-fluid">
                    </div>
                    <div class="col-md-9 mt-sm-20">
                        {!! $news->info->text !!}
                    </div>
                </div>

            </div>

        <div class="news-main row" data-aos="fade-up">

        </div>

        <div class="section-top-border">
            <h3 class="mb-30">Other Projects</h3>
            <div class="row">
                @foreach($otherNews as $row)
                    <div class="col-xl-4">
                        <div class="single-defination">
                            <a href="{{Helper::makeUrl($page->info->slug.'/'.$row->id.'-'.$row->info->slug)}}">
                                <h4 class="mb-20">{{$row->info->title}}</h4>
                                <img width="100%" src="{{Helper::getThumbImage(!is_null($row->info)?$row->info->covers:[],config('files.covers.default.id'))}}" alt="{{Helper::checkInfo($row,'title')}}">
                            </a>
                            <p> {{$row->info->description}}</p>
                        </div>
                    </div>

                @endforeach


            </div>
        </div>
    </div>


@stop
