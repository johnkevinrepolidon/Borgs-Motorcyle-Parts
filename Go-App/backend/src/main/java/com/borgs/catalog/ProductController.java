package com.borgs.catalog;

import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    private final ProductRepository repo;

    public ProductController(ProductRepository repo) {
        this.repo = repo;
    }

    /** GET /api/products  -> all products */
    @GetMapping
    public List<Product> all() {
        return repo.findAll(Sort.by("id"));
    }

    /** GET /api/products/{id}  -> one product, or 404 */
    @GetMapping("/{id}")
    public ResponseEntity<Product> one(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
