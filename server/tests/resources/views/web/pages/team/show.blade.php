@extends('layouts.app')
@section('content')
    {{Components::currentLocation(Helper::checkInfo($page,'title'))}}
    <div class="container">
        <section class="admission">
            <div class="admission-right">
                <div class="inner-page-title">
                    <h2>{{Helper::checkInfo($page,'title')}}</h2>
                </div>
                <div class="single-teacher">
                    <div class="single-teacher-img">
                        <img src="{{Helper::getThumbImage(!is_null($team->info)?$team->info->covers:[],config('files.covers.user_avatar.id'))}}" alt="{{Helper::checkInfo($team,'title')}}">
                    </div>
                    <div class="single-teacher-desc">
                        <div class="single-teacher-name">
                            <h3>{{Helper::checkInfo($team,'title')}}</h3>
                        </div>
                        <div class="single-teacher-desc">
                            {!! $team->info->text !!}
                        </div>
                    </div>
                </div>
            </div>
            @widget('sidebarMenu')
        </section>
    </div>
@stop
