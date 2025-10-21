package org.theater.bookingtheater.repository;


import org.theater.bookingtheater.model.Performance;
import org.theater.bookingtheater.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    boolean existsByPerformanceAndSeatNumber(Performance performance, int seatNumber);
}

