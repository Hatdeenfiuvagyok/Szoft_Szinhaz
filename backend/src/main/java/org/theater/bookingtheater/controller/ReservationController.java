package org.theater.bookingtheater.controller;


import org.theater.bookingtheater.model.Reservation;
import org.theater.bookingtheater.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public Reservation createReservation(@RequestBody Reservation reservation) {
        return reservationService.createReservation(reservation);
    }

    @GetMapping("/booked-seats")
    public List<String> getBookedSeats(@RequestParam Long performanceId) {
        return reservationService.getBookedSeats(performanceId);
    }

    @GetMapping("/user")
    public List<Reservation> getUserReservations(@RequestParam String customerName) {
        return reservationService.getReservationsForUser(customerName);
    }

    @DeleteMapping("/cancel")
    public void cancelReservation(
            @RequestParam Long performanceId,
            @RequestParam String customerName) {

        reservationService.cancelReservation(performanceId, customerName);
    }
}

