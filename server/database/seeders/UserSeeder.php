<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Permissions
        $permission_data = ['create', 'view', 'update', 'delete'];

        // Reset cached permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        foreach ($permission_data as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }

        // Create roles
        $superAdmin = Role::firstOrCreate([
            'name' => 'super_admin',
            'guard_name' => 'web',
        ]);

        $customer = Role::firstOrCreate([
            'name' => 'customer',
            'guard_name' => 'web',
        ]);

        // Assign permissions
        $superAdmin->givePermissionTo(Permission::all());

        $customer->givePermissionTo([
            'create',
            'view',
        ]);

        // Create Super Admin User
        $user = User::firstOrCreate(
            ['email' => 'admin@mail.com'],
            [
                'name' => 'ერეკლე გიორგაძე',
                'phone' => '598197373',
                'password' => bcrypt('Flex4545@'),
            ]
        );

        $user->assignRole('super_admin');
    }
}
