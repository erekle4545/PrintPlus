<?php

namespace App\Helpers\Core;

use App\Models\Core\Languages;
use App\Models\Core\Page;
use App\Models\Core\Post;
use App\Models\Core\Settings;
use Carbon\Carbon;
use App\Models\Core\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

/**
 * Class MultiTenant
 *
 * @package App\Helpers\Core
 */
abstract class Helper
{
    public static function currency()
    {
        $url = "https://nbg.gov.ge/gw/api/ct/monetarypolicy/currencies/ka/json";

        $json = file_get_contents($url);
        $currencies = json_decode($json)[0]->currencies;
        foreach ($currencies as $key => $item) {
            if($item->code == "USD") {
                $currency = floatval($item->rate);
            }
        }

        return $currency;
    }
    /**
     * Retrieve class based on given path
     */
    public static function makeUrl($path)
    {
        return '/' . app()->currentLocale(). '/' .$path;


    }

    public static function url($path)
    {
        return \URL::to($path);
    }
    /**
     * [language description]
     *
     * @return [type] [description]
     */
    public static function language()
    {
        return \Language::current()->abbr;
    }

    /**
     * [language description]
     *
     * @return [type] [description]
     */




    /**
     * Helper function wrapping storage facade
     *
     * @param  File    $file     File entity from database
     * @param  Request $request  Request containing upload file
     * @return String            Uploaded file path
     */
    public static function putFile(File $file, Request $request)
    {
        $folderName = 'media' . DIRECTORY_SEPARATOR . config('files.type_groups.' .$file->extension) . DIRECTORY_SEPARATOR . $file->created_at->format('Y-m-d');

        return $request->file('file')->storeAs($folderName, $file->uuid . '.' . $file->extension);
    }

    /**
     * [filePath description]
     *
     * @param  File   $file [description]
     * @return [type]       [description]
     */
    public static function fileUrl(File $file, $onlyPath = false, $prefix = 'media')
    {
        $path = Storage::url($prefix . '/' . config('files.type_groups')[$file->extension] . '/' . $file->created_at->format('Y-m-d'));
        // $path = '//' . preg_replace('#^https?://#', '', $path);
        return  $onlyPath ? $path : $path . '/' . $file->filename;
    }

    /**
     * [filePath description]
     *
     * @param  File    $file     [description]
     * @param  boolean $onlyPath [description]
     * @param  string  $prefix   [description]
     * @return [type]            [description]
     */
    public static function filePath(File $file, $onlyPath = false, $prefix = 'media')
    {
        $path = Storage::path($prefix . '/' . config('files.type_groups')[$file->extension] . '/' . $file->created_at->format('Y-m-d'));

        return  $onlyPath ? $path : $path . '/' . $file->filename;
    }

    /**
     * [fileThumbnails description]
     *
     * @param  File   $file [description]
     * @return [type]       [description]
     */
    public static function fileThumbnails(File $file)
    {
        /**
         * @todo check if is image
         * @var array
         */
        $array = [];

        if ($file->type !== config('files.groups.image')) {
            return $array;
        }

        foreach (config('files.thumb_sizes') as $file_thumb_sizes) {
            $key            = $file_thumb_sizes['width'] . 'x' .$file_thumb_sizes['height'];
            $thumb_folder   = strtoupper($key);
            $file_name      = $file->uuid .'.'.$file->extension;

            $path = self::fileUrl($file, true);
            $array[$key] = $path . '/' . $key . '/' . $file_name;
        }
        $array['orig'] = $path . '/' . $file_name;
        return $array;
    }

    /**
     * [filePath description]
     *
     * @param  File   $file [description]
     * @return [type]       [description]
     */
    public function fileTumbnailsPath(File $file)
    {
        Storage::url($prefix . DIRECTORY_SEPARATOR . config('files.type_groups')[$file->extension] . DIRECTORY_SEPARATOR . $file->created_at->format('Y-m-d') . DIRECTORY_SEPARATOR . $file->uuid .'.'.$extension);
    }

    /**
     * [thumbnail description]
     * @param  [type] $files [description]
     * @param  [type] $type  [description]
     * @return [type]        [description]
     */
    public static function thumbnail($files, $type, $size = null, $orig = null, $versus = null)
    {
        // dd($meta);
        /*
         * If there are no attached files to the content
         * First we search for old images urls in meta column and check if they have image mime types,
         * Then if there are no any images in the meta tag we load the default one.
         */
        $mimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp'];
        if (!count($files)) {
            return '/assets/no-preview.jpg';
        }

        /**
         * Find file with specific cover type
         */
        $files_data = is_array($files) ? collect($files) : $files;
        $files = $files_data->filter(function ($file) use ($type) {
            return $file['covertype'] == $type;
        });

        $file = array_first($files);

        if ($versus) {
            $files = $files->toArray();
            $file = end($files);
        }

        /**
         * if we could not find proper type of image then...
         */
        if (is_null($file)) {
            //try to find cover type otherwise very first one
            $files = $files_data->filter(function ($file) use ($type) {
                return $file['covertype'] == config('files.covers.default.id');
            });

            $file = array_first($files);

            if (is_null($file)) {
                $file = array_first($files_data);
            }
        }

//        $path = $orig === true ? $file['thumbnails']['orig'] : (!is_null($size) && isset($file['thumbnails'][$size]) ? $file['thumbnails'][$size] : $file['thumbnails']['320x180']);

//        return $path;
    }


    public static function checkVideo($files, $type, $size = null, $orig = null, $versus = null)
    {

        $mimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp'];
        if (!count($files)) {
            return '/assets/no-preview.jpg';
        }

        /**
         * Find file with specific cover type
         */
        $files_data = is_array($files) ? collect($files) : $files;
        $files = $files_data->filter(function ($file) use ($type) {
            return $file['covertype'] == $type;
        });

        if(count($files) > 0){
            return true;
        }else{
            return false;
        }
    }
    /**
     * @param  [type]
     * @return [type]
     */
    public static function articleUrl($article, $reverse = false)
    {
        // $reverse = !$reverse;
        if ($reverse) {
            return \URL::to(sprintf('%s/story/%d-%s', self::language(), $article->id, $article->info->slug));
        }
        return \URL::to(sprintf('%s/story/%d-%s', self::language(), $article->content->id, $article->slug));
    }

    /**
     * [displayDate description]
     * @param  [type] $date [description]
     * @return [type]       [description]
     */
    public static function displayDate($date, $format = null)
    {
        try {
            if ($format) {
                return Carbon::parse($date)->formatLocalized($format);
            }
            return  Carbon::parse($date)->format('d/m/Y');
        } catch (\Exception $e) {
            return 'Date Parse Error';
        }
    }
    /**
     * [pageTemplate description]
     * @return [type] [description]
     */
    public static function pageTemplate($data)
    {
        $type = array_first(collect(config('page.types'))->filter(function ($type) use ($data) {
            return $type['id'] === $data->menu->page->type;
        }));

        $template = array_first(collect(config('page.templates')[$type['name']])->filter(function ($template) use ($type, $data) {
            return $template['id'] === (int) $data->menu->page->template_id;
        }));

        return collect(['type' => collect($type), 'template' => collect($template)]);
    }

    /**
     * @param $type
     * @param $data
     * @return mixed
     */
    public static function getTemplate($type,$data)
    {
        $template = array_first(collect(config('page.templates'))->filter(function ($template) use ($data) {
            return $template['id'] === (int) $data->template_id;
        }));

        return  $template[$type];
    }

    /**
     * [articleData description]
     *
     * @param  [type]  $data      [description]
     * @param  string  $thumbsize [description]
     * @param  boolean $revers    [description]
     * @return [type]             [description]
     */
    public static function articleData($data, $thumbsize = '320x180', $reverse = false, $versus = null)
    {
        $reverse = !$reverse;
        $res = [
            'title'       => $reverse ? $data->info->title : $data->title,
            'description' => $reverse ? $data->info->description : $data->description,
            'url'         => self::articleUrl($data, $reverse),
            'cover'       => self::thumbnail(($reverse ? $data->info->covers : $data->covers), config('files.covers.default.id'), $thumbsize, null, isset($data->content->meta) ? $data->content->meta : null),
            'date'        => self::displayDate($reverse ? $data->info->published_at : $data->published_at),
            'info_meta'   => $reverse ? $data->info->meta : $data->meta,
        ];

        return $res;
    }

    public static function showRegion(array $data) : String
    {
        if (!is_null($regions = array_get($data, 'region_keywords'))) {
            return '<div class="topic">'.$regions.'</div>';
        }
        return '';
    }

    public static function appLogos($covertype)
    {
        if (!is_null(\App('Details'))) {
            if (!is_null(\App('Details')->info)) {
                foreach (\App('Details')->info->covers as $key => $value) {
                    if ($value->covertype == $covertype) {
                        return $value->thumbnails['orig'];
                    }
                }
            }
        }

        return null;
    }

    public static function appSocials($data)
    {
        if (isset($data->socials)) {
            return $data->socials;
        }

        return [];
    }

    public static function hederSocial($inputData)
    {
        $data = Settings::query()->with('info', function ($query) {
            $query->where('language_id', Language::languageId());
        })->first();

        if(isset($data->meta[$inputData])){
            return $data->meta[$inputData];
        }else{
            return false;
        }
    }

    public static function appSeo($type = null)
    {
        $data = [];

        $data['title']       = isset(\App('Contact')->info->title) ? \App('Contact')->info->title : '';
        $data['description'] = isset(\App('Contact')->info->description) ? \App('Contact')->info->description : '';
        $data['keywords']    = isset(\App('Contact')->info->description) ? \App('Contact')->info->description : '';
        $data['image']       = isset(\App('Contact')->info->covers) ? self::thumbnail(\App('Contact')->info->covers, config('files.covers.facebook.id'), true, true) : '';
        $data['fb_api']      = isset(\App('Contact')->info->meta['f_api_key']) ? \App('Contact')->info->meta['f_api_key'] : '';

        return !is_null($type) ? $data[$type] : null;
    }


    public static function fileExists($url)
    {
        $file = str_replace(url('').'/', '', $url);
        if (file_exists($file)) {
            return true;
        }
        return false;
    }

    /**
     * @param $data
     * @return void
     */
    public static function metaShare($data)
    {
        $metas = [];
        if (isset($data->info)) {
            $metas['image']   = self::getThumbImage($data->info->covers, config('files.covers.default.id'));
            $metas['og_title']= isset($data->info->meta['facebook']['og']['title']) ? $data->info->meta['facebook']['og']['title'] : $data->info->title;
            $metas['title']   = !is_null($metas['og_title']) ? $metas['og_title'] : $data->info->title;
            $metas['descr']   = $data->info->meta['facebook']['og']['description'];
            $metas['type']    = $data->info->meta['facebook']['og']['type'];
        }

        \View::share('articleMetas', $metas);
    }

    /**
     * @param $link
     * @return mixed|null
     */
    public static function parseYoutube($link)
    {
        if (preg_match('%(?:youtube(?:-nocookie)?\.com/(?:[^/]+/.+/|(?:v|e(?:mbed)?)/|.*[?&]v=)|youtu\.be/)([^"&?/ ]{11})%i', $link, $match)) {
            return $match[1];
        } else {
            return null;
        }
    }

    public static function encdec($string, $action = true)
    {
        $secret_key = 'Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro. De carne lumbering animata corpora quaeritis.';
        $secret_iv = 'Boost your project`s manliness by 100% touts the Hairy Lipsum generator.';

        $output = false;
        $encrypt_method = "AES-256-CBC";
        $key = hash('sha256', $secret_key);
        $iv = substr(hash('sha256', $secret_iv), 0, 16);

        return $action ? base64_encode(openssl_encrypt($string, $encrypt_method, $key, 0, $iv)) : openssl_decrypt(base64_decode($string), $encrypt_method, $key, 0, $iv);
    }

    /**
     * @param $patch
     * @param $type
     * @return string|void
     */

    public static function getThumbImage($patch, $type) {
        if (count($patch) > 0) {
            foreach ($patch as  $row) {
                if (isset($type) && $row->cover_type == $type) {
                    return asset($row->output_path);
                }
            }
        }

        // Return the default image if no match is found
        return asset('assets/images/not_iamges.png');
    }

    /**
     * @param $patch
     * @param $type
     * @return string|void
     */
    public static function getThumbImageOriginal($patch,$type) {
        foreach ($patch as $key => $row ){
            if(count($patch) > 0 ){
                if(isset($type) && $row->cover_type == $type ){
                    return asset($row->path);
                }else{
                    return asset('images/no_image.jfif');
                }
            }
        }

    }

    /**
     * @param $patch
     * @param $type
     * @return string|void
     */
    public static function galleryImages($patch,$type) {

        if(!is_null($patch) ){
            return $type==='popup'?asset($patch->path):asset($patch->output_path);
        }else{
            return asset('images/no_image.jfif');
        }


    }


    /**
     * @param $patch
     * @param $type
     * @return string|void
     */


    public static function getThumbImageSlider($patch,$type) {
        foreach ($patch as $key => $row ){
            if(count($patch) > 0 ){

                if(isset($type) && $row->cover_type == $type ){
                    return asset($row->output_path);
                }else{
                    // return asset($row->output_path);
                }
            }
        }

    }



    /**
     * @param $data
     * @param $out
     * @return mixed|string
     */
    public static function checkInfo($data,$out)
    {
        if(!is_null($data->info)){
            return $data->info[$out];
        }else{
            return '';
        }

    }




}
