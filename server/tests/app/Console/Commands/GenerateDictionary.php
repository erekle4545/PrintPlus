<?php

namespace App\Console\Commands;

use App\Helpers\Core\Multitenant;
use App\Models\Core\Dictionary;
use App\Models\Core\DictionaryLanguage;
use App\Models\Core\Languages;
use Illuminate\Support\Facades\File;
use Illuminate\Console\Command;

use Illuminate\Support\Str;

class GenerateDictionary extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dictionary:update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reads Text table in database and updates dictionary for web';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    static public function handle()
    {
        $publicPath = Base_path('resources/lang/');

        $dictionaryModel = Dictionary::get()->toArray();

        $dictionaryLanguageModel = DictionaryLanguage::get();

        $Languages = Languages::get()->toArray();

        $scheme = "<?php
            return [
                :content
            ];
        ";
        $curentScheme ="";
        $content= "";
        $Words= '';
        $Values= '';
        $fileName = "";

        foreach ($Languages as $lang){
            $langCode = strtolower($lang['code']);
            if (!File::exists($publicPath.$langCode)) {
                File::makeDirectory($publicPath.$langCode, 0777, true);
            }

            foreach ($dictionaryModel as $Word){
                $Values = $dictionaryLanguageModel->where('language_id', $lang['id'])->where('dictionary_id', $Word['id']);
                foreach ($Values as $value) {
                    $content.="'".$Word['word']."'=>'".str_replace("'","",$value['value'])."',\n\t";
                }
            }

            $fileName = "/".$langCode.".php";

            File::put($publicPath.$langCode.$fileName, "<?php".PHP_EOL."
                return [".$content." ];"
            );

            $content="";
        }
    }
}
