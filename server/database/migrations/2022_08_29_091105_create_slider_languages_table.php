<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSliderLanguagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('slider_languages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('language_id')->constrained()->references('id')->on('languages')->onDelete('cascade');
            $table->foreignId('slider_id')->constrained()->references('id')->on('sliders')->onDelete('cascade');
            $table->string('title')->nullable();
            $table->unique(['slider_id','language_id']);
            $table->string('description')->nullable();
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
        Schema::dropIfExists('slider_languages');
    }
}
