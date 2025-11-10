<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionsGenerate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:permissions-generate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Permissions generate';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $bar = $this->output->createProgressBar(Role::query()->count());
        $bar->start();
        // generate new permissions
        $permission_data =  config('permission.permissions');
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // create permissions
        $templates = array_values(config('menu.templates'));



        foreach ($permission_data as $permissionRow){
            foreach ($templates as $row){
                $templateKey  = str_replace('_',' ',$row['key']);
                $permissions = Permission::query()->where('name',"{$permissionRow} {$templateKey}")->count();
                if($permissions === 0){
                    Permission::create([
                        'name'=>"{$permissionRow} {$templateKey}",
                        'group'=>'',
                        'guard_name'=>'web',
                        'local'=>'global'
                    ]);
                }
            }
        }
        // create roles and assign created permissions
        $role = Role::where('id',1)->first();
        $role->givePermissionTo(Permission::all());
        $bar->finish();
    }
}
