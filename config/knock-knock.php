<?php

return [
    '*' => [
        'enabled' => true,
        'password' => getenv('FRONTEND_PASSWORD'),
    ],
    'dev' => [
        'enabled' => true,
        
    ],
    'production' => [
        'enabled' => false,
    ],
];