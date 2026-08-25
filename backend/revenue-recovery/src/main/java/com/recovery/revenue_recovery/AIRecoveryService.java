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

            if (amount >= 5000) {
                action = "Retry payment and send personalized payment reminder";
                recoveryProbability = 0.80;
                priority = "HIGH";

            } else {
                action = "Retry payment after 30 minutes";
                recoveryProbability = 0.70;
                priority = "MEDIUM";
            }

            explanation =
                    "Payment failure can be caused by temporary payment issues. "
                    + "A controlled retry gives the customer another opportunity "
                    + "to complete the transaction.";
        }

        // Abandoned checkout
        else if (reason.equalsIgnoreCase("Checkout Abandoned")) {

            action = "Send personalized checkout recovery reminder";
            recoveryProbability = 0.75;
            priority = "HIGH";

            explanation =
                    "The customer reached checkout but did not complete payment. "
                    + "This indicates strong purchase intent, making a personalized "
                    + "recovery message an appropriate intervention.";
        }

        // Subscription failure
        else if (reason.equalsIgnoreCase("Subscription Failed")) {

            action = "Send subscription payment recovery link";
            recoveryProbability = 0.85;
            priority = "HIGH";

            explanation =
                    "A failed subscription payment can cause recurring revenue loss. "
                    + "Recovering the payment quickly protects future revenue.";
        }

        // Unknown situation
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