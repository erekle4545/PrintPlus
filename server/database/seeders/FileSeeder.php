<?php

namespace Database\Seeders;

use App\Models\Files;
use App\Models\Folder;
use Illuminate\Database\Seeder;

class FileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Folder::create([
            'name'=>'web',
            'user_id'=>1
        ]);
    }
}
