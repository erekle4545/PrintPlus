<?php

namespace App\Http\Controllers\API\Admin;

use App\Helpers\Core\Multitenant;
use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\GalleryResource;
use App\Http\Resources\MenuResource;
use App\Http\Resources\PageResource;
use App\Http\Resources\PostResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ServiceResource;
use App\Http\Resources\User;
use App\Http\Resources\UsersResource;
use App\Models\Core\Category;
use App\Models\Core\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class OptionsController extends Controller
{


    public function getPageConfig()
    {
        $data['statuses']   = config('page.status');
        $data['types']      = config('page.types');
        $data['templates']  = array_values(config('page.templates'));
        $data['ogTypes']    = config('social.ogTypes');
        $data['coverTypes'] =  array_values(Arr::only(config('files.covers'), config('page.covers')));
        return new PageResource(collect($data));
    }

    public function getPostConfig()
    {
        $data['statuses']   = config('page.status');
        $data['types']      = config('page.types');
//        $data['templates']  = array_values(config('page.templates'));
        $data['ogTypes']    = config('social.ogTypes');
        $data['coverTypes'] =  array_values(Arr::only(config('files.covers'), config('page.covers')));
        $data['categories'] = Category::whereHas('info', function($query) {
            $query->where('language_id',  1);
        })->with('info')->get();
        return new PostResource(collect($data));
    }


    public function getServiceConfig()
    {
        $data['statuses']   = config('page.status');
        $data['types']      = config('page.types');
//        $data['templates']  = array_values(config('page.templates'));
        $data['ogTypes']    = config('social.ogTypes');
        $data['coverTypes'] =  array_values(Arr::only(config('files.covers'), config('page.covers')));
        $data['categories'] = Category::whereHas('info', function($query) {
            $query->where('language_id',  1);
        })->with('info')->get();
        return new ServiceResource(collect($data));
    }
    public function getCategoryConfig()
    {
        $data['statuses']   = config('page.status');
        $data['coverTypes'] =  array_values(Arr::only(config('files.covers'), config('page.covers')));
        return new CategoryResource(collect($data));
    }

    public function getProductConfig()
    {
        $data['statuses']   = config('page.status');
        $data['coverTypes'] =  array_values(Arr::only(config('files.covers'), config('page.covers')));
        $data['categories'] =  Page::query()->where('template_id',config('page.templates.car_brands.id'))->with('info')->get();
        return new ProductResource(collect($data));
    }

    public function getSliderConfig()
    {

        $data['statuses']   = config('page.status');
        $data['coverTypes'] =  array_values(Arr::only(config('files.covers'), config('slider.covers')));
        return new CategoryResource(collect($data));
    }


    public function getGalleryConfig()
    {

        $data['statuses']   = config('page.status');
        $data['coverTypes'] =  array_values(Arr::only(config('files.covers'), config('gallery.covers')));
        return new GalleryResource(collect($data));
    }

    public function getTeamConfig()
    {

        $data['statuses']   = config('page.status');
        $data['coverTypes'] =  array_values(Arr::only(config('files.covers'), config('team.covers')));
        return new GalleryResource(collect($data));
    }

    public function getMenuConfig(){
        $data['statuses'] = config('menu.status');
        $data['positions'] =  array_values(config('menu.positions'));
        $data['pages']= Page::where(['status'=>config('page.status.active')])->with('info')->get();

        return new MenuResource(collect($data));
    }

    public function getUsersConfig(){
        $data['statuses'] = config('page.status');

        return new UsersResource(collect($data));
    }

    public function getSettingsConfig(){
        $data['statuses'] = config('page.status');
        $data['coverTypes'] =  array_values(Arr::only(config('files.covers'), config('settings.covers')));

        return new GalleryResource(collect($data));
    }
}
