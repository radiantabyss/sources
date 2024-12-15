<?php
return [
    'APP_NAME' => 'Lumi Back',
    'APP_ENV' => 'local',
    'APP_KEY' => '',
    'APP_DEBUG' => true,

    'LOG_CHANNEL' => 'stack',

    'DB_CONNECTION' => 'mysql',
    'DB_HOST' => '127.0.0.1',
    'DB_PORT' => '3306',
    'DB_DATABASE' => 'lumi',
    'DB_USERNAME' => 'root',
    'DB_PASSWORD' => '',

    'CACHE_DRIVER' => 'file',
    'QUEUE_CONNECTION' => 'sync',

    'JWT_INPUT' => 'jwt_token',
    'JWT_SECRET' => '1234',

    'FRONT_URL' => 'http://lumi-front',
    'BACK_URL' => 'http://lumi-back',
    'UPLOADS_URL' => 'http://lumi-back/uploads',
    'UPLOADS_PATH' => '/public/uploads',

    'MAIL_DRIVER' => 'log',
    'MAIL_FROM_ADDRESS' => 'robert@radiantabyss.com',
    'MAIL_FROM_NAME' => 'Robert',

    'MAILGUN_DOMAIN' => '',
    'MAILGUN_SECRET' => '',
    'MAILGUN_ENDPOINT' => '',

    'MONITOR_LOGS_EMAIL' => '',
];
