<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePageLanguagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('page_languages', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('page_id')->index();
//            $table->unsignedInteger('language_id')->index();
            $table->string('title', 100);
            $table->string('description')->nullable();
            $table->text('text')->nullable();
            $table->text('meta');
            $table->foreign('page_id')->references('id')->on('pages')->onDelete('cascade');
            $table->foreignId('language_id')->constrained()->references('id')->on('languages')->onDelete('cascade');
            $table->unique(['page_id', 'language_id']);
            $table->string('slug')->index();
            $table->unique(['slug', 'language_id'])->index();
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
        Schema::dropIfExists('page_languages');
    }
}
