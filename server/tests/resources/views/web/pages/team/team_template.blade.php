@extends('layouts.app')
@section('content')
    {{Components::currentLocation(Helper::checkInfo($page,'title'))}}
    <div class="container">
        <section class="admission">
            <div class="admission-right">
                <div class="inner-page-title">
                    <h2>{{Helper::checkInfo($page,'title')}}</h2>
                </div>
                <div class="teachers-gallery">
                    @foreach($team as $row)
                            <a href="{{URL::to(Language::current().'/'.Helper::checkInfo($page,'slug').'/'.$row->id.'-'.Helper::checkInfo($row,'slug'))}}" class="teacher-img">
                                <img src="{{Helper::getThumbImage(!is_null($row->info)?$row->info->covers:[],config('files.covers.user_avatar.id'))}}" alt="{{Helper::checkInfo($row,'title')}}">
                                <p class="teacher-name">{{Helper::checkInfo($row,'title')}}</p>
                            </a>
                    @endforeach
                </div>
            </div>
            @widget('sidebarMenu')
        </section>
    </div>
@stop
