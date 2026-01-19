<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class MailProvider extends ServiceProvider
{
    public function boot() {
        //register mail views
        $domains = [
            'Common',
        ];
        foreach ( $domains as $domain ) {
            \View::addNamespace($domain, __DIR__ . '/../Domains/'.str_replace('.', '/', $domain).'/Mail/views');
        }
    }
}
