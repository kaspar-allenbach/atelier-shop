<?php

/**
 * General Configuration
 *
 * All of your system's general configuration settings go in here. You can see a
 * list of the available settings in vendor/craftcms/cms/src/config/GeneralConfig.php.
 *
 * @see \craft\config\GeneralConfig
 */

return [
  // Global settings
  '*' => [
    'optimizers' => ['jpegoptim', 'optipng'],
  ],

  // Dev environment settings
  'dev' => [],
  // Testing environment settings
  'stage' => [],
  // Production environment settings
  'production' => [],
];
