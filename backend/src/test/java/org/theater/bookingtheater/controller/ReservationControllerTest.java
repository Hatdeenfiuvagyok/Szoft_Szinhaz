package org.theater.bookingtheater.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.theater.bookingtheater.model.Reservation;
import org.theater.bookingtheater.model.Performance;
import org.theater.bookingtheater.service.ReservationService;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ReservationController.class)
class ReservationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ReservationService reservationService;

    @Autowired
    private ObjectMapper objectMapper;

    // -----------------------------------------------------
    // TEST: POST /api/reservations - createReservation
    // -----------------------------------------------------
    @Test
    void testCreateReservation() throws Exception {
        Reservation reservation = new Reservation();
        reservation.setId(1L);
        reservation.setSeatId("A1");
        reservation.setCustomerName("John");
        reservation.setPerformance(new Performance());

        when(reservationService.createReservation(any(Reservation.class)))
                .thenReturn(reservation);

        mockMvc.perform(post("/api/reservations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reservation)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.seatId").value("A1"))
                .andExpect(jsonPath("$.customerName").value("John"));
    }

    // -----------------------------------------------------
    // TEST: GET /api/reservations/booked-seats
    // -----------------------------------------------------
    @Test
    void testGetBookedSeats() throws Exception {
        when(reservationService.getBookedSeats(10L))
                .thenReturn(List.of("A1", "A2"));

        mockMvc.perform(get("/api/reservations/booked-seats")
                        .param("performanceId", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").value("A1"))
                .andExpect(jsonPath("$[1]").value("A2"));
    }

    // -----------------------------------------------------
    // TEST: GET /api/reservations/user
    // -----------------------------------------------------
    @Test
    void testGetUserReservations() throws Exception {
        Reservation r1 = new Reservation();
        r1.setSeatId("A1");
        Reservation r2 = new Reservation();
        r2.setSeatId("B4");

        when(reservationService.getReservationsForUser("Anna"))
                .thenReturn(List.of(r1, r2));

        mockMvc.perform(get("/api/reservations/user")
                        .param("customerName", "Anna"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].seatId").value("A1"))
                .andExpect(jsonPath("$[1].seatId").value("B4"));
    }

    // -----------------------------------------------------
    // TEST: DELETE /api/reservations/cancel
    // -----------------------------------------------------
    @Test
    void testCancelReservation() throws Exception {
        doNothing().when(reservationService)
                .cancelReservation(10L, "John");

        mockMvc.perform(delete("/api/reservations/cancel")
                        .param("performanceId", "10")
                        .param("customerName", "John"))
                .andExpect(status().isOk());
    }
}
