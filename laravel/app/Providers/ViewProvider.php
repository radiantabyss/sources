<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class ViewProvider extends ServiceProvider
{
    public function boot() {
        \View::addNamespace('AppDomains', app_path() . '/Domains');
    }
}
