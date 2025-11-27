<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class MakeMenuPageIdColumnNullable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        \DB::statement('ALTER TABLE menus DROP FOREIGN KEY menus_page_id_foreign;');
        \DB::statement('ALTER TABLE menus CHANGE COLUMN page_id page_id INT(10) UNSIGNED NULL;');
        Schema::table('menus', function(Blueprint $table) {
            $table->foreign('page_id')->references('id')->on('pages');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('menus', function (Blueprint $table) {
            //
        });
    }
}
