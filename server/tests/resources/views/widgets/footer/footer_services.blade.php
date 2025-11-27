@foreach ($config as  $row)
    @unless(is_null($row->info))
        <li><a href="{{URL::to(Language::current().'/'.Helper::checkInfo($servicesPage,'slug').'/'.$row->id.'-'.Helper::checkInfo($row,'slug'))}}">{{$row->info->title}}</a></li>

    @endunless
@endforeach
