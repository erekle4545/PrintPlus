@if($carBrands)
<!-- Start Categories  -->
<div class="categories-shop">
    <div class="container">
        <div class="row">
            @foreach($carBrands as $row)
                <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">

                        <div style="cursor: pointer" title="{{Helper::checkInfo($row,'title')}}" class="shop-cat-box " onclick="location.href=('{{URL::to(Language::current().'/'.Helper::checkInfo($row,'slug'))}}')">
                                <img class="img-fluid" src="{{Helper::getThumbImage(!is_null($row->info)?$row->info->covers:[],config('files.covers.default.id'))}}" alt="" />

                            <a class="btn hvr-hover" href="{{URL::to(Language::current().'/'.Helper::checkInfo($row,'slug'))}}">{{Helper::checkInfo($row,'title')}}</a>
                        </div>
                </div>
             @endforeach
        </div>
    </div>
</div>
<!-- End Categories -->
@endif
