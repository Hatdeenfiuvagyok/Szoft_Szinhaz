package org.theater.bookingtheater.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;

    // 🔥 ÚJ – egyedi szék azonosító, pl: "C-3-5"
    private String seatId;

    @ManyToOne
    @JoinColumn(name = "performance_id")
    private Performance performance;

    private LocalDateTime bookingTime;
}
