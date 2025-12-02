package org.theater.bookingtheater.controller;

import org.theater.bookingtheater.model.Performance;
import org.theater.bookingtheater.repository.PerformanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/performances")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class PerformanceController {

    private final PerformanceRepository performanceRepository;

    // =====================
    //        GET ALL
    // =====================
    @GetMapping
    public List<Performance> getAllPerformances() {

        List<Performance> list = performanceRepository.findAll();
        LocalDateTime now = LocalDateTime.now();

        for (Performance p : list) {
            // ha az előadás már elmúlt
            if (p.getDateTime().isBefore(now)) {
                // Csak akkor számoljuk ki, ha még nem számoltuk ki korábban
                if (p.getBookedCount() == null) {
                    int bookedSeats = p.getReservations().size();
                    p.setBookedCount(bookedSeats);

                    performanceRepository.save(p);
                }
            }
        }

        return list;
    }

    // =====================
    //         ADD
    // =====================
    @PostMapping
    public Performance addPerformance(@RequestBody Performance performance) {
        return performanceRepository.save(performance);
    }

    // ============================
    //          DELETE (ÚJ)
    // ============================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePerformance(@PathVariable Long id) {
        if (!performanceRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        performanceRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // =============================
    //            UPDATE (ÚJ)
    // =============================
    @PutMapping("/{id}")
    public ResponseEntity<Performance> updatePerformance(
            @PathVariable Long id,
            @RequestBody Performance updated
    ) {
        return performanceRepository.findById(id)
                .map(existing -> {

                    existing.setTitle(updated.getTitle());
                    existing.setTheater(updated.getTheater());
                    existing.setBasePrice(updated.getBasePrice());
                    existing.setTotalSeats(updated.getTotalSeats());
                    existing.setDateTime(updated.getDateTime()); // LocalDateTime

                    Performance saved = performanceRepository.save(existing);
                    return ResponseEntity.ok(saved);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
