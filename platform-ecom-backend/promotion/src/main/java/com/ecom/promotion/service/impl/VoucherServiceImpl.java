package com.ecom.promotion.service.impl;

import com.ecom.common.exception.APIException;
import com.ecom.promotion.dto.VoucherDTO;
import com.ecom.promotion.dto.request.CreateVoucherRequest;
import com.ecom.promotion.entity.Voucher;
import com.ecom.promotion.enums.VoucherCategory;
import com.ecom.promotion.enums.VoucherStatus;
import com.ecom.promotion.mapper.VoucherMapper;
import com.ecom.promotion.helper.VoucherHelper;
import com.ecom.promotion.repository.VoucherRepository;
import com.ecom.promotion.service.signature.VoucherService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class VoucherServiceImpl implements VoucherService {

    private final VoucherRepository voucherRepository;
    private final VoucherMapper voucherMapper;
    private final VoucherHelper voucherHelper;

    @Override
    @Transactional
    public VoucherDTO createVoucher(CreateVoucherRequest request) {
        voucherHelper.validateTimeRange(request.getStartTime(), request.getEndTime());

        if (request.getCode() != null && voucherRepository.findByCode(request.getCode()).isPresent()) {
            throw new APIException("Voucher code already exists: " + request.getCode());
        }

        Voucher voucher = voucherHelper.buildVoucher(request);
        Voucher saved = voucherRepository.save(voucher);
        log.info("Created voucher: {} ({})", saved.getName(), saved.getId());
        return voucherMapper.toDTO(saved);
    }

    @Override
    @Transactional
    public VoucherDTO updateVoucher(Long id, CreateVoucherRequest request) {
        Voucher voucher = voucherHelper.findByIdOrThrow(id);
        voucherHelper.validateTimeRange(request.getStartTime(), request.getEndTime());
        voucherHelper.updateVoucherDetails(voucher, request);

        Voucher saved = voucherRepository.save(voucher);
        return voucherMapper.toDTO(saved);
    }

    @Override
    @Transactional
    public void deleteVoucher(Long id) {
        Voucher voucher = voucherHelper.findByIdOrThrow(id);
        voucherRepository.delete(voucher);
        log.info("Deleted voucher: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public VoucherDTO getVoucherById(Long id) {
        return voucherMapper.toDTO(voucherHelper.findByIdOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<VoucherDTO> getVoucherByCode(String code) {
        return voucherRepository.findByCode(code).map(voucherMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VoucherDTO> getAllVouchers(Pageable pageable) {
        return voucherRepository.findAll(pageable).map(voucherMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VoucherDTO> getVouchersByStatus(VoucherStatus status, Pageable pageable) {
        return voucherRepository.findByStatus(status, pageable).map(voucherMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VoucherDTO> getVouchersByCategory(VoucherCategory category, Pageable pageable) {
        return voucherRepository.findByCategory(category, pageable).map(voucherMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VoucherDTO> getActiveAutoApplyVouchers() {
        return voucherMapper.toDTOs(voucherRepository.findActiveAutoApplyVouchers(LocalDateTime.now()));
    }

    @Override
    @Transactional(readOnly = true)
    public List<VoucherDTO> getAllActiveVouchers() {
        return voucherMapper.toDTOs(voucherRepository.findAllActiveVouchers(LocalDateTime.now()));
    }

    @Override
    @Transactional
    public VoucherDTO activateVoucher(Long id) {
        Voucher voucher = voucherHelper.findByIdOrThrow(id);

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(voucher.getStartTime())) {
            voucher.setStatus(VoucherStatus.SCHEDULED);
        } else if (now.isAfter(voucher.getEndTime())) {
            throw new APIException("Cannot activate expired voucher");
        } else {
            voucher.setStatus(VoucherStatus.ACTIVE);
        }

        Voucher saved = voucherRepository.save(voucher);
        log.info("Activated voucher: {} -> {}", id, saved.getStatus());
        return voucherMapper.toDTO(saved);
    }

    @Override
    @Transactional
    public VoucherDTO cancelVoucher(Long id) {
        Voucher voucher = voucherHelper.findByIdOrThrow(id);
        voucher.setStatus(VoucherStatus.CANCELLED);
        Voucher saved = voucherRepository.save(voucher);
        log.info("Cancelled voucher: {}", id);
        return voucherMapper.toDTO(saved);
    }

    @Override
    @Transactional
    public void updateVoucherStatuses() {
        // Handled by VoucherTaskService
    }

    @Override
    @Transactional(readOnly = true)
    public boolean validateVoucherCode(String code, Long userId) {
        Optional<Voucher> voucherOpt = voucherRepository.findByCodeAndStatus(code, VoucherStatus.ACTIVE);
        if (voucherOpt.isEmpty())
            return false;

        Voucher voucher = voucherOpt.get();
        return voucher.isActiveNow() && voucherHelper.canUserUseVoucher(voucher, userId);
    }
}
