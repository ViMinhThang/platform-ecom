package com.ecom.promotion.controller.Admin;

import com.ecom.common.util.APIResponse;
import com.ecom.common.util.ResponseBuilder;
import com.ecom.promotion.dto.VoucherDTO;
import com.ecom.promotion.dto.request.CreateVoucherRequest;
import com.ecom.promotion.enums.VoucherStatus;
import com.ecom.promotion.service.signature.VoucherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/vouchers")
@RequiredArgsConstructor
public class AdminVoucherController {

    private final VoucherService voucherService;

    @PostMapping
    public ResponseEntity<APIResponse<VoucherDTO>> createVoucher(
            @Valid @RequestBody CreateVoucherRequest request) {
        VoucherDTO voucher = voucherService.createVoucher(request);
        return ResponseBuilder.createdWithMessage("Voucher created successfully", voucher);
    }

    @GetMapping
    public ResponseEntity<APIResponse<Page<VoucherDTO>>> getAllVouchers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {
        Sort sort = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Page<VoucherDTO> vouchers = voucherService.getAllVouchers(PageRequest.of(page, size, sort));
        return ResponseBuilder.success("Vouchers retrieved successfully", vouchers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<VoucherDTO>> getVoucherById(@PathVariable Long id) {
        VoucherDTO voucher = voucherService.getVoucherById(id);
        return ResponseBuilder.success("Voucher retrieved successfully", voucher);
    }

    @PutMapping("/{id}")
    public ResponseEntity<APIResponse<VoucherDTO>> updateVoucher(
            @PathVariable Long id,
            @Valid @RequestBody CreateVoucherRequest request) {
        VoucherDTO voucher = voucherService.updateVoucher(id, request);
        return ResponseBuilder.success("Voucher updated successfully", voucher);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse<Void>> deleteVoucher(@PathVariable Long id) {
        voucherService.deleteVoucher(id);
        return ResponseBuilder.success("Voucher deleted successfully", null);
    }

    @PostMapping("/{id}/activate")
    public ResponseEntity<APIResponse<VoucherDTO>> activateVoucher(@PathVariable Long id) {
        VoucherDTO voucher = voucherService.activateVoucher(id);
        return ResponseBuilder.success("Voucher activated successfully", voucher);
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<APIResponse<VoucherDTO>> cancelVoucher(@PathVariable Long id) {
        VoucherDTO voucher = voucherService.cancelVoucher(id);
        return ResponseBuilder.success("Voucher cancelled successfully", voucher);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<APIResponse<Page<VoucherDTO>>> getVouchersByStatus(
            @PathVariable VoucherStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<VoucherDTO> vouchers = voucherService.getVouchersByStatus(status, PageRequest.of(page, size));
        return ResponseBuilder.success("Vouchers retrieved successfully", vouchers);
    }
}
