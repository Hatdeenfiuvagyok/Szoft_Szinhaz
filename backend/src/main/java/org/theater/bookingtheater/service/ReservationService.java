package org.theater.bookingtheater.service;

import org.theater.bookingtheater.model.Reservation;
import org.theater.bookingtheater.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;

    public Reservation createReservation(Reservation reservation) {
        if (reservationRepository.existsByPerformanceAndSeatNumber(
                reservation.getPerformance(), reservation.getSeatNumber())) {
            throw new IllegalArgumentException("A hely már foglalt!");
        }

        reservation.setBookingTime(LocalDateTime.now());
        return reservationRepository.save(reservation);
    }
}
