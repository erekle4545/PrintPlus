<?php

namespace App\Providers;

use App\Repositories\Category\ProductCategoryRepository;
use App\Repositories\Interfaces\AuthRepositoryInterface;
use App\Repositories\Interfaces\CustomerRepositoryInterface;
use App\Repositories\Interfaces\OrdersRepositoryInterface;
use App\Repositories\Interfaces\ProductCategoryRepositoryInterface;
use App\Repositories\Interfaces\ProductsRepositoryInterface;
use App\Repositories\Interfaces\RoleRepositoryInterface;
use App\Repositories\Orders\OrdersRepository;
use App\Repositories\Products\ProductsRepository;
use App\Repositories\Role\RoleRepository;
use App\Repositories\Users\AuthRepository;
use App\Repositories\Users\CustomerRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(ProductsRepositoryInterface::class,ProductsRepository::class);
        $this->app->bind(ProductCategoryRepositoryInterface::class,ProductCategoryRepository::class);
        $this->app->bind(AuthRepositoryInterface::class,AuthRepository::class);
        $this->app->bind(CustomerRepositoryInterface::class,CustomerRepository::class);
        $this->app->bind(OrdersRepositoryInterface::class,OrdersRepository::class);
        $this->app->bind(RoleRepositoryInterface::class,RoleRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
