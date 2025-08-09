<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */
    'hacienda' => [
        'urlBase' => env('HACIENDA_API_URL', 'https://apitest.dtes.mh.gob.sv/fesv/recepciondte'), // o el que uses
        'user'=> env('HACIENDA_API_USER', '111111111'),
        'pwd' => env('HACIENDA_API_PASSWORD', '00000000')
    ],

    'firmador' => [
        'endpoint' => env('FIRMADOR_ENDPOINT', 'http://localhost:8113/firmardocumento/'),
        'nit' => env('HACIENDA_API_USER', '00000000'),
        'passwordPri'=>env('SECRET_KEY', '00000000000')
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

];
