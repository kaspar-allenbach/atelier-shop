<?php

return [
    '*' => [
        'enabled' => true,
        'password' => getenv('FRONTEND_PASSWORD'),
    ],
    'dev' => [
        'enabled' => false,
        
    ],
    'stage' => [
        'enabled' => true,
        
    ],
    'production' => [
        'enabled' => false,
    ],
];
