<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTeamLanguagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('team_languages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('language_id')->constrained()->references('id')->on('languages')->onDelete('cascade');
            $table->foreignId('team_id')->constrained()->references('id')->on('teams')->onDelete('cascade');
            $table->string('title');
            $table->string('slug');
            $table->text('text');
            $table->unique(['team_id','language_id','slug']);
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
        Schema::dropIfExists('team_languages');
    }
}
