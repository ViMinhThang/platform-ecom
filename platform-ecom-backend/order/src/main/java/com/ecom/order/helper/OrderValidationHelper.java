package com.ecom.order.helper;

import com.ecom.common.exception.OrderGroupNotFoundException;
import com.ecom.common.exception.UnauthorizedException;
import com.ecom.order.entity.OrderGroup;
import com.ecom.order.entity.OrderGroupStatus;
import com.ecom.order.entity.SubOrder;
import com.ecom.order.entity.SubOrderStatus;
import com.ecom.order.repository.OrderGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OrderValidationHelper {

    private final OrderGroupRepository orderGroupRepository;

    public OrderGroup findOrderGroupById(Long groupId) {
        return orderGroupRepository.findByIdWithSubOrders(groupId)
                .orElseThrow(() -> new OrderGroupNotFoundException(groupId));
    }

    public SubOrder findSubOrderInGroup(OrderGroup group, Long subOrderId) {
        return group.getSubOrders().stream()
                .filter(so -> so.getId().equals(subOrderId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng phụ: " + subOrderId));
    }

    public void verifyUserOwnership(OrderGroup group, Long userId) {
        if (!group.getUserId().equals(userId)) {
            throw new UnauthorizedException("Bạn không có quyền truy cập đơn hàng này");
        }
    }

    public void validateCancellable(OrderGroup group) {
        boolean allCancellable = group.getSubOrders().stream()
                .allMatch(so -> so.getStatus() == SubOrderStatus.PENDING
                        || so.getStatus() == SubOrderStatus.PROCESSING);

        if (!allCancellable) {
            throw new IllegalStateException("Không thể hủy đơn hàng - sản phẩm đã được vận chuyển");
        }
    }

    public OrderGroupStatus parseOrderGroupStatus(String status) {
        try {
            return OrderGroupStatus.valueOf(status);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Trạng thái đơn hàng không hợp lệ: " + status);
        }
    }

    public SubOrderStatus parseSubOrderStatus(String status) {
        try {
            return SubOrderStatus.valueOf(status);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Trạng thái đơn hàng phụ không hợp lệ: " + status);
        }
    }
}
