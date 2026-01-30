<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray( $request): array
    {
        return [
            'id' => $this->transaction_id,
            'order_id' => $this->order_id,
            'type' => $this->type,
            'status' => $this->status,
            'amount' => (float) $this->amount,
            'currency' => $this->currency,
            'payment_gateway' => $this->payment_gateway,
            'gateway_transaction_id' => $this->gateway_transaction_id,
            'description' => $this->description,
            'error_message' => $this->when($this->hasFailed(), $this->error_message),
            'initiated_at' => $this->initiated_at?->toIso8601String(),
            'completed_at' => $this->completed_at?->toIso8601String(),
            'failed_at' => $this->failed_at?->toIso8601String(),
            'refunded_at' => $this->refunded_at?->toIso8601String(),
            'total_refunded' => $this->when($this->type === 'payment', (float) $this->getTotalRefundedAmount()),
            'available_for_refund' => $this->when($this->type === 'payment', (float) $this->getAvailableRefundAmount()),
            'refunds' => TransactionResource::collection($this->whenLoaded('refunds')),
            'parent_transaction' => new TransactionResource($this->whenLoaded('parentTransaction')),
        ];
    }
}
