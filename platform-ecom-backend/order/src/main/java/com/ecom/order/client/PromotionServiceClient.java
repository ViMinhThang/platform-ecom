package com.ecom.order.client;

import com.ecom.common.util.APIResponse;
import com.ecom.order.dto.ApplyVouchersRequest;
import com.ecom.order.dto.DiscountResultDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange
public interface PromotionServiceClient {

    Logger log = LoggerFactory.getLogger(PromotionServiceClient.class);

    @PostExchange("/vouchers/calculate")
    APIResponse<DiscountResultDTO> calculateDiscount(@RequestBody ApplyVouchersRequest request);

    @PostExchange("/vouchers/apply")
    APIResponse<DiscountResultDTO> applyVouchers(@RequestBody ApplyVouchersRequest request);

    default DiscountResultDTO calculateDiscountSafe(ApplyVouchersRequest request) {
        try {
            APIResponse<DiscountResultDTO> response = calculateDiscount(request);
            if (response != null && response.isSuccess()) {
                return response.getData();
            }
        } catch (Exception e) {
            log.error("Error calculating discount: {}", e.getMessage());
        }
        return null;
    }

    default DiscountResultDTO applyVouchersSafe(ApplyVouchersRequest request) {
        try {
            APIResponse<DiscountResultDTO> response = applyVouchers(request);
            if (response != null && response.isSuccess()) {
                return response.getData();
            }
        } catch (Exception e) {
            log.error("Error applying vouchers: {}", e.getMessage());
        }
        return null;
    }
}
