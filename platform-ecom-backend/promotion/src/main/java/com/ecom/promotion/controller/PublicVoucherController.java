package com.ecom.promotion.controller;

import com.ecom.common.util.APIResponse;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.promotion.dto.CalculateDiscountRequest;
import com.ecom.promotion.dto.DiscountResult;
import com.ecom.promotion.dto.VoucherDTO;
import com.ecom.promotion.service.signature.DiscountCalculator;
import com.ecom.promotion.service.signature.VoucherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/vouchers")
@RequiredArgsConstructor
public class PublicVoucherController {

    private final VoucherService voucherService;
    private final DiscountCalculator discountCalculator;

    @PostMapping("/calculate")
    public ResponseEntity<APIResponse<DiscountResult>> calculateDiscount(
            @Valid @RequestBody CalculateDiscountRequest request) {
        DiscountResult result = discountCalculator.calculateDiscount(
                request.getItems(),
                request.getShippingFee(),
                request.getVoucherCode(),
                request.getUserId());
        return ResponseBuilder.success("Discount calculated successfully", result);
    }

    @PostMapping("/apply")
    public ResponseEntity<APIResponse<DiscountResult>> applyVouchers(
            @Valid @RequestBody CalculateDiscountRequest request) {
        DiscountResult result = discountCalculator.applyVouchers(
                request.getOrderId(),
                request.getItems(),
                request.getShippingFee(),
                request.getVoucherCode(),
                request.getUserId());
        return ResponseBuilder.success("Vouchers applied successfully", result);
    }

    @GetMapping("/validate/{code}")
    public ResponseEntity<APIResponse<Boolean>> validateVoucherCode(
            @PathVariable String code,
            @RequestParam Long userId) {
        boolean valid = voucherService.validateVoucherCode(code, userId);
        return ResponseBuilder.success("Voucher validation result", valid);
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<APIResponse<VoucherDTO>> getVoucherByCode(@PathVariable String code) {
        return voucherService.getVoucherByCode(code)
                .map(v -> ResponseBuilder.success("Voucher retrieved", v))
                .orElseGet(() -> ResponseBuilder.success("Voucher not found", null));
    }

    @GetMapping("/auto-apply")
    public ResponseEntity<APIResponse<List<VoucherDTO>>> getActiveAutoApplyVouchers() {
        List<VoucherDTO> vouchers = voucherService.getActiveAutoApplyVouchers();
        return ResponseBuilder.success("Auto-apply vouchers retrieved", vouchers);
    }
}
