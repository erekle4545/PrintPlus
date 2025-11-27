@if(isset($servicesPage))
    <section class="services-section section-padding40 section-bg2 fix homeService" data-background="assets/img/gallery/section-bg3.png" >
        <div class="container-fluid">
            <div class="row">
                <div class="offset-xl-1 col-xl-3 col-lg-6 col-md-8 col-sm-10">
                    <div class="right-caption mb-40">
                        <div class="section-tittle mb-30">
                            <h2>
                                {{Helper::checkInfo($servicesPage,'title')}}

                            </h2>
                        </div>
                        <div class="support-caption">
                            <p class="mb-40">
                                {{Helper::checkInfo($servicesPage,'description')}}
                            </p>
                            <a href="{{URL::to(Language::current().'/'.Helper::checkInfo($servicesPage,'slug'))}}" class="btn post-btn">{{Language::translate('seeAll')}}</a>
                        </div>
                    </div>
                </div>
                <div class="col-xl-7 offset-xl-1 col-lg-12">
                    @if(isset($services))
                        @foreach($services as $row)
                            <div class="row align-items-center">
                                <div class="col-xl-7 col-lg-8 col-md-8 col-sm-8">
                                    <div class="single-cat">
                                        <div class="cat-icon">
                                            <img src="{{Helper::getThumbImage(!is_null($row->info)?$row->info->covers:[],config('files.covers.default.id'))}}" alt="{{Helper::checkInfo($row,'title')}}" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4">
                                    <div class="single-cat mb-30">
                                        <div class="cat-cap">
                                            <h5>
                                                <a href="{{URL::to(Language::current().'/'.Helper::checkInfo($servicesPage,'slug').'/'.$row->id.'-'.Helper::checkInfo($row,'slug'))}}"
                                                >{{Helper::checkInfo($row,'title')}}</a >
                                            </h5>
                                            <p>
                                                {{Helper::checkInfo($row,'description')}}
                                            </p>
                                            <a href="{{URL::to(Language::current().'/'.Helper::checkInfo($servicesPage,'slug').'/'.$row->id.'-'.Helper::checkInfo($row,'slug'))}}" class="browse-btn">{{Language::translate('exploreNow')}}</a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                    @endforeach
                @endif


                </div>
            </div>
        </div>
        </section>
@endif
