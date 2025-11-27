<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('files', function (Blueprint $table) {
            $table->id();
            $table->string("name",255);
            $table->string("path",2000);
            $table->string("type",25);
            $table->string("extension",25)->nullable();
            $table->text("data");
            $table->string("output_path",2000)->nullable();
            $table->timestamps();
            $table->foreignIdFor(\App\Models\Core\Files::class,'folder_id')->nullable();
            $table->foreignIdFor(\App\Models\User::class,'user_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('files');
    }
}
