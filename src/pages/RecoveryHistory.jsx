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
    (total, transaction) => total + transaction.amount,
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
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {recoveredTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.customer}</td>
                  <td>₹{transaction.amount}</td>
                  <td>{transaction.reason}</td>
                  <td>{transaction.createdAt}</td>
                  <td>{transaction.status}</td>
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