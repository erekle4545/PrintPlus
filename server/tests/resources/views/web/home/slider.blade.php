

@if($slider)
    <div id="slides-shop" class="cover-slides">
        <ul class="slides-container">
            @foreach($slider as $row)
            <li class="text-center">
                <img src="{{Helper::getThumbImage(!is_null($row->info)?$row->info->covers:[],config('files.covers.default.id'))}}" alt="{{Helper::checkInfo($row,'title')}}">
                <div class="container">
                    <div class="row">
                        <div class="col-md-12">
                            <h1 class="m-b-20"><strong>{{Helper::checkInfo($row,'title')}}</strong></h1>
                            <p class="m-b-40"> {{strip_tags(Helper::checkInfo($row,'description'))}}</p>
                            <p><a class="btn hvr-hover"  href="{{$row->slug}}" target="_blank">{{Language::translate('targetLink')}}</a></p>
                        </div>
                    </div>
                </div>
            </li>
            @endforeach

        </ul>
        <div class="slides-navigation">
            <a href="#" class="next"><i class="fa fa-angle-right" aria-hidden="true"></i></a>
            <a href="#" class="prev"><i class="fa fa-angle-left" aria-hidden="true"></i></a>
        </div>
    </div>


@endif
