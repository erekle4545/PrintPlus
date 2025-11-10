<?php

namespace App\Helpers\Core;

/**
 * Class MultiTenant
 *
 * @package App\Helpers\Core
 */
abstract class Multitenant
{
    /**
     * Retrieve class based on given path
     */
    protected static function resolve($class, $path)
    {
        if (class_exists($path . 'Project\\' . $class)) {
            return $path . 'Project\\' . $class;
        } else {
            return $path  . $class;
        }
    }

    /**
     * Retrieve service class
     */
    public static function getService($class)
    {
        return self::resolve($class, 'App\Services\\');
    }

    /**
     * Retrieve model class
     */
    public static function getModel($class)
    {
       return self::resolve($class, 'App\Models\\');
    }
}
