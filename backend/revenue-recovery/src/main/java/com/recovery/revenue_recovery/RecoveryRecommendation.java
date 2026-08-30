package com.recovery.revenue_recovery;

public class RecoveryRecommendation {

    private String action;
    private String reason;
    private String priority;
    private double expectedRecovery;
    private double recoveryProbability;
    private double recoveryScore;

    public RecoveryRecommendation() {
    }

    public RecoveryRecommendation(
            String action,
            String reason,
            String priority,
            double expectedRecovery,
            double recoveryProbability,
            double recoveryScore) {

        this.action = action;
        this.reason = reason;
        this.priority = priority;
        this.expectedRecovery = expectedRecovery;
        this.recoveryProbability = recoveryProbability;
        this.recoveryScore = recoveryScore;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public double getExpectedRecovery() {
        return expectedRecovery;
    }

    public void setExpectedRecovery(double expectedRecovery) {
        this.expectedRecovery = expectedRecovery;
    }

    public double getRecoveryProbability() {
        return recoveryProbability;
    }

    public void setRecoveryProbability(double recoveryProbability) {
        this.recoveryProbability = recoveryProbability;
    }
    public double getRecoveryScore() {
    return recoveryScore;
}

public void setRecoveryScore(double recoveryScore) {
    this.recoveryScore = recoveryScore;
}
}