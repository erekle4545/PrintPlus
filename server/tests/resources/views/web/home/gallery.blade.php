@if($gallery)
    <div class="instagram-box">
        <div class="main-instagram owl-carousel owl-theme">
            @foreach($gallery as $row)
                <div class="item">
                    <div class="ins-inner-box">
                        <img height="300" src="{{Helper::getThumbImage(!is_null($row->info)?$row->info->covers:[],config('files.covers.gallery_thumb.id'))}}" alt="{{Helper::checkInfo($row,'title')}}" />
                        <div class="hov-in">
        {{--                    <a href="#"><i class="fab fa-instagram"></i></a>--}}
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    </div>
@endif
