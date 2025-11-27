@if(isset($banners))
<div class="box-add-products">
    <div class="container">
        <div class="row">
            @foreach($banners as $row)
            <div class="col-lg-6 col-md-6 col-sm-12">
                <a target="_blank" href="{{Helper::checkInfo($row,'slug')}}" class="offer-box-products">
                    <img class="img-fluid" src="{{Helper::getThumbImage(!is_null($row->info)?$row->info->covers:[],config('files.covers.default.id'))}}" alt="{{Helper::checkInfo($row,'title')}}" />
                </a>
            </div>
            @endforeach
        </div>
    </div>
</div>
@endif
