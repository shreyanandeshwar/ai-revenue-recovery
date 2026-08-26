import { useEffect, useState } from "react"

function AIRecovery() {
  const [transactions, setTransactions] = useState([])
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [recommendation, setRecommendation] = useState(null)
  const [loading, setLoading] = useState(false)

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

    try {
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

      setSelectedTransaction(null)
      setRecommendation(null)
    } catch (error) {
      console.error("Recovery execution failed:", error)
    }
  }

  const pendingTransactions = transactions.filter(
    (transaction) => transaction.status !== "Recovered"
  )

  return (
    <div className="dashboard">
      <h1>AI Recovery</h1>

      <p className="subtitle">
        Analyze at-risk transactions and take intelligent recovery actions
      </p>

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
                    ₹{transaction.amount} · {transaction.reason}
                  </p>
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
                    <strong>Potential Recovery:</strong> ₹
                    {recommendation.expectedRecovery}
                  </p>

                  <button onClick={executeRecovery}>
                    Execute Recovery
                  </button>
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