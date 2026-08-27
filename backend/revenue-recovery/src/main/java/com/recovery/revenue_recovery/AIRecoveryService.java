package com.recovery.revenue_recovery;

import org.springframework.stereotype.Service;

@Service
public class AIRecoveryService {

    public RecoveryRecommendation analyzeTransaction(Transaction transaction) {

        String reason = transaction.getReason();
        double amount = transaction.getAmount();

        String action;
        String explanation;
        String priority;

        double recoveryProbability;

        // Payment failures
if (reason.equalsIgnoreCase("Payment Failed")) {

    if (amount >= 10000) {
        action = "Retry payment and send personalized payment reminder";
        recoveryProbability = 0.85;
        priority = "HIGH";

    } else if (amount >= 5000) {
        action = "Retry payment and send payment reminder";
        recoveryProbability = 0.80;
        priority = "HIGH";

    } else {
        action = "Retry payment after 30 minutes";
        recoveryProbability = 0.70;
        priority = "MEDIUM";
    }

    explanation =
            "The payment failure may be temporary. "
            + "A controlled retry can give the customer another opportunity "
            + "to complete the payment.";
}

// Abandoned checkout
else if (reason.equalsIgnoreCase("Checkout Abandoned")) {

    if (amount >= 10000) {
        action = "Send personalized checkout reminder with priority follow-up";
        recoveryProbability = 0.85;
        priority = "HIGH";

    } else if (amount >= 5000) {
        action = "Send personalized checkout recovery reminder";
        recoveryProbability = 0.80;
        priority = "HIGH";

    } else {
        action = "Send checkout recovery reminder";
        recoveryProbability = 0.65;
        priority = "MEDIUM";
    }

    explanation =
            "The customer reached the checkout stage, indicating purchase intent. "
            + "A timely personalized reminder may encourage the customer "
            + "to complete the purchase.";
}

// Subscription failure
else if (reason.equalsIgnoreCase("Subscription Failed")) {

    if (amount >= 5000) {
        action = "Send subscription recovery link and priority reminder";
        recoveryProbability = 0.90;
        priority = "HIGH";

    } else {
        action = "Send subscription payment recovery link";
        recoveryProbability = 0.85;
        priority = "HIGH";
    }

    explanation =
            "A failed subscription payment can result in both immediate "
            + "and recurring revenue loss. Recovering the payment quickly "
            + "helps protect future revenue.";
}

// Other situations
else {

    action = "Review transaction manually";
    recoveryProbability = 0.30;
    priority = "LOW";

    explanation =
            "The system does not have enough information to safely "
            + "automate a recovery action.";
}

        double expectedRecovery = amount * recoveryProbability;

        return new RecoveryRecommendation(
        action,
        explanation,
        priority,
        Math.round(expectedRecovery * 100.0) / 100.0,
        recoveryProbability
);
    }
}