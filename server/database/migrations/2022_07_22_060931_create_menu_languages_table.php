<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMenuLanguagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('menu_languages', function (Blueprint $table) {
            $table->id();
//            $table->unsignedInteger('menu_id')->index();
//            $table->unsignedInteger('language_id')->index();
            $table->string('title', 100);
            $table->text('description')->nullable();
            $table->string('slug')->index();
            $table->unique(['menu_id', 'language_id']);
            $table->foreignId('menu_id')->constrained()->references('id')->on('menus')->onDelete('cascade');
            $table->foreignId('language_id')->constrained()->references('id')->on('languages')->onDelete('cascade');
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
        Schema::dropIfExists('menu_languages');
    }
}
