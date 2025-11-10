<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCoversTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('coverables', function (Blueprint $table) {
            $table->morphs('coverable');
            $table->foreignId('files_id')->constrained()->references('id')->on('files')->onDelete('cascade');
            $table->integer('cover_type')->unsigned()->default(1);
            $table->primary(['files_id','cover_type', 'coverable_id', 'coverable_type'], 'model_has_covers_file_model_type_primary');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('coverables');
    }
}
