@if($textPage)
    <div class="support-company-area section-padding40">
    <div class="container">
        <div class="row align-items-end justify-content-between">
            <div class="col-xl-7 col-lg-7 col-md-10">
                <div class="support-location-img">
                    <img src="{{Helper::getThumbImage(!is_null($textPage->info)?$textPage->info->covers:[],config('files.covers.default.id'))}}" alt="{{Helper::checkInfo($textPage,'title')}}" />
                </div>
            </div>
            <div class="col-xl-4 col-lg-5 col-md-10">
                <div class="right-caption">
                    <div class="section-tittle mb-30">
                        <h2>{{Helper::checkInfo($textPage,'title')}}</h2>
                    </div>
                    <div class="support-caption">
                        <p class="mb-40">
                            {{Helper::checkInfo($textPage,'description')}}
                        </p>
                        <a href="{{URL::to(Language::current().'/'.Helper::checkInfo($textPage,'slug'))}}" class="btn post-btn">{{Language::translate('readMore')}}</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endif
