package com.borgs.catalog;

import jakarta.persistence.*;
import lombok.Data;

/** Product data structure (shared with Repolidon and Canoy). */
@Data
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String brand;     // compatible brand
    private String category;  // Helmets | Parts | Oils | Accessories
    private double price;     // PHP, per item
    private boolean available; // true = Available, false = Out of Stock

    @Column(length = 500)
    private String description;

    private String image;     // image URL, may be null
    private String emoji;     // fallback tile when image is null
}
