<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class BogPaymentService
{
    private $clientId;
    private $clientSecret;
    private $authUrl;
    private $apiUrl;

    public function __construct()
    {
        $this->clientId = config('services.bog.client_id');
        $this->clientSecret = config('services.bog.client_secret');
        $this->authUrl = config('services.bog.auth_url');
        $this->apiUrl = config('services.bog.api_url');
    }

    /**
     * Get access token from BOG OAuth2
     * Token is cached for 55 minutes (BOG tokens usually expire in 1 hour)
     *
     * @return string|null Access token
     */
    private function getAccessToken(): ?string
    {
        $cacheKey = 'bog_access_token';

        // Check if token is cached
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        try {
            // Request new token from BOG
            $response = Http::withBasicAuth($this->clientId, $this->clientSecret)
                ->asForm()
                ->post($this->authUrl . '/auth/realms/bog/protocol/openid-connect/token', [
                    'grant_type' => 'client_credentials',
                ]);

            if ($response->successful()) {
                $data = $response->json();
                $accessToken = $data['access_token'];
                $expiresIn = $data['expires_in'] ?? 3600; // Default 1 hour

                // Cache token for 55 minutes (5 minutes before expiration)
                Cache::put($cacheKey, $accessToken, now()->addSeconds($expiresIn - 300));

                Log::info('BOG access token obtained', [
                    'expires_in' => $expiresIn,
                ]);

                return $accessToken;
            }

            Log::error('BOG token request failed', [
                'status' => $response->status(),
                'response' => $response->json(),
            ]);

            return null;

        } catch (\Exception $e) {
            Log::error('BOG token request exception', [
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Make authenticated request to BOG API
     *
     * @param string $method HTTP method (GET, POST, etc.)
     * @param string $endpoint API endpoint
     * @param array $data Request data
     * @return array Response with success status and data
     */
    private function makeAuthenticatedRequest(string $method, string $endpoint, array $data = []): array
    {
        $token = $this->getAccessToken();

        if (!$token) {
            return [
                'success' => false,
                'error' => 'Failed to obtain access token',
            ];
        }

        try {
            $url = $this->apiUrl . $endpoint;

            $response = Http::withToken($token)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                ])
                ->{strtolower($method)}($url, $data);

            if ($response->successful()) {
                return [
                    'success' => true,
                    'data' => $response->json(),
                    'status' => $response->status(),
                ];
            }

            // Check if token expired (401) and retry once
            if ($response->status() === 401) {
                Log::warning('BOG token expired, retrying...');

                // Clear cached token
                Cache::forget('bog_access_token');

                // Get new token
                $token = $this->getAccessToken();

                if ($token) {
                    // Retry request with new token
                    $response = Http::withToken($token)
                        ->withHeaders([
                            'Content-Type' => 'application/json',
                            'Accept' => 'application/json',
                        ])
                        ->{strtolower($method)}($url, $data);

                    if ($response->successful()) {
                        return [
                            'success' => true,
                            'data' => $response->json(),
                            'status' => $response->status(),
                        ];
                    }
                }
            }

            Log::error('BOG API request failed', [
                'method' => $method,
                'endpoint' => $endpoint,
                'status' => $response->status(),
                'response' => $response->json(),
            ]);

            return [
                'success' => false,
                'error' => $response->json('message') ?? 'API request failed',
                'status' => $response->status(),
                'response' => $response->json(),
            ];

        } catch (\Exception $e) {
            Log::error('BOG API request exception', [
                'method' => $method,
                'endpoint' => $endpoint,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'error' => 'API request error: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Initialize payment in BOG system
     *
     * @param int $orderId Order ID
     * @param float $amount Payment amount in GEL
     * @param string $description Payment description
     * @param string $returnUrl Callback URL after payment
     * @param string $locale Language (ka, en, ru)
     * @return array Payment initialization result
     */
    public function initializePayment(
        int $orderId,
        float $amount,
        string $description,
        string $callBackUrl,
        string $returnUrl,
        string $locale = 'ka'
    ): array
    {
        $payload = [
            'callback_url' => $returnUrl,
            'external_order_id' => (string) $orderId,
            'purchase_units' => [
                'currency' => 'GEL',
                'total_amount' => $amount,
                'basket' => [
                    [
                        'quantity' => 1,
                        'unit_price' => $amount,
                        'product_id' => (string) $orderId,
                        'description' => $description,
                    ]
                ]
            ],
            'redirect_urls' => [
                'success' => $returnUrl . '?status=success',
                'fail' => $returnUrl . '?status=failed',
            ],
            'show_shop_name' => true,
            'locale' => $locale,
        ];

        $result = $this->makeAuthenticatedRequest('POST', '/payments/v1/ecommerce/orders', $payload);

        if ($result['success']) {
            $data = $result['data'];

//            Log::info('BOG payment successful', [$data]);
            return [
                'success' => true,
                'payment_url' => $data['_links']['redirect']['href'] ?? null, // Payment page URL
                'payment_id' => $data['id'] ?? null, // BOG order ID
                'data' => $data,
            ];
        }

        return [
            'success' => false,
            'error' => $result['error'] ?? 'Payment initialization failed',
        ];
    }

    /**
     * Check payment status
     *
     * @param string $orderId BOG order ID
     * @return array Payment status result
     */
    public function checkPaymentStatus(string $orderId): array
    {
        $result = $this->makeAuthenticatedRequest('GET', "/payments/v1/ecommerce/orders/{$orderId}");

        if ($result['success']) {
            $data = $result['data'];

            // Map BOG status to our status
            $statusMap = [
                'CREATED' => 'pending',
                'PENDING' => 'processing',
                'COMPLETED' => 'success',
                'REJECTED' => 'failed',
                'CANCELLED' => 'cancelled',
            ];

            $bogStatus = $data['status'] ?? 'UNKNOWN';
            $mappedStatus = $statusMap[$bogStatus] ?? 'pending';

            return [
                'success' => true,
                'status' => $mappedStatus,
                'bog_status' => $bogStatus,
                'data' => $data,
            ];
        }

        return [
            'success' => false,
            'error' => $result['error'] ?? 'Failed to check payment status',
        ];
    }

    /**
     * Refund payment (full or partial)
     *
     * @param string $orderId BOG order ID
     * @param float|null $amount Amount to refund (null for full refund)
     * @return array Refund result
     */
    public function refundPayment(string $orderId, ?float $amount = null): array
    {
        $payload = [];

        // If amount is specified, do partial refund
        if ($amount !== null) {
            $payload['amount'] = $amount;
        }

        $result = $this->makeAuthenticatedRequest('POST', "/payments/v1/ecommerce/orders/{$orderId}/refund", $payload);

        if ($result['success']) {
            $data = $result['data'];

            return [
                'success' => true,
                'refund_id' => $data['refund_id'] ?? $data['id'] ?? null,
                'data' => $data,
            ];
        }

        return [
            'success' => false,
            'error' => $result['error'] ?? 'Refund failed',
        ];
    }

    /**
     * Get payment details
     *
     * @param string $orderId BOG order ID
     * @return array Payment details
     */
    public function getPaymentDetails(string $orderId): array
    {
        return $this->checkPaymentStatus($orderId);
    }

    /**
     * Complete payment (for two-step payments)
     *
     * @param string $orderId BOG order ID
     * @param float $amount Amount to complete
     * @return array Complete result
     */
    public function completePayment(string $orderId, float $amount): array
    {
        $payload = [
            'amount' => $amount,
        ];

        $result = $this->makeAuthenticatedRequest('POST', "/payments/v1/ecommerce/orders/{$orderId}/completion", $payload);

        if ($result['success']) {
            return [
                'success' => true,
                'data' => $result['data'],
            ];
        }

        return [
            'success' => false,
            'error' => $result['error'] ?? 'Payment completion failed',
        ];
    }

    /**
     * Cancel payment
     *
     * @param string $orderId BOG order ID
     * @return array Cancel result
     */
    public function cancelPayment(string $orderId): array
    {
        $result = $this->makeAuthenticatedRequest('POST', "/payments/v1/ecommerce/orders/{$orderId}/cancel", []);

        if ($result['success']) {
            return [
                'success' => true,
                'data' => $result['data'],
            ];
        }

        return [
            'success' => false,
            'error' => $result['error'] ?? 'Payment cancellation failed',
        ];
    }

    /**
     * Validate webhook signature from BOG
     * BOG sends webhooks for payment status updates
     *
     * @param array $payload Webhook payload
     * @param string $signature Signature from header
     * @return bool Whether signature is valid
     */
    public function validateWebhookSignature(array $payload, string $signature): bool
    {
        // BOG webhook validation logic
        // This depends on BOG's specific implementation
        // Usually involves HMAC verification

        $calculatedSignature = hash_hmac('sha256', json_encode($payload), $this->clientSecret);

        return hash_equals($calculatedSignature, $signature);
    }
}
