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
    'defaultWeekStartDay' => 1,
    'omitScriptNameInUrls' => true,
    'cpTrigger' => getenv('CP_TRIGGER'),
    'securityKey' => getenv('SECURITY_KEY'),
    'useProjectConfigFile' => true,
    'limitAutoSlugsToAscii' => true,
    //disable craft caching use blitz cache instead
    'enableTemplateCaching' => false,
    'tokenParam' => 'craftToken',
    'loginPath' => 'shopdata/login',
    'aliases' => [
      'assetSiteUrl' => getenv('ASSET_SITE_URL'),
      'assetSiteRoot' => getenv('ASSET_SITE_ROOT'),
    ],
  ],

  // Dev environment settings
  'dev' => [
    // Dev Mode (see https://craftcms.com/guides/what-dev-mode-does)
    'devMode' => true,
    'enableCsrfProtection' => false,
  ],
  // Testing environment settings
  'stage' => [
    // Set this to `false` to prevent administrative changes from being made on production
    'allowAdminChanges' => true,
    'enableCsrfProtection' => true,
    'devMode' => true,
  ],
  // Production environment settings
  'production' => [
    // Set this to `false` to prevent administrative changes from being made on production
    'allowAdminChanges' => false,
    'devMode' => false,
  ],
];
