<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGalleryLanguagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('gallery_languages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('language_id')->constrained()->references('id')->on('languages')->onDelete('cascade');
            $table->foreignId('gallery_id')->constrained()->references('id')->on('galleries')->onDelete('cascade');
            $table->string('title')->nullable();
            $table->string('slug');
            $table->unique(['gallery_id','language_id','slug']);
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
        Schema::dropIfExists('gallery_languages');
    }
}
