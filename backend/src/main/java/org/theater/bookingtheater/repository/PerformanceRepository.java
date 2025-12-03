package org.theater.bookingtheater.repository;

import org.springframework.data.jpa.repository.Query;
import org.theater.bookingtheater.model.Performance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PerformanceRepository extends JpaRepository<Performance, Long> {
    @Query("SELECT p FROM Performance p LEFT JOIN FETCH p.reservations")
    List<Performance> findAllWithReservations();
}
