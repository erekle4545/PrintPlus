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

    <section class="popular-item-area fix section-padding40">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-xl-6 col-lg-6 col-md-10">
                    <div class="section-tittle text-center mb-60">
                        <h2>{{Helper::checkInfo($page,'title')}}</h2>
                        <p>
{{--                            {{Helper::checkInfo($page,'description')}}--}}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="row">

                @foreach($projects as $row)

                    <div class="col-lg-6">
                        <div class="single-items mb-30">
                            <div class="items-img">
                                <img style="height: auto !important;"
                                    src="{{Helper::getThumbImage(!is_null($row->info)?$row->info->covers:[],config('files.covers.default.id'))}}"
                                    alt="{{Helper::checkInfo($row,'title')}}"/>
                                <section class="wantToWork-area2">
                                    <div class="wants-wrapper">
                                        <a href="{{Helper::makeUrl($page->info->slug.'/'.$row->id.'-'.$row->info->slug)}}">
                                             <div class="wantToWork-caption">
                                                <h2>{{Helper::checkInfo($row,'title')}}</h2>
                                                <p> {{Str::words(Helper::checkInfo($row,'description'),30)}}</p>
                                            </div>
                                        </a>
                                    </div>

                                </section>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
            <div class="pagination d-flex justify-content-center">
                {{ $projects->fragment('foo')->links('pagination::bootstrap-4') }}

            </div>
        </div>
    </section>

@endsection
