<?php

return [
    '*' => [
        'cachingEnabled' => true,
        'warmCacheAutomatically' => true,
        'concurrency' => 5,
        'debug' => true,
        'includedUriPatterns' => [
            [
                'uriPattern' => '.*',
            ],
        ],
        'excludedUriPatterns' => [

            [
                'uriPattern' => '/knock-knock/who-is-there',
            ],
            [
                'uriPattern' => '/purchase/*',
            ],
            [
                'uriPattern' => '/discipline/*',
            ],
            [
                'uriPattern' => '/client/*',
            ],
            [
                'uriPattern' => '/object/*',
            ],
            [
                'uriPattern' => '/produktionsart/*',
            ],
            [
                'uriPattern' => '/produktkategorie/*',
            ],
            [
                'uriPattern' => '/produktgroesse/*',
            ],
            [
                'uriPattern' => '/shopdata',
            ],
            [
                'uriPattern' => '/galerie',
            ],
        ],
    ],
    'dev' => [
        'cachingEnabled' => false,
    ],
    'stage' => [
        'cachingEnabled' => true,
    ],
    'production' => [],
];
