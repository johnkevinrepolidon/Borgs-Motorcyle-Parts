package com.borgs.catalog;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/** Loads sample products on startup when the table is empty. */
@Component
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository repo;

    public DataSeeder(ProductRepository repo) {
        this.repo = repo;
    }

    @Override
    public void run(String... args) {
        if (repo.count() > 0) return;
        repo.saveAll(List.of(
            p("Full Face Helmet", "Universal", "Helmets", 3500, true, "🪖", "DOT-style full face helmet with a shock-absorbing liner, anti-fog visor and quick-release strap."),
            p("Drive Chain Set", "Honda", "Parts", 1800, true, "⛓️", "Heavy-duty chain and sprocket set built for daily riding and long-distance trips."),
            p("Brake Disc", "Yamaha", "Parts", 2200, true, "💿", "Precision-cut stainless brake disc for strong, consistent stopping power."),
            p("Sport Tire (Rear)", "Kawasaki", "Parts", 3000, true, "🛞", "Sport compound rear tire with deep grip for dry and wet roads."),
            p("Engine Oil 10W-40 (1L)", "Honda", "Oils", 650, true, "🛢️", "Semi-synthetic motorcycle engine oil that protects against heat and wear."),
            p("Brake Pad Set", "Kymco", "Parts", 850, true, "🛑", "Low-dust brake pads with reliable bite and long service life."),
            p("Air Filter", "Suzuki", "Parts", 450, true, "🌀", "High-flow air filter that keeps your engine breathing clean."),
            p("Iridium Spark Plug", "Yamaha", "Parts", 380, true, "⚡", "Iridium tip spark plug for easier starts and smoother acceleration."),
            p("Riding Gloves", "Universal", "Accessories", 1200, false, "🧤", "Padded knuckle riding gloves with touchscreen fingertips."),
            p("Handlebar Grips", "Universal", "Accessories", 520, true, "✊", "Anti-slip rubber grips for a comfortable, secure hold."),
            p("LED Headlight Bulb", "Rusi", "Accessories", 980, true, "💡", "Bright white LED headlight bulb for safer night rides."),
            p("Side Mirror Set", "SYM", "Accessories", 750, true, "🪞", "Pair of adjustable, vibration-resistant side mirrors.")
        ));
    }

    private Product p(String name, String brand, String category, double price,
                      boolean available, String emoji, String description) {
        Product x = new Product();
        x.setName(name); x.setBrand(brand); x.setCategory(category); x.setPrice(price);
        x.setAvailable(available); x.setEmoji(emoji); x.setDescription(description);
        return x;
    }
}
