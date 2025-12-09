package org.theater.bookingtheater.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.theater.bookingtheater.model.Performance;
import org.theater.bookingtheater.model.Reservation;
import org.theater.bookingtheater.repository.PerformanceRepository;
import org.theater.bookingtheater.repository.ReservationRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class ReservationServiceTest {

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private PerformanceRepository performanceRepository;

    @InjectMocks
    private ReservationService reservationService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    // --------------------------------------
    // CREATE RESERVATION - SUCCESS
    // --------------------------------------
    @Test
    void testCreateReservationSuccess() {
        // Given
        Performance perf = new Performance();
        perf.setId(10L);

        Reservation reservation = new Reservation();
        reservation.setSeatId("A1");
        reservation.setPerformance(perf);
        reservation.setCustomerName("John Doe");

        when(performanceRepository.findById(10L))
                .thenReturn(Optional.of(perf));

        when(reservationRepository.existsByPerformanceAndSeatId(perf, "A1"))
                .thenReturn(false);

        when(reservationRepository.save(any(Reservation.class)))
                .thenAnswer(invocation -> {
                    Reservation saved = invocation.getArgument(0);
                    saved.setId(1L);
                    return saved;
                });

        // When
        Reservation savedReservation = reservationService.createReservation(reservation);

        // Then
        assertNotNull(savedReservation);
        assertEquals(1L, savedReservation.getId());
        assertEquals("A1", savedReservation.getSeatId());
        assertEquals("John Doe", savedReservation.getCustomerName());
        assertNotNull(savedReservation.getBookingTime());
    }

    // --------------------------------------
    // CREATE RESERVATION - PERFORMANCE NOT FOUND
    // --------------------------------------
    @Test
    void testCreateReservationPerformanceNotFound() {
        Reservation r = new Reservation();
        Performance perf = new Performance();
        perf.setId(99L);
        r.setPerformance(perf);

        when(performanceRepository.findById(99L))
                .thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> reservationService.createReservation(r));
    }

    // --------------------------------------
    // CREATE RESERVATION - SEAT ALREADY BOOKED
    // --------------------------------------
    @Test
    void testCreateReservationSeatAlreadyBooked() {
        Performance perf = new Performance();
        perf.setId(20L);

        Reservation reservation = new Reservation();
        reservation.setSeatId("B5");
        reservation.setPerformance(perf);

        when(performanceRepository.findById(20L))
                .thenReturn(Optional.of(perf));

        when(reservationRepository.existsByPerformanceAndSeatId(perf, "B5"))
                .thenReturn(true);

        assertThrows(IllegalArgumentException.class,
                () -> reservationService.createReservation(reservation));
    }

    // --------------------------------------
    // GET BOOKED SEATS
    // --------------------------------------
    @Test
    void testGetBookedSeats() {
        Reservation r1 = new Reservation();
        r1.setSeatId("A1");

        Reservation r2 = new Reservation();
        r2.setSeatId("A2");

        when(reservationRepository.findByPerformanceId(10L))
                .thenReturn(List.of(r1, r2));

        List<String> seats = reservationService.getBookedSeats(10L);

        assertEquals(2, seats.size());
        assertTrue(seats.contains("A1"));
        assertTrue(seats.contains("A2"));
    }

    // --------------------------------------
    // CANCEL RESERVATION
    // --------------------------------------
    @Test
    void testCancelReservation() {
        Reservation r1 = new Reservation();
        Reservation r2 = new Reservation();

        when(reservationRepository.findByPerformanceIdAndCustomerName(10L, "John"))
                .thenReturn(List.of(r1, r2));

        reservationService.cancelReservation(10L, "John");

        verify(reservationRepository, times(1))
                .deleteAll(List.of(r1, r2));
    }

    // --------------------------------------
    // GET RESERVATIONS FOR USER
    // --------------------------------------
    @Test
    void testGetReservationsForUser() {
        Reservation r1 = new Reservation();
        Reservation r2 = new Reservation();

        when(reservationRepository.findByCustomerName("Anna"))
                .thenReturn(List.of(r1, r2));

        List<Reservation> result = reservationService.getReservationsForUser("Anna");

        assertEquals(2, result.size());
    }
}
