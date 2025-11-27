<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Dotenv\Util\Str;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use phpseclib3\Crypt\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $permission = Permission::create([
            'name'=>'super_admin'
        ]);

        $role = Role::create([
            'name'=>'Super admin'
        ]);


        $rolePermission =  Role::where('id',$role->id)->first();

        $rolePermission->permissions()->sync([$permission->id]);

        User::create([
            'id'=>1,
            'name' => 'Super Admin',
            'email' => 'admin@mail.com',
            'phone'=> '598555555',
            'role_id' => $role->id,
            'user_status'=>'1',
            'password' => bcrypt('Flex4545@')
        ]);
    }
}
