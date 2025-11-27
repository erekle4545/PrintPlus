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

    <div class="about-box-main">
        <div class="container">
            <div class="row">
                <div class="col-lg-4">
                    <div class="banner-frame"> <img width="100%" class="img-fluid" src="{{Helper::getThumbImage(!is_null($page->info)?$page->info->covers:[],config('files.covers.default.id'))}}" alt="{{Helper::checkInfo($page,'title')}}"  />
                    </div>
                </div>
                <div class="col-lg-8">
                    <h2 class="noo-sh-title-top">{{Helper::checkInfo($page,'title')}}</h2>
                    {!! $page->info->text !!}
                </div>
            </div>
        </div>
    </div>


@stop
