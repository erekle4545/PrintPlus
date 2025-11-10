<?php

namespace App\Providers;

use App\Helpers\Core\Language;
use App\Helpers\Core\Multitenant;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
//        $this->app->singleton('menu', function ($app) {
//            //TODO more check needed, not always last item is menu...
//            $slug = urldecode(last(explode('/', $app->request->path())));
//
//            $data = Multitenant::getModel('MenuLanguage')
//                ::where(['slug' => $slug, 'language_id' => Language::languageId()])
//                ->with(['menu', 'menu.page.info' => function ($query) {
//                    $query->where('language_id', Language::languageId());
//                    $query->with('covers');
//                }])
//                ->first();
//
//            //REFACTOR THIS BETTER WAY
//            if (is_null($data) or is_null($data->menu->page->info)) {
//                $explode = urldecode(array_slice(explode('/', $app->request->path()), -2, 1)[0]);
//                $data = Multitenant::getModel('MenuLanguage')
//                    ::where(['slug' => $explode, 'language_id' => Language::languageId()])
//                    ->with(['menu', 'menu.page.info' => function ($query) {
//                        $query->where('language_id', Language::languageId());
//                    }])
//                    ->first();
//
//                if (is_null($data) or is_null($data->menu->page->info)) {
//                    abort(404);
//                }
//            }
//
//            view()->share('metaTitle', $data->menu->page->info->title);
//            view()->share('metaDescription', $data->menu->page->info->description);
//            view()->share('shareImage', null);
//
//            if (!is_null(array_get($data->menu->page->info->meta, 'meta_keywords'))) {
//                //TODO otherwise load default meta keywords
//                view()->share('metaKeywords', implode(',', $data->menu->page->info->meta['meta_keywords']));
//            }
//
//            return $data;
//        });

//        $this->app->singleton('page', function ($app) {
//            //TODO more check needed, not always last item is menu...
//            $slug = urldecode(last(explode('/', $app->request->path())));
//            $data = Multitenant::getModel('PageLanguage')::where(['slug' => $slug, 'language_id' => Language::languageId()])->first();
//            return $data;
//        });

        $this->app->singleton('ProductCategory', function ($app) {
            //TODO more check needed, not always last item is menu...
            $slug = urldecode(last(explode('/', $app->request->path())));
            $data = Multitenant::getModel('ProductCategory')::where(['id' => $slug])->first();
            return $data;
        });

        $this->app->singleton('Products', function ($app) {
            //TODO more check needed, not always last item is menu...
            $slug = urldecode(last(explode('/', $app->request->path())));
            $data = Multitenant::getModel('Products')::where(['id' => 33])->first();
            return $data;
        });


    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
