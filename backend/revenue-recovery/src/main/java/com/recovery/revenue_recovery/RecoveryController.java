package com.recovery.revenue_recovery;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recovery")
@CrossOrigin(origins = "http://localhost:5173")
public class RecoveryController {

    private final AIRecoveryService aiRecoveryService;
    private final TransactionRepository transactionRepository;

    public RecoveryController(
            AIRecoveryService aiRecoveryService,
            TransactionRepository transactionRepository) {
        this.aiRecoveryService = aiRecoveryService;
        this.transactionRepository = transactionRepository;
    }

    @PostMapping("/analyze/{id}")
    public RecoveryRecommendation analyzeTransaction(@PathVariable String id) {

        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        return aiRecoveryService.analyzeTransaction(transaction);
    }
}