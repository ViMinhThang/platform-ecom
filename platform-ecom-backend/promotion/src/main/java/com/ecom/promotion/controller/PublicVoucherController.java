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
                request.getVoucherCodes(),
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
                request.getVoucherCodes(),
                request.getUserId());
        return ResponseBuilder.success("Vouchers applied successfully", result);
    }


    @GetMapping("/available")
    public ResponseEntity<APIResponse<List<VoucherDTO>>> getAllAvailableVouchers() {
        List<VoucherDTO> vouchers = voucherService.getAllActiveVouchers();
        return ResponseBuilder.success("Available vouchers retrieved", vouchers);
    }
}
