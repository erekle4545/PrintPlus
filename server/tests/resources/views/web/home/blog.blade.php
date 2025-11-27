@if($blogPage)

    <div class="latest-blog">
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                <div class="title-all text-center">
                    <h1>{{Helper::checkInfo($blogPage,'title')}}</h1>
                    <p>{{Helper::checkInfo($blogPage,'description')}}</p>
                </div>
            </div>
        </div>
        <div class="row">

            @if(isset($blog))
                @foreach($blog as $row)
                    <div class="col-md-6 col-lg-4 col-xl-4">
                       <div class="blog-box">
                            <div class="blog-img">
                                <a title="{{Helper::checkInfo($row,'title')}}" href="{{URL::to(Language::current().'/'.Helper::checkInfo($blogPage,'slug').'/'.$row->id.'-'.Helper::checkInfo($row,'slug'))}}">
                                    <img class="img-fluid" src="{{Helper::getThumbImage(!is_null($row->info)?$row->info->covers:[],config('files.covers.default.id'))}}" alt="{{Helper::checkInfo($row,'title')}}" />
                                </a>
                            </div>
                            <div class="blog-content">
                                <div class="title-blog">
                                    <a title="{{Helper::checkInfo($row,'title')}}" href="{{URL::to(Language::current().'/'.Helper::checkInfo($blogPage,'slug').'/'.$row->id.'-'.Helper::checkInfo($row,'slug'))}}">
                                        <h3>{{Helper::checkInfo($row,'title')}}</h3>
                                    </a>
                                    <p>{{Helper::checkInfo($row,'description')}}</p>
                                </div>
{{--                                <ul class="option-blog">--}}
{{--                                    <li><a href="#"><i class="far fa-heart"></i></a></li>--}}
{{--                                    <li><a href="#"><i class="fas fa-eye"></i></a></li>--}}
{{--                                    <li><a href="#"><i class="far fa-comments"></i></a></li>--}}
{{--                                </ul>--}}
                            </div>

                        </div>
                    </div>
                @endforeach
            @endif

        </div>
    </div>
</div>
@endif

{{--@if($projectPage)--}}
{{--    <section class="popular-item-area fix pt-padding">--}}
{{--        <div class="container">--}}
{{--            <div class="row justify-content-center">--}}
{{--                <div class="col-xl-6 col-lg-6 col-md-10">--}}
{{--                    <div class="section-tittle text-center mb-60">--}}
{{--                        <h2>{{Helper::checkInfo($projectPage,'title')}}</h2>--}}
{{--                        <p>--}}
{{--                            {{Helper::checkInfo($projectPage,'description')}}--}}
{{--                        </p>--}}
{{--                    </div>--}}
{{--                </div>--}}
{{--            </div>--}}
{{--        </div>--}}
{{--        <div class="container-fluid p-0">--}}
{{--            <div class="custom-row">--}}
{{--                <div class="popular-item owl-carousel">--}}


{{--                    @if(isset($projects))--}}
{{--                        @foreach($projects as $row)--}}
{{--                                <div class="single-items">--}}
{{--                                    <div class="items-img">--}}
{{--                                        <img src="{{Helper::getThumbImage(!is_null($row->info)?$row->info->covers:[],config('files.covers.default.id'))}}" alt="{{Helper::checkInfo($row,'title')}}" />--}}

{{--                                        <section class="wantToWork-area2">--}}
{{--                                            <div  class="wants-wrapper d-flex align-items-center justify-content-between flex-wrap">--}}
{{--                                                <div class="wantToWork-caption">--}}
{{--                                                    <h2>{{Helper::checkInfo($row,'title')}}</h2>--}}
{{--                                                    <p>--}}
{{--                                                        {{Helper::checkInfo($row,'description')}}--}}
{{--                                                    </p>--}}
{{--                                                </div>--}}
{{--                                                <div class="wants-btn">--}}
{{--                                                    <a href="{{URL::to(Language::current().'/'.Helper::checkInfo($projectPage,'slug').'/'.$row->id.'-'.Helper::checkInfo($row,'slug'))}}" class="btn wantToWork-btn f-right">{{Language::translate('viewProject')}}</a>--}}
{{--                                                </div>--}}
{{--                                            </div>--}}
{{--                                        </section>--}}
{{--                                    </div>--}}
{{--                                </div>--}}
{{--                        @endforeach--}}
{{--                    @endif--}}

{{--                </div>--}}
{{--            </div>--}}
{{--        </div>--}}
{{--    </section>--}}
{{--    <div class="more-project section-bg2 pt-50 pb-50" data-background="assets/img/gallery/section-bg2.png">--}}
{{--        <div class="container">--}}
{{--            <div class="row">--}}
{{--                <div class="col-lg-12">--}}
{{--                    <div class="more-pro text-center">--}}
{{--                        <a href="{{URL::to(Language::current().'/'.Helper::checkInfo($projectPage,'slug'))}}" class="border-btn">{{Language::translate('seeAll')}}</a>--}}
{{--                    </div>--}}
{{--                </div>--}}
{{--            </div>--}}
{{--        </div>--}}
{{--    </div>--}}
{{--    <div></div>--}}
{{--@endif--}}
