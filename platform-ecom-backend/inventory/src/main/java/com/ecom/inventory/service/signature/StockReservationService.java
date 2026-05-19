package com.ecom.inventory.service.signature;

import com.ecom.inventory.dto.ReservationRequest;
import com.ecom.inventory.dto.StockReservationDTO;

public interface StockReservationService {
    StockReservationDTO reserve(ReservationRequest request);

    void confirmReservation(Long reservationId);

    void cancelReservation(Long reservationId);

    void expireStaleReservations();
}
