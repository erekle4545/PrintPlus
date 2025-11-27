@foreach ($config['data'] as $menu)
    @unless(is_null($menu->info))
        @include('widgets.menu.options.top_menu', ['menu' => $menu])
    @endunless
@endforeach
