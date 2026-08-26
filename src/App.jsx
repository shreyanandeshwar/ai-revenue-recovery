import { useEffect, useState } from "react"

function App() {
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [recommendation, setRecommendation] = useState(null)
  const [showForm, setShowForm] = useState(false)

const [newTransaction, setNewTransaction] = useState({
  customer: "",
  amount: "",
  reason: "Payment Failed",
  status: "Pending",
  createdAt: new Date().toISOString().split("T")[0],
})

useEffect(() => {
  fetch("http://localhost:8080/api/transactions")
    .then((response) => response.json())
    .then((data) => setTransactions(data))
    .catch((error) => console.error("Error fetching transactions:", error))
}, [])
const revenueAtRisk = transactions
  .filter((transaction) => transaction.status !== "Recovered")
  .reduce((total, transaction) => total + transaction.amount, 0)

const recoveredRevenue = transactions
  .filter((transaction) => transaction.status === "Recovered")
  .reduce((total, transaction) => total + transaction.amount, 0)

const totalRevenue = revenueAtRisk + recoveredRevenue

const recoveryRate =
  totalRevenue > 0
    ? Math.round((recoveredRevenue / totalRevenue) * 100)
    : 0

const pendingRecovery = transactions.filter(
  (transaction) => transaction.status !== "Recovered"
).length
  return (
    <div className="dashboard">
      <h1>AI Revenue Recovery</h1>
      <p className="subtitle">
        Recover lost revenue with intelligent AI decisions
      </p>
      <button onClick={() => setShowForm(!showForm)}>
  + Add Transaction
</button>
{showForm && (
  <div className="transaction-form">
    <h2>Add Transaction</h2>

    <input
      type="text"
      placeholder="Customer name"
      value={newTransaction.customer}
      onChange={(e) =>
        setNewTransaction({
          ...newTransaction,
          customer: e.target.value,
        })
      }
    />

    <input
      type="number"
      placeholder="Amount"
      value={newTransaction.amount}
      onChange={(e) =>
        setNewTransaction({
          ...newTransaction,
          amount: e.target.value,
        })
      }
    />

    <select
      value={newTransaction.reason}
      onChange={(e) =>
        setNewTransaction({
          ...newTransaction,
          reason: e.target.value,
        })
      }
    >
      <option>Payment Failed</option>
      <option>Checkout Abandoned</option>
      <option>Subscription Failed</option>
      <option>Card Declined</option>
      <option>Payment Timeout</option>
      <option>Insufficient Funds</option>
    </select>

    <button
      onClick={async () => {
        try {
          const response = await fetch(
            "http://localhost:8080/api/transactions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...newTransaction,
                amount: Number(newTransaction.amount),
              }),
            }
          )

          const createdTransaction = await response.json()

          setTransactions((currentTransactions) => [
            createdTransaction,
            ...currentTransactions,
          ])

          setNewTransaction({
            customer: "",
            amount: "",
            reason: "Payment Failed",
            status: "Pending",
            createdAt: new Date().toISOString().split("T")[0],
          })

          setShowForm(false)
        } catch (error) {
          console.error("Error creating transaction:", error)
        }
      }}
    >
      Add Transaction
    </button>
  </div>
)}

      <div className="cards">
        <div className="card">
  <p>Revenue at Risk</p>
  <h2>₹{revenueAtRisk.toLocaleString()}</h2>
</div>

<div className="card">
  <p>Recovered Revenue</p>
  <h2>₹{recoveredRevenue.toLocaleString()}</h2>
</div>

<div className="card">
  <p>Recovery Rate</p>
  <h2>{recoveryRate}%</h2>
</div>

<div className="card">
  <p>Pending Recovery</p>
  <h2>{pendingRecovery}</h2>
</div>
      </div>
      <div className="revenue-section">
  <h2>Recent Revenue Loss</h2>

  <table>
    <thead>
      <tr>
        <th>Customer</th>
        <th>Amount</th>
        <th>Reason</th>
        <th>Status</th>
      </tr>
    </thead>

    <tbody>
      {transactions.map((transaction) => (
  <tr
    key={transaction.id}
    onClick={() => {
  setSelectedTransaction({
    id: transaction.id,
    customer: transaction.customer,
    amount: `₹${transaction.amount}`,
    reason: transaction.reason,
  })

  fetch(`http://localhost:8080/api/recovery/analyze/${transaction.id}`, {
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => setRecommendation(data))
    .catch((error) => console.error("Error analyzing transaction:", error))
}}
  >
    <td>{transaction.customer}</td>
    <td>₹{transaction.amount}</td>
    <td>{transaction.reason}</td>
    <td>{transaction.status}</td>
  </tr>
))}
    </tbody>
  </table>
</div>
{selectedTransaction && (
  <div className="ai-panel">
    <h2>🤖 AI Recovery Recommendation</h2>

    <p>
      <strong>Customer:</strong> {selectedTransaction.customer}
    </p>

    <p>
      <strong>Amount at Risk:</strong> {selectedTransaction.amount}
    </p>

    <p>
      <strong>Issue:</strong> {selectedTransaction.reason}
    </p>

    <hr />
    {recommendation && (
  <>
    <h3>Recommended Action</h3>

    <p>{recommendation.action}</p>

    <p>
      <strong>Why:</strong> {recommendation.reason}
    </p>

    <p>
      <strong>Priority:</strong> {recommendation.priority}
    </p>

    <p>
      <strong>Recovery Probability:</strong>{" "}
      {Math.round(recommendation.recoveryProbability * 100)}%
    </p>

    <p>
      <strong>Potential Recovery:</strong> ₹
      {recommendation.expectedRecovery}
    </p>
    <button
  onClick={async () => {
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

      alert("Recovery executed successfully!")
    } catch (error) {
      console.error("Recovery execution failed:", error)
    }
  }}
>
  Execute Recovery
</button>
  </>
)}

    <button
  onClick={() => {
    setSelectedTransaction(null)
    setRecommendation(null)
  }}
>
  Close
</button>
  </div>
)}
    </div>
  )
}

export default App