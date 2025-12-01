package org.theater.bookingtheater.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.theater.bookingtheater.model.Performance;
import org.theater.bookingtheater.model.Reservation;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    boolean existsByPerformanceAndSeatId(Performance performance, String seatId);
    List<Reservation> findByPerformanceIdAndCustomerName(Long performanceId, String customerName);
    List<Reservation> findByCustomerName(String customerName);
}
