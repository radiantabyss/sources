<?php
namespace App\Http\Middleware;

use Closure;
use RA\Auth\Services\Jwt;

class LangMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $lang = $this->getFromJwt($request) ?: ($this->getFromRequest($request) ?: config('app.default_lang'));
        \App::setLocale($lang);

        return $next($request);
    }

    private function getFromJwt($request) {
        //get jwt token from request
        $payload = $request->get(config('jwt.input'));

        if ( !$payload ) {
            return false;
        }

        //validate token
        $token = Jwt::validate($payload);
        if ( $token === false ) {
            return false;
        }

        return $token->lang ?? config('app.default_lang');
    }

    private function getFromRequest($request) {
        if ( !$request->has('_lang') ) {
            return false;
        }

        return $request->get('_lang');
    }
}
