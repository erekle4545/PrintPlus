
@if (count($menu['children']) > 0)
    <li class="nav-item  @if($menu->parent_id ==0) dropdown  @endif  @if($menu->info->slug == Request::segment(2)) active @endif">
        @if(!is_null($menu->meta) && !is_null(array_get($menu->meta, 'custom_link')) && array_get($menu->meta, 'custom_link') == true && !is_null($menu->info))
            <a @if($menu->active_url == '1') class="nav-link" href="{{Helper::makeUrl( isset($slug) ? $slug .'/'. ($menu->info ? $menu->info->slug : '') : ($menu->info ? $menu->info->slug : ''))}}" @else class="nav-link dropdown" @endif>
                {{$menu->info ? $menu->info->title : 'N/A'}}<span class="caret"></span>
            </a>
        @else
            <a @if($menu->active_url == '1') href="{{Helper::makeUrl( isset($slug) ? $slug .'/'. ($menu->info ? $menu->info->slug : '') : ($menu->info ? $menu->info->slug : ''))}}" class="nav-link" @else class="nav-link" href="{{Helper::makeUrl( isset($slug) ? $slug .'/'. ($menu->info ? $menu->info->slug : '') : ($menu->info ? $menu->info->slug : ''))}}"  @endif >
                {{$menu->info ? $menu->info->title : 'N/A'}}
            </a>
        @endif
        <ul class="dropdown-menu">
            @foreach($menu['children'] as $child)
                @include('widgets.menu.options.top_menu', ['menu' => $child, 'slug' => $menu->info ? $menu->info->slug : ''])
            @endforeach
        </ul>
    </li>
@else
    @if($menu->parent_id ==0)
       <li class="nav-item @if($menu->info->slug == Request::segment(2))  active @endif">
            @if(!is_null($menu->meta) && !is_null(array_get($menu->meta, 'custom_link')) && array_get($menu->meta, 'custom_link') == true && !is_null($menu->info))
                <a class="nav-link @if($menu->info->slug == Request::segment(2)) active @endif" href="{{Helper::makeUrl( isset($slug) ? $slug .'/'. ($menu->info ? $menu->info->slug : '') : ($menu->info ? $menu->info->slug : ''))}}">
                   {{$menu->info ? $menu->info->title : 'N/A'}}
                </a>
            @else
                <a class="nav-link  @if($menu->info->slug == Request::segment(2)) active @endif" href="{{Helper::makeUrl( isset($slug) ? $slug .'/'. ($menu->info ? $menu->info->slug : '') : ($menu->info ? $menu->info->slug : ''))}}">
                     {{$menu->info ? $menu->info->title : 'N/A'}}
                </a>
            @endif
        </li>
    @else
        <li class="dropdown_item dropdown_item-1 @if($menu->info->slug == Request::segment(2))  active @endif">
            @if(!is_null($menu->meta) && !is_null(array_get($menu->meta, 'custom_link')) && array_get($menu->meta, 'custom_link') == true && !is_null($menu->info))
                <a class="dropdown-link @if($menu->info->slug == Request::segment(2)) active @endif" href="{{Helper::makeUrl( isset($slug) ? $slug .'/'. ($menu->info ? $menu->info->slug : '') : ($menu->info ? $menu->info->slug : ''))}}" >
                    {{$menu->info ? $menu->info->title : 'N/A'}}
                </a>
            @else
                <a class="dropdown-link @if($menu->info->slug == Request::segment(2)) active @endif" href="{{Helper::makeUrl( isset($slug) ? $slug .'/'. ($menu->info ? $menu->info->slug : '') : ($menu->info ? $menu->info->slug : ''))}}">
                    {{$menu->info ? $menu->info->title : 'N/A'}}
                </a>
            @endif
        </li>
    @endif
@endif

