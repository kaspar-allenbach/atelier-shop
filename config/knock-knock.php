<?php

return [
    '*' => [
        'enabled' => true,
        'password' => getenv('FRONTEND_PASSWORD'),
    ],
    'dev' => [
        'enabled' => false,
        
    ],
    'production' => [
        'enabled' => false,
    ],
];