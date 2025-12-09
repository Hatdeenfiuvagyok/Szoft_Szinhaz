package org.theater.bookingtheater.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.theater.bookingtheater.model.Performance;
import org.theater.bookingtheater.repository.PerformanceRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PerformanceController.class)
class PerformanceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PerformanceRepository performanceRepository;

    @Autowired
    private ObjectMapper objectMapper;

    // ==================================
    // GET /api/performances
    // ==================================
    @Test
    void testGetAllPerformances() throws Exception {
        Performance p = new Performance();
        p.setId(1L);
        p.setTitle("Macbeth");

        when(performanceRepository.findAllWithReservations())
                .thenReturn(List.of(p));

        mockMvc.perform(get("/api/performances"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].title").value("Macbeth"));
    }

    // ==================================
    // POST /api/performances
    // ==================================
    @Test
    void testAddPerformance() throws Exception {
        Performance p = new Performance();
        p.setId(1L);
        p.setTitle("Hamlet");
        p.setDateTime(LocalDateTime.now());

        when(performanceRepository.save(any(Performance.class)))
                .thenReturn(p);

        mockMvc.perform(post("/api/performances")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(p)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.title").value("Hamlet"));
    }

    // ==================================
    // DELETE /api/performances/{id}
    // ==================================
    @Test
    void testDeletePerformanceSuccess() throws Exception {
        when(performanceRepository.existsById(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/performances/1"))
                .andExpect(status().isNoContent());

        verify(performanceRepository, times(1)).deleteById(1L);
    }

    @Test
    void testDeletePerformanceNotFound() throws Exception {
        when(performanceRepository.existsById(1L)).thenReturn(false);

        mockMvc.perform(delete("/api/performances/1"))
                .andExpect(status().isNotFound());
    }

    // ==================================
    // PUT /api/performances/{id}
    // ==================================
    @Test
    void testUpdatePerformanceSuccess() throws Exception {
        Performance existing = new Performance();
        existing.setId(1L);
        existing.setTitle("Old Title");

        Performance updated = new Performance();
        updated.setTitle("New Title");
        updated.setTheater("Main Hall");
        updated.setBasePrice(5000);
        updated.setTotalSeats(120);
        updated.setDateTime(LocalDateTime.of(2025, 3, 15, 18, 0));

        when(performanceRepository.findById(1L))
                .thenReturn(Optional.of(existing));

        when(performanceRepository.save(any(Performance.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        mockMvc.perform(put("/api/performances/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("New Title"))
                .andExpect(jsonPath("$.theater").value("Main Hall"))
                .andExpect(jsonPath("$.basePrice").value(5000))
                .andExpect(jsonPath("$.totalSeats").value(120));
    }

    @Test
    void testUpdatePerformanceNotFound() throws Exception {
        when(performanceRepository.findById(2L))
                .thenReturn(Optional.empty());

        Performance updated = new Performance();
        updated.setTitle("Does not matter");

        mockMvc.perform(put("/api/performances/2")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isNotFound());
    }
}
