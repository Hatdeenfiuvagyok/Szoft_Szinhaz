package org.theater.bookingtheater.service;

import org.theater.bookingtheater.model.Performance;
import org.theater.bookingtheater.model.Reservation;
import org.theater.bookingtheater.repository.PerformanceRepository;
import org.theater.bookingtheater.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final PerformanceRepository performanceRepository;

    public Reservation createReservation(Reservation reservation) {

        // 1. Betöltjük a valódi Performance entitást az adatbázisból
        Performance perf = performanceRepository.findById(
                        reservation.getPerformance().getId())
                .orElseThrow(() -> new RuntimeException("Performance not found"));

        reservation.setPerformance(perf);

        // 2. Ellenőrizzük, hogy foglalt-e az adott szék
        if (reservationRepository.existsByPerformanceAndSeatId(
                perf, reservation.getSeatId())) {
            throw new IllegalArgumentException("Ez a hely már foglalt!");
        }

        // 3. Mentés ideje
        reservation.setBookingTime(LocalDateTime.now());

        // 4. Foglalás mentése
        return reservationRepository.save(reservation);
    }

    public List<String> getBookedSeats(Long performanceId) {
        return reservationRepository.findByPerformanceId(performanceId)
                .stream()
                .map(Reservation::getSeatId)
                .toList();
    }

    public void cancelReservation(Long performanceId, String customerName) {

        List<Reservation> reservations = reservationRepository
                .findByPerformanceIdAndCustomerName(performanceId, customerName);

        reservationRepository.deleteAll(reservations);
    }

    public List<Reservation> getReservationsForUser(String customerName) {
        return reservationRepository.findByCustomerName(customerName);
    }
}
