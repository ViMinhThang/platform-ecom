export const ORDER_STATUS_LABELS: Record<string, string> = {
    PAID: 'Đã thanh toán',
    PENDING: 'Chờ xử lý',
    PROCESSING: 'Đang xử lý',
    READY_TO_PICK: 'Sẵn sàng lấy hàng',
    PICKING: 'Đang lấy hàng',
    PICKED: 'Đã lấy hàng',
    SHIPPED: 'Đã gửi hàng',
    STORING: 'Đang lưu kho',
    TRANSPORTING: 'Đang vận chuyển',
    SORTING: 'Đang phân loại',
    DELIVERING: 'Đang giao hàng',
    DELIVERED: 'Đã giao',
    DELIVERY_FAIL: 'Giao hàng thất bại',
    WAITING_TO_RETURN: 'Chờ hoàn trả',
    RETURNING: 'Đang hoàn trả',
    RETURNED: 'Đã hoàn trả',
    PARTIALLY_SHIPPED: 'Giao một phần',
    COMPLETED: 'Hoàn tất',
    CANCELLED: 'Đã hủy',
    REFUND_PENDING: 'Chờ hoàn tiền',
    REFUNDED: 'Đã hoàn tiền',
    PARTIALLY_REFUNDED: 'Hoàn tiền một phần',
    FULLY_REFUNDED: 'Hoàn tiền toàn bộ',
    EXCEPTION: 'Có sự cố',
    LOST: 'Thất lạc',
    DAMAGE: 'Hư hỏng',
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
    PENDING: 'Chờ xử lý',
    COMPLETED: 'Hoàn tất',
    SUCCEEDED: 'Thành công',
    FAILED: 'Thất bại',
    CANCELLED: 'Đã hủy',
    PARTIALLY_REFUNDED: 'Hoàn tiền một phần',
    FULLY_REFUNDED: 'Hoàn tiền toàn bộ',
};

export function getOrderStatusLabel(status: string): string {
    return ORDER_STATUS_LABELS[status] ?? status;
}

export function getPaymentStatusLabel(status: string): string {
    return PAYMENT_STATUS_LABELS[status] ?? status;
}
