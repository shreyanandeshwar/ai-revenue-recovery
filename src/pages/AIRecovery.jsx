import { useEffect, useState } from "react"

function AIRecovery() {
  const [transactions, setTransactions] = useState([])
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [recommendation, setRecommendation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [executing, setExecuting] = useState(false)
const [recoveryResult, setRecoveryResult] = useState(null)

  useEffect(() => {
    fetch("http://localhost:8080/api/transactions")
      .then((response) => response.json())
      .then((data) => setTransactions(data))
      .catch((error) =>
        console.error("Error fetching transactions:", error)
      )
  }, [])

  const analyzeTransaction = async (transaction) => {
    setSelectedTransaction(transaction)
    setRecommendation(null)
    setLoading(true)

    try {
      const response = await fetch(
        `http://localhost:8080/api/recovery/analyze/${transaction.id}`,
        {
          method: "POST",
        }
      )

      const data = await response.json()
      setRecommendation(data)
    } catch (error) {
      console.error("Error analyzing transaction:", error)
    } finally {
      setLoading(false)
    }
  }

  const executeRecovery = async () => {
  if (!selectedTransaction) return

  setExecuting(true)
  setRecoveryResult(null)

  try {
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const response = await fetch(
      `http://localhost:8080/api/recovery/execute/${selectedTransaction.id}`,
      {
        method: "POST",
      }
    )

    const updatedTransaction = await response.json()

    setTransactions((currentTransactions) =>
      currentTransactions.map((transaction) =>
        transaction.id === updatedTransaction.id
          ? updatedTransaction
          : transaction
      )
    )

    setRecoveryResult({
      success: true,
      amount: updatedTransaction.amount,
      customer: updatedTransaction.customer,
    })

  } catch (error) {
    console.error("Recovery execution failed:", error)

    setRecoveryResult({
      success: false,
    })
  } finally {
    setExecuting(false)
  }
}

  const pendingTransactions = transactions
  .filter((transaction) => transaction.status !== "Recovered")
  .sort((a, b) => b.amount - a.amount)

  const totalAtRisk = pendingTransactions.reduce(
  (total, transaction) => total + transaction.amount,
  0
)

const potentialRecovery = pendingTransactions.reduce(
  (total, transaction) => {
    let probability = 0.3

    if (transaction.reason === "Payment Failed") {
      if (transaction.amount >= 10000) {
        probability = 0.85
      } else if (transaction.amount >= 5000) {
        probability = 0.80
      } else {
        probability = 0.70
      }
    } else if (transaction.reason === "Checkout Abandoned") {
      if (transaction.amount >= 10000) {
        probability = 0.85
      } else if (transaction.amount >= 5000) {
        probability = 0.80
      } else {
        probability = 0.65
      }
    } else if (transaction.reason === "Subscription Failed") {
      probability = transaction.amount >= 5000 ? 0.90 : 0.85
    }

    return total + transaction.amount * probability
  },
  0
)

  return (
    <div className="dashboard">
      <h1>AI Recovery</h1>

      <p className="subtitle">
        Analyze at-risk transactions and take intelligent recovery actions
      </p>

      <div className="cards">
  <div className="card">
    <p>Transactions at Risk</p>
    <h2>{pendingTransactions.length}</h2>
  </div>

  <div className="card">
    <p>Total Revenue at Risk</p>
    <h2>₹{totalAtRisk.toLocaleString()}</h2>
  </div>

  <div className="card">
    <p>Potential Recovery</p>
    <h2>₹{Math.round(potentialRecovery).toLocaleString()}</h2>
  </div>
</div>

      <div className="recovery-layout">
        <div className="recovery-list">
          <h2>Recovery Queue</h2>

          {pendingTransactions.length === 0 ? (
            <p>No transactions currently require recovery.</p>
          ) : (
            pendingTransactions.map((transaction) => (
              <div
                className="recovery-item"
                key={transaction.id}
              >
                <div>
                  <strong>{transaction.customer}</strong>

                  <p>
                    ₹{transaction.amount.toLocaleString()} · {transaction.reason}
                  </p>
                  <span className="recovery-value">
  Recovery opportunity: ₹
  {(transaction.amount * 0.7).toLocaleString()}
</span>
                </div>

                <button
                  onClick={() => analyzeTransaction(transaction)}
                >
                  Analyze
                </button>
              </div>
            ))
          )}
        </div>

        <div className="ai-panel">
          {!selectedTransaction && (
            <div>
              <h2>🤖 AI Recovery Agent</h2>

              <p>
                Select a transaction from the recovery queue
                to analyze its recovery potential.
              </p>
            </div>
          )}

          {selectedTransaction && (
            <>
              <h2>🤖 AI Recovery Recommendation</h2>

              <p>
                <strong>Customer:</strong>{" "}
                {selectedTransaction.customer}
              </p>

              <p>
                <strong>Amount at Risk:</strong> ₹
                {selectedTransaction.amount}
              </p>

              <p>
                <strong>Issue:</strong>{" "}
                {selectedTransaction.reason}
              </p>

              <hr />

              {loading && <p>Analyzing transaction...</p>}

              {recommendation && (
                <>
                  <h3>Recommended Action</h3>

                  <p>{recommendation.action}</p>

                  <p>
                    <strong>Why:</strong>{" "}
                    {recommendation.reason}
                  </p>

                  <p>
                    <strong>Priority:</strong>{" "}

<span
  className={`priority-badge priority-${recommendation.priority.toLowerCase()}`}
>
  {recommendation.priority}
</span>
                  </p>

                  <p>
                    <strong>Recovery Probability:</strong>{" "}
                    {Math.round(
                      recommendation.recoveryProbability * 100
                    )}
                    %
                  </p>

                  <p>
  <strong>Recovery Score:</strong>{" "}
  <span className="recovery-score">
    {Math.round(recommendation.recoveryScore)}/100
  </span>
</p>

                  <p>
                    <strong>Potential Recovery:</strong> ₹
                    {recommendation.expectedRecovery}
                  </p>

                  {!recoveryResult?.success && (
  <button
    onClick={executeRecovery}
    disabled={executing}
  >
    {executing ? "Processing Recovery..." : "Execute Recovery"}
  </button>
)}
{executing && (
  <div className="recovery-processing">
    <strong>AI Recovery Agent is processing...</strong>
    <p>Attempting the recommended recovery action.</p>
  </div>
)}

{recoveryResult && recoveryResult.success && (
  <div className="recovery-success">
    <h3>✓ Recovery Successful</h3>

    <p>
      ₹{recoveryResult.amount.toLocaleString()} recovered
      for {recoveryResult.customer}.
    </p>
  </div>
)}

{recoveryResult && !recoveryResult.success && (
  <div className="recovery-failure">
    <h3>Recovery Failed</h3>

    <p>
      The recovery action could not be completed.
    </p>
  </div>
)}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AIRecovery