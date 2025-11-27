<?php

namespace App\Helpers\Core;

use App\Models\Core\Dictionary;
use App\Models\Core\Languages;

/**
 * Class MultiTenant
 *
 * @package App\Helpers\Core
 */
abstract class Language
{


    public static function languageId()
    {
//        $model =  Multitenant::getModel('Languages');
        $currentLang = app()->currentLocale();
//        $lang = $model::where('code',strtoupper($currentLang))->first();

//        return $lang->id;

        switch ($currentLang){

            case 'ka':
                return 1;
            case 'en':
                return 2;

            case 'ru':
                return 3;

        }

    }

    /**
     * [languages description]
     *
     * @return [type] [description]
     */
    public static function languages()
    {

        $availableLanguages = [];
        $lang = Languages::query()->where('status',config('app.languageStatus.active'))->get();
        foreach ($lang as $row){
            array_push($availableLanguages,strtolower($row->code));
        }
        return collect($availableLanguages);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Eloquent\Model|object|null
     */
    public static function defaultLanguage()
    {
        $model =  Multitenant::getModel('Languages');
        $lang = $model::where('default',1)->first();

        return $lang;
    }


    public static function translate($word)
    {

        $current = self::current();

        return __("{$current}.{$word}");

    }


    public static function current()
    {
       return app()->currentLocale();

    }

}
