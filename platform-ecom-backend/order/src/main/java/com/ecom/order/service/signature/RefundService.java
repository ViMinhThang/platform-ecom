package com.ecom.order.service.signature;

import com.ecom.order.dto.RefundRequest;
import com.ecom.order.entity.RefundTransaction;

/**
 * Refund Service Interface
 */
public interface RefundService {

    RefundTransaction processRefund(Long subOrderId, RefundRequest request);
}
