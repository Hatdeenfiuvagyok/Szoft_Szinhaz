package org.theater.bookingtheater.controller;

import org.theater.bookingtheater.model.Performance;
import org.theater.bookingtheater.repository.PerformanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/performances")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class PerformanceController {

    private final PerformanceRepository performanceRepository;

    @GetMapping
    public List<Performance> getAllPerformances() {
        return performanceRepository.findAll();
    }

    @PostMapping
    public Performance addPerformance(@RequestBody Performance performance) {
        return performanceRepository.save(performance);
    }
}
