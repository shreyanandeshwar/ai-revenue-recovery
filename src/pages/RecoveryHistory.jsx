import { useEffect, useState } from "react"

function RecoveryHistory() {
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    fetch("http://localhost:8080/api/transactions")
      .then((response) => response.json())
      .then((data) => setTransactions(data))
      .catch((error) =>
        console.error("Error fetching transactions:", error)
      )
  }, [])

  const recoveredTransactions = transactions.filter(
    (transaction) => transaction.status === "Recovered"
  )

  const totalRecovered = recoveredTransactions.reduce(
  (total, transaction) =>
    total + (transaction.recoveredAmount || transaction.amount),
  0
)

  return (
    <div className="dashboard">
      <h1>Recovery History</h1>

      <p className="subtitle">
        Track successfully recovered revenue and past recovery actions
      </p>

      <div className="cards">
        <div className="card">
          <p>Recovered Revenue</p>
          <h2>₹{totalRecovered.toLocaleString()}</h2>
        </div>

        <div className="card">
          <p>Successful Recoveries</p>
          <h2>{recoveredTransactions.length}</h2>
        </div>
        <div className="card">
  <p>Average Recovery Score</p>
  <h2>
    {recoveredTransactions.length > 0
      ? Math.round(
          recoveredTransactions.reduce(
            (total, transaction) =>
              total + (transaction.recoveryScore || 0),
            0
          ) / recoveredTransactions.length
        )
      : 0}
    /100
  </h2>
</div>
      </div>

      <div className="revenue-section">
        <h2>Successful Recoveries</h2>

        {recoveredTransactions.length === 0 ? (
          <p>No recovered transactions yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Amount</th>
                <th>Reason</th>
                <th>Recovery Score</th>
                <th>Recovered Amount</th>
                <th>AI Action</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {recoveredTransactions.map((transaction) => (
                <tr key={transaction.id}>
  <td>{transaction.customer}</td>

  <td>
    ₹{transaction.amount.toLocaleString()}
  </td>

  <td>{transaction.reason}</td>

  <td>
    {transaction.recoveryScore
      ? `${Math.round(transaction.recoveryScore)}/100`
      : "N/A"}
  </td>

  <td>
    ₹{transaction.recoveredAmount
      ? transaction.recoveredAmount.toLocaleString()
      : "0"}
  </td>
  
  <td>
  {transaction.recoveryAction || "Recovery action recorded"}
</td>

  <td>
    {transaction.recoveredAt || transaction.createdAt}
  </td>

  <td>
    <span className="status-badge status-recovered">
      {transaction.status}
    </span>
  </td>
</tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default RecoveryHistory