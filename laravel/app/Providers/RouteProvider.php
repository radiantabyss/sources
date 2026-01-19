<?php
namespace App\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteProvider extends ServiceProvider
{
    /**
     * Define the routes for the application.
     *
     * @return void
     */
    public function map()
    {
        // load auth routes
        try {
            \Route::middleware('routes')
                ->namespace('RA\Auth\Domains')
                ->group(base_path('routes/ra-auth.php'));
        }
        catch(\Exception $e) {}

        //load routes
        \Route::middleware('routes')
            ->namespace('App\Domains')
            ->group(base_path('routes/routes.php'));

        //load routes that required auth
        if ( !\Auth::check() ) {
            return;
        }

        //load routes by user type or team role
    }
}
