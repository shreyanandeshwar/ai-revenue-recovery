package com.recovery.revenue_recovery;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;

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
    @PostMapping
public Transaction createTransaction(@RequestBody Transaction transaction) {
    transaction.setRecovered(false);
    return repository.save(transaction);
}

@PostMapping("/import")
public String importTransactions(@RequestParam("file") MultipartFile file) {

    int importedCount = 0;

    try (
        BufferedReader reader = new BufferedReader(
            new InputStreamReader(file.getInputStream())
        )
    ) {

        String line;
        boolean firstLine = true;

        while ((line = reader.readLine()) != null) {

            // Skip CSV header
            if (firstLine) {
                firstLine = false;
                continue;
            }

            if (line.trim().isEmpty()) {
                continue;
            }

            String[] data = line.split(",");

            if (data.length < 5) {
                continue;
            }

            Transaction transaction = new Transaction(
                data[0].trim(),
                Double.parseDouble(data[1].trim()),
                data[2].trim(),
                data[3].trim(),
                data[4].trim()
            );

            transaction.setRecovered(false);

            repository.save(transaction);

            importedCount++;
        }

    } catch (Exception e) {
        throw new RuntimeException("Failed to import CSV file", e);
    }

    return importedCount + " transactions imported successfully";
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
