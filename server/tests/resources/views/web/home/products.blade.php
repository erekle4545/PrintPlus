<div class="products-box" id="find-cars">
<div class="container">
    <div class="row">
        <div class="col-lg-12">
            <div class="title-all ">
                <div class="text-center">

                    <h1>{{Language::translate('carsTitle')}}</h1>
                    <p>{{Language::translate('carsText')}}</p>
                </div>
                <form class="d-flex justify-content-end p-2 " action="{{ route('home_search_product', ['locale' => app()->getLocale(), 'slug' => 'home']) }}#find-cars" method="GET" >
                    <div class="col-12 text-center">
                        <select name="start_year" class="form-select form-select-lg p-2" aria-label="Default select example">
                            <option selected>{{\App\Helpers\Core\Language::translate('start_years')}}</option>
                            @foreach($years as $row)
                                <option value="{{$row}}" {{ request('start_year') == $row ? 'selected' : '' }}>{{$row}}</option>

                            @endforeach

                        </select>

                        <select name="end_year" class="form-select form-select-lg p-2" aria-label="Default select example">
                            <option selected>{{\App\Helpers\Core\Language::translate('start_years')}}</option>
                            @foreach($years as $row)
                                <option value="{{$row}}" {{ request('end_year') == $row ? 'selected' : '' }}>{{$row}}</option>

                            @endforeach
                        </select>
                        <button type="submit" class="btn btn-primary ">{{\App\Helpers\Core\Language::translate('search')}}</button>

                    </div>

                </form>
            </div>

        </div>
    </div>

    {{--            <div class="row">--}}
    {{--                <div class="col-lg-12">--}}
    {{--                    <div class="special-menu text-center">--}}
    {{--                        <div class="button-group filter-button-group">--}}
    {{--                            <button class="active" data-filter="*">ყველა</button>--}}
    {{--                            <button data-filter=".top-featured">ძარა</button>--}}
    {{--                            <button data-filter=".best-seller">ბამპერი</button>--}}
    {{--                            <button data-filter=".headlights">მაშუქები</button>--}}
    {{--                        </div>--}}
    {{--                    </div>--}}
    {{--                </div>--}}
    {{--            </div>--}}

    <div class="row special-list">

        @foreach($product as $row)
            <div class="col-lg-3 col-md-6 special-grid best-seller">
                <div class="products-single fix">
                    <div class="box-img-hover" style="cursor: pointer" onclick="location.href=('{{Helper::makeUrl($row->page->info->slug.'/'.$row->id.'-'.$row->info->slug)}}')">
                        <div class="type-lb">
                            <p class="sale">{{Helper::checkInfo($row->page,'title')}}</p>
                        </div>
                        <img src="{{Helper::getThumbImage(!is_null($row->info)?$row->info->covers:[],config('files.covers.default.id'))}}" class="img-fluid" alt="Image">
                        <div class="mask-icon">
                            {{--                                        <ul>--}}
                            {{--                                            <li><a href="#" data-toggle="tooltip" data-placement="right" title="View"><i class="fas fa-eye"></i></a></li>--}}
                            {{--                                            <li><a href="#" data-toggle="tooltip" data-placement="right" title="Compare"><i class="fas fa-sync-alt"></i></a></li>--}}
                            {{--                                            <li><a href="#" data-toggle="tooltip" data-placement="right" title="Add to Wishlist"><i class="far fa-heart"></i></a></li>--}}
                            {{--                                        </ul>--}}
                            <a class="cart" href="{{Helper::makeUrl($row->page->info->slug.'/'.$row->id.'-'.$row->info->slug)}}">{{Language::translate('details')}}</a>
                        </div>
                    </div>
                    <div class="why-text">
                        <a href="{{Helper::makeUrl($row->page->info->slug.'/'.$row->id.'-'.$row->info->slug)}}" > <h4>{{Helper::checkInfo($row,'name')}}</h4></a>
                        <h5>{{number_format($row->price)}} ₾</h5>
                    </div>
                </div>
            </div>
        @endforeach
        <!-- end test -->

    </div>
    <div class="pagination">
        {{ $product->fragment('foo')->links('pagination::bootstrap-4') }}

    </div>
</div>
</div>
