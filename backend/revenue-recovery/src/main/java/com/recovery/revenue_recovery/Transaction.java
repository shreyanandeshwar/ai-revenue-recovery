package com.recovery.revenue_recovery;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "transactions")
public class Transaction {

    @Id
    private String id;

    private String customer;
    private double amount;
    private String reason;
    private String status;
    private String createdAt;
    private boolean recovered;
    private String recoveryAction;
    private double recoveryProbability;
    private double recoveryScore;
    private double recoveredAmount;
    private String recoveredAt;

    public Transaction() {
    }

    public Transaction(String customer, double amount, String reason, String status, String createdAt) {
        this.customer = customer;
        this.amount = amount;
        this.reason = reason;
        this.status = status;
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public String getCustomer() {
        return customer;
    }

    public double getAmount() {
        return amount;
    }

    public String getReason() {
        return reason;
    }

    public String getStatus() {
        return status;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setCustomer(String customer) {
        this.customer = customer;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
    public boolean isRecovered() {
    return recovered;
}

public void setRecovered(boolean recovered) {
    this.recovered = recovered;
}
public String getRecoveryAction() {
    return recoveryAction;
}

public void setRecoveryAction(String recoveryAction) {
    this.recoveryAction = recoveryAction;
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

public double getRecoveredAmount() {
    return recoveredAmount;
}

public void setRecoveredAmount(double recoveredAmount) {
    this.recoveredAmount = recoveredAmount;
}

public String getRecoveredAt() {
    return recoveredAt;
}

public void setRecoveredAt(String recoveredAt) {
    this.recoveredAt = recoveredAt;
}
}

