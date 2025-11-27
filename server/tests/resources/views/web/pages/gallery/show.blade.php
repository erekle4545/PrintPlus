@extends('layouts.app')
@section('content')
    {{Components::currentLocation(Helper::checkInfo($gallery,'title'))}}
    <section>
        <div class="container">
            <div class="gallery-title">
                <h2>გალერეა</h2>
            </div>
            <div class="single-image-gallery-title">
                <p>{{Helper::checkInfo($gallery,'title')}}</p>
            </div>
            <div class="single-image-gallery">
                @foreach($gallery->info->covers as $row)

                    @if($row->cover_type === config('files.covers.gallery.id'))
                        <a class="example-image-link" href="{{Helper::galleryImages($row,'popup')}}" data-lightbox="example-set">
                            <img class="example-image" src="{{Helper::galleryImages($row,null)}}" />
                        </a>
                    @endif
                @endforeach
            </div>
        </div>
    </section>
@stop
