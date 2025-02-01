<?php
return [
    'APP_NAME' => 'Back',
    'APP_ENV' => 'local',
    'APP_KEY' => '',
    'APP_DEBUG' => true,
    'APP_DEFAULT_LANG' => '',

    'LOG_CHANNEL' => 'stack',

    'DB_CONNECTION' => 'mysql',
    'DB_HOST' => '127.0.0.1',
    'DB_PORT' => '3306',
    'DB_DATABASE' => '',
    'DB_USERNAME' => 'root',
    'DB_PASSWORD' => '',

    'CACHE_DRIVER' => 'file',
    'QUEUE_CONNECTION' => 'sync',

    'JWT_INPUT' => 'jwt_token',
    'JWT_SECRET' => '1234',
    'JWT_LIFETIME' => 1000000,

    'FRONT_URL' => 'http://front',
    'BACK_URL' => 'http://back',
    'UPLOADS_URL' => 'http://back/uploads',
    'UPLOADS_PATH' => '/public/uploads',

    'MAIL_DRIVER' => 'smtp',
    'MAIL_HOST' => '127.0.0.1',
    'MAIL_PORT' => '1025',
    'MAIL_USERNAME' => null,
    'MAIL_PASSWORD' => null,
    'MAIL_FROM_ADDRESS' => 'robert@radiantabyss.com',
    'MAIL_FROM_NAME' => 'Robert',

    'MAILGUN_DOMAIN' => '',
    'MAILGUN_SECRET' => '',
    'MAILGUN_ENDPOINT' => '',

    'MONITOR_LOGS' => false,
    'MONITOR_LOGS_SLACK_CHANNEL' => '',
];
