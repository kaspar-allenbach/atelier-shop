<?php

namespace modules\payrexx\controllers;

use craft\web\Controller;
use yii\web\Response;

class PayrexxGatewayController extends Controller {
    /**
     * Create a new instance of PayrexxGatewayController.
     */
    public function __construct()
    {
        parent::__construct('PayrexxGatewayController', 'payrexx');
    }

    /**
     * Redirect to the given URL.
     *
     * @param $url - The URL to redirect to.
     * @return The HTTP response.
     */
    public function actionRedirect(string $url): Response
    {
        return $this->redirect($url);
    }
}