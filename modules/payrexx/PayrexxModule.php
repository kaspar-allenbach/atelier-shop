<?php
namespace modules\payrexx;

use Craft;
use modules\payrexx\controllers\PayrexxGatewayController;
use craft\commerce\Plugin;
use craft\commerce\elements\Order;
use craft\commerce\models\Transaction;
use Payrexx\Payrexx;
use Payrexx\PayrexxException;
use Payrexx\Models\Response\Gateway as GatewayResponse;
use Payrexx\Models\Request\Gateway as GatewayRequest;
use yii\base\Module;

class PayrexxModule extends Module
{
    /**
     * Redirect URL on success.
     */
    private static $redirectUrlConfirm = '/purchase/customer/order?number=';

    /**
     * Redirect URL on cancelation.
     */
    private static $redirectUrlCancel = '/purchase/checkout/addresses';

    /**
     * Initialize the PayrexxModule.
     */
    public function init()
    {
        // Define a custom alias named after the namespace
        Craft::setAlias('@modules/payrexx', __DIR__);

        // Set the controllerNamespace based on whether this is a console or web request
        if (Craft::$app->getRequest()->getIsConsoleRequest()) {
            $this->controllerNamespace = 'modules\\payrexx\\console\\controllers';
        } else {
            $this->controllerNamespace = 'modules\\payrexx\\controllers';
        }

        parent::init();

        // Create the Payrexx Gateway hook for usage in the view.
        Craft::$app->view->hook('payrexx-gateway', function(array $context) {
            // Create a new Payrexx SDK instance.
            $payrexx = new Payrexx(
                getenv('PAYREXX_INSTANCE'),
                getenv('PAYREXX_API_SECRET')
            );

            // Get order in cart from the context (reference, because we want to
            // set the orderStatusId to the gateway id).
            $order = $context['cart'];

            // Retrieve the payment gateway id from the order.
            $payrexxGatewayId = $order->getFieldValue('payrexxGatewayId');

            // Get the gateway response.
            $gatewayResponse =
                $payrexxGatewayId === null
                ? $this->createGateway($payrexx, $order)
                : $this->getGateway($payrexx, (int) $payrexxGatewayId);

            // Initialize the redirect URL var.
            $redirectUrl = null;

            // If the gateway status is confirmed or authorized:
            $gatewayStatus = $gatewayResponse->getStatus();
            if ($gatewayStatus === 'confirmed' || $gatewayStatus === 'authorized') {
                // Mark order as confirmed.
                $this->markOrderAsConfirmed($order, $gatewayResponse);

                // Redirect to the confirmed order page.
                $redirectUrl = PayrexxModule::$redirectUrlConfirm . $order->number;

            // And if the gateway is not confirmed:
            } else {
                // If the user comes to this page from the previous step of the
                // cart checkout (the address form), we assume s*he wants to pay.
                if (strpos($_SERVER['HTTP_REFERER'], PayrexxModule::$redirectUrlCancel) > 0) {
                    // Create a gateway.
                    $gateway = $this->createGateway($payrexx, $order);

                    // Set the gateway id on the order.
                    $order->setFieldValue('payrexxGatewayId', $gateway->getId());

                    // Persist the order element.
                    Craft::$app->getElements()->saveElement($order);

                    // Redirect to the payrexx gateway link (payment form).
                    $redirectUrl = $gateway->getLink();

                // If the user comes from anywhere else (also the payrexx
                // gateway) go back one step in the checkout process.
                } else {
                    $order->setFieldValue('payrexxGatewayId', null);
                    $redirectUrl = PayrexxModule::$redirectUrlCancel;
                }
            }

            // Create a controller instance and redirect to the set URL.
            $controller = new PayrexxGatewayController();
            $controller->actionRedirect($redirectUrl);
        });
    }

    /**
     * Create a payrexx gateway.
     *
     * @param $payrexx - The payrexx SDK instance.
     * @param $order - The craft commerce order.
     * @return The payrexx gateway.
     */
    private function createGateway(Payrexx $payrexx, Order $order): GatewayResponse
    {
        // Create a new gateway request.
        $gatewayRequest = new GatewayRequest();

        // Set total amount (in cents).
        $gatewayRequest->setAmount($order->total * 100);

        // Set currency (ISO code).
        $gatewayRequest->setCurrency($order->currency);

        // Set contact fields.
        $address = $order->billingAddress;

        // Set the mandatory fields first.
        $gatewayRequest->addField('email', $order->email);
        $gatewayRequest->addField('forename', $address->firstName);
        $gatewayRequest->addField('surname', $address->lastName);
        $gatewayRequest->addField('street', $address->address1);
        $gatewayRequest->addField('postcode', $address->zipCode);
        $gatewayRequest->addField('place', $address->city);
        $gatewayRequest->addField('country', $address->country->name);

        // Then set the optional fields.
        if (isset($address->businessName)) {
            $gatewayRequest->addField('company', $address->businessName);
        }
        
        // Redirect to this page again in any case, so we can handle the status.
        $currentUrl = Craft::$app->request->absoluteUrl;
        $gatewayRequest->setSuccessRedirectUrl($currentUrl);
        $gatewayRequest->setFailedRedirectUrl($currentUrl);
        $gatewayRequest->setCancelRedirectUrl($currentUrl);

        // Query the gateway response (or throw an error if it fails).
        try {
            return $payrexx->create($gatewayRequest);
        } catch (PayrexxException $e) {
            print $e->getMessage();
        }
    }

    /**
     * Query a payrexx gateway by it's id.
     *
     * @param $payrexx - The payrexx SDK instance.
     * @param $id - The payrexx gateway's id.
     * @return The payrexx gateway.
     */
    private function getGateway(Payrexx $payrexx, int $id): GatewayResponse
    {
        // Create a new gateway request.
        $gatewayRequest = new GatewayRequest();

        // Set the id of the gateway to query.
        $gatewayRequest->setId($id);

        // Fetch the payrexx gateway.
        try {
            return $payrexx->getOne($gatewayRequest);
        } catch (PayrexxException $e) {
            print $e->getMessage();
        }
    }

    /**
     * Mark the order as confirmed by creating a transaction and updating the
     * order's paid status.
     *
     * @param $order - The order to mark as confirmed.
     * @param $gatewayResponse - The payrexx gateway response.
     */
    private function markOrderAsConfirmed(
        Order $order,
        GatewayResponse $gatewayResponse
    ): void
    {
        // Create a transaction, belonging to the order.
        $transaction = $this->createTransaction($order);

        // Persist the transaction.
        Plugin::getInstance()->getTransactions()->saveTransaction($transaction);

        // Update the order's paid status.
        $order->updateOrderPaidInformation();

        // Get the payrexx invoice from the gateway response.
        $invoice = $gatewayResponse->getInvoices()[0];

        // Get the payrexx transaction from the payrexx invoice.
        $payrexxTransaction = $invoice['transactions'][0];

        // Get the payment brand slug from the payrexx transaction.
        $paymentBrand = $payrexxTransaction['payment']['brand'];

        // Add the payment brand slug to the order.
        $order->setFieldValue('payrexxPaymentMethod', $paymentBrand);

        // Add the payrexx transaction UUID to the order.
        $order->setFieldValue('payrexxTransactionId', $payrexxTransaction['uuid']);

        // Persist the order.
        Craft::$app->getElements()->saveElement($order);
    }

    /**
     * Create a new succesfull transaction for the given order.
     *
     * @param $order - The craft commerce order.
     * @return The succesfull craft commerce transaction for the order.
     */
    private function createTransaction(Order $order): Transaction
    {
        // Create a transaction instance.
        $transaction = new Transaction();

        // Set the transaction order.
        $transaction->setOrder($order);

        // Add all the transaction properties for a successful transaction.
        $transaction->gatewayId = $order->gatewayId;
        $transaction->type = 'purchase';
        $transaction->amount = $order->total;
        $transaction->paymentAmount = $order->total;
        $transaction->currency = $order->currency;
        $transaction->paymentCurrency = $order->currency;
        $transaction->paymentRate = 1;
        $transaction->status = 'success';

        // Return the filled transaction model.
        return $transaction;
    }
}
