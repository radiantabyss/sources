<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function report(\Throwable $exception)
    {
        if ($this->shouldReport($exception)) {
            $request = request();
            $url = $request->url();
            $params = http_build_query(array_filter($request->query(), function($value, $key) {
                return $key != 'jwt_token';
            }, ARRAY_FILTER_USE_BOTH));

            if ( $params ) {
                $url .= '?'.$params;
            }

            $payload = $request->except(['jwt_token', 'current_password', 'password', 'password_confirmation']);

            if ( $request->method() == 'GET' ) {
                $payload = [];
            }

            Log::error($url, $payload);
        }

        parent::report($exception);
    }
}
