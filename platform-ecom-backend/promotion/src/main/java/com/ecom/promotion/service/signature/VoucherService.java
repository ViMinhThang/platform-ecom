package com.ecom.promotion.service.signature;

import com.ecom.promotion.dto.VoucherDTO;
import com.ecom.promotion.dto.request.CreateVoucherRequest;
import com.ecom.promotion.enums.VoucherCategory;
import com.ecom.promotion.enums.VoucherStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface VoucherService {

    VoucherDTO createVoucher(CreateVoucherRequest request);

    VoucherDTO updateVoucher(Long id, CreateVoucherRequest request);

    void deleteVoucher(Long id);

    VoucherDTO getVoucherById(Long id);

    Optional<VoucherDTO> getVoucherByCode(String code);

    Page<VoucherDTO> getAllVouchers(Pageable pageable);

    Page<VoucherDTO> getVouchersByStatus(VoucherStatus status, Pageable pageable);

    Page<VoucherDTO> getVouchersByCategory(VoucherCategory category, Pageable pageable);

    List<VoucherDTO> getActiveAutoApplyVouchers();

    List<VoucherDTO> getAllActiveVouchers();

    VoucherDTO activateVoucher(Long id);

    VoucherDTO cancelVoucher(Long id);

    void updateVoucherStatuses();

    boolean validateVoucherCode(String code, Long userId);
}
