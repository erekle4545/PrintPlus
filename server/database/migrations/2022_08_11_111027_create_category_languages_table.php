<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCategoryLanguagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('category_languages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->references('id')->on('categories')->onDelete('cascade');
            $table->string('title');
            $table->string('description')->nullable();
            $table->string('slug');
            $table->foreignId('language_id')->constrained()->references('id')->on('languages')->onDelete('cascade');
            $table->unique(['category_id', 'language_id']);
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
        Schema::dropIfExists('category_languages');
    }
}
