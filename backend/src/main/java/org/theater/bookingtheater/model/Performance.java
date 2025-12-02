package org.theater.bookingtheater.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Performance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String theater;
    private LocalDateTime dateTime;
    private double basePrice;
    private int totalSeats;
    private Integer bookedCount;
    // 🔥 EZ A RÉSZ HIÁNYZOTT
    @OneToMany(mappedBy = "performance", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonIgnore
    private List<Reservation> reservations;
}
