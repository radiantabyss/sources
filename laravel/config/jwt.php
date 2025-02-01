<?php
return [
    'input' => env('JWT_INPUT', 'token'),
    'secret' => env('JWT_SECRET'),
    'algorithm' => env('JWT_ALGORITHM', 'HS256'),
    'lifetime' => env('JWT_LIFETIME', 1),
];
