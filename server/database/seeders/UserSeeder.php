<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $permission_data = ['create','view','update','delete'];
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // create permissions
        $templates = array_values(config('menu.templates'));
        foreach ($permission_data as $permissionRow){
            foreach ($templates as $row){
                $templateKey  = str_replace('_',' ',$row['key']);
                Permission::create([
                    'name'=>"{$permissionRow} {$templateKey}",
                    'guard_name'=>'web']);
            }
        }
        // create roles and assign created permissions

        $role = Role::create([
            'name'=>'super_admin',
            'guard_name'=>'web'
        ]);
        $role->givePermissionTo(Permission::all());

        // Create User
        User::factory()->count(1)->create([
            'id'=>1,
            'name' => 'ერეკლე გიორგაძე',
            'email' => 'admin@mail.com',
            'phone'=> '598550011',
            'status'=>'1',
            'password' => bcrypt('Flex4545@')
        ])->each(function ($user){
            $user->assignRole('super_admin');
        });
    }
}
