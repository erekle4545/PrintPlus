<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostLanguagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('post_languages', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('description');
            $table->text('text');
            $table->text('meta');
            $table->string('slug');
            $table->foreignId('post_id')->constrained()->references('id')->on('posts')->onDelete('cascade');
            $table->foreignId('language_id')->constrained()->on('languages')->onDelete('cascade');
            $table->unique(['post_id','language_id','slug']);
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
        Schema::dropIfExists('post_languages');
    }
}
