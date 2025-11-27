@php use Illuminate\Support\Str; @endphp
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

    @foreach($news as $row)
        <div class="about-box-main" style="padding: 20px 0px;">
            <div class="container my-news-cards">
                <div class="row">
                    <div class="col-lg-4">
                        <a href="{{Helper::makeUrl($page->info->slug.'/'.$row->id.'-'.$row->info->slug)}}" class="banner-frame"> <img  class="img-fluid" src="{{Helper::getThumbImage(!is_null($row->info)?$row->info->covers:[],config('files.covers.default.id'))}}" alt="" />
                        </a>
                    </div>
                    <div class="col-lg-8">
                       <a class="text-dark" href="{{Helper::makeUrl($page->info->slug.'/'.$row->id.'-'.$row->info->slug)}}"> <h2 class="noo-sh-title-top mt-3">{{Helper::checkInfo($row,'title')}}</h2></a>
                        {{$row->info->description}}
                        <div>
                        <a class="btn hvr-hover" href="{{Helper::makeUrl($page->info->slug.'/'.$row->id.'-'.$row->info->slug)}}">{{Language::translate('readMore')}}</a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    @endforeach
    <div class="pagination">
        {{ $news->fragment('foo')->links('pagination::bootstrap-4') }}

    </div>




@stop
