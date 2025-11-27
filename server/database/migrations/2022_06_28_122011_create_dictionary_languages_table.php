<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDictionaryLanguagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('dictionary_languages', function (Blueprint $table) {
            $table->increments('id');
//            $table->unsignedInteger('dictionary_id')->index();
            $table->foreignId('dictionary_id')->references('id')->on('dictionaries')->onDelete('cascade');
//            $table->unsignedInteger('language_id')->index();
            $table->foreignId('language_id')->references('id')->on('languages');
            $table->string('value')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('dictionary_languages');
    }
}
