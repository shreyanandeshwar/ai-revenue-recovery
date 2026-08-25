import { useEffect, useState } from "react"

function App() {
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [recommendation, setRecommendation] = useState(null)

useEffect(() => {
  fetch("http://localhost:8080/api/transactions")
    .then((response) => response.json())
    .then((data) => setTransactions(data))
    .catch((error) => console.error("Error fetching transactions:", error))
}, [])
  return (
    <div className="dashboard">
      <h1>AI Revenue Recovery</h1>
      <p className="subtitle">
        Recover lost revenue with intelligent AI decisions
      </p>

      <div className="cards">
        <div className="card">
          <p>Revenue at Risk</p>
          <h2>₹48,500</h2>
        </div>

        <div className="card">
          <p>Recovered Revenue</p>
          <h2>₹31,200</h2>
        </div>

        <div className="card">
          <p>Failed Payments</p>
          <h2>24</h2>
        </div>

        <div className="card">
          <p>Abandoned Checkouts</p>
          <h2>17</h2>
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