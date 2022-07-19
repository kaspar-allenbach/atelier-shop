<?php

return [
    '*' => [
        'enabled' => true,
        'password' => getenv('FRONTEND_PASSWORD'),
    ],
    'dev' => [
        'enabled' => true,
        
    ],
    'stage' => [
        'enabled' => true,
        
    ],
    'production' => [
        'enabled' => false,
    ],
];
