package com.recovery.revenue_recovery;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionRepository repository;

    public TransactionController(TransactionRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Transaction> getTransactions() {
        return repository.findAll();
    }
    @PostMapping("/seed")
public String seedTransactions() {

    repository.save(new Transaction(
            "Rahul Sharma",
            2499,
            "Payment Failed",
            "Pending",
            "2026-08-25"
    ));

    repository.save(new Transaction(
            "Ananya Patil",
            5999,
            "Checkout Abandoned",
            "Pending",
            "2026-08-25"
    ));

    repository.save(new Transaction(
            "Vikram Joshi",
            1299,
            "Subscription Failed",
            "Recovered",
            "2026-08-24"
    ));

    repository.save(new Transaction(
            "Priya Kulkarni",
            3499,
            "Payment Failed",
            "Pending",
            "2026-08-25"
    ));

    return "Sample transactions created";
}
}
