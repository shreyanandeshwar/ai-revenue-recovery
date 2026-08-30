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
    @PostMapping("/execute/{id}")
public Transaction executeRecovery(@PathVariable String id) {

    Transaction transaction = transactionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Transaction not found"));

    RecoveryRecommendation recommendation =
            aiRecoveryService.analyzeTransaction(transaction);

    transaction.setRecovered(true);
    transaction.setStatus("Recovered");

    transaction.setRecoveryAction(
            recommendation.getAction()
    );

    transaction.setRecoveryProbability(
            recommendation.getRecoveryProbability()
    );

    transaction.setRecoveryScore(
            recommendation.getRecoveryScore()
    );

    transaction.setRecoveredAmount(
            recommendation.getExpectedRecovery()
    );

    transaction.setRecoveredAt(
            java.time.LocalDateTime.now().toString()
    );

    return transactionRepository.save(transaction);
}
}