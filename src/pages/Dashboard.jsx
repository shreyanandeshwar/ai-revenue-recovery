import { useEffect, useState } from "react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts"

function Dashboard() {
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    fetch("http://localhost:8080/api/transactions")
      .then((response) => response.json())
      .then((data) => setTransactions(data))
      .catch((error) =>
        console.error("Error fetching transactions:", error)
      )
  }, [])

  const revenueAtRisk = transactions
    .filter((transaction) => transaction.status !== "Recovered")
    .reduce((total, transaction) => total + transaction.amount, 0)

  const recoveredRevenue = transactions
  .filter((transaction) => transaction.status === "Recovered")
  .reduce(
    (total, transaction) =>
      total + (transaction.recoveredAmount || transaction.amount),
    0
  )

  const totalRevenue = revenueAtRisk + recoveredRevenue

  const recoveryRate =
    totalRevenue > 0
      ? Math.round((recoveredRevenue / totalRevenue) * 100)
      : 0

  const pendingRecovery = transactions.filter(
    (transaction) => transaction.status !== "Recovered"
  ).length

  const chartData = [
  {
    name: "At Risk",
    amount: revenueAtRisk,
  },
  {
    name: "Recovered",
    amount: recoveredRevenue,
  },
]

  return (
    <div className="dashboard">
      <h1>AI Revenue Recovery</h1>

      <p className="subtitle">
        Recover lost revenue with intelligent AI decisions
      </p>

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
        <h2>Monitoring Summary</h2>

        <p>
          {transactions.length} transactions are currently being monitored.
        </p>
      </div>
      <div className="revenue-section">
  <h2>Recent Activity</h2>

  {transactions.length === 0 ? (
    <p>No transaction activity yet.</p>
  ) : (
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
        {transactions.slice(0, 5).map((transaction) => (
          <tr key={transaction.id}>
            <td>{transaction.customer}</td>

            <td>
              ₹{transaction.amount.toLocaleString()}
            </td>

            <td>{transaction.reason}</td>

            <td>
              <span
                className={`status-badge ${
                  transaction.status === "Recovered"
                    ? "status-recovered"
                    : "status-pending"
                }`}
              >
                {transaction.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>
      <div className="chart-section">
  <div>
    <h2>Revenue Overview</h2>
    <p>At-risk versus recovered revenue</p>
  </div>

  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={chartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis tickFormatter={(value) =>
    `₹${value.toLocaleString()}`
  }/>
      <Tooltip formatter={(value) => [
    `₹${Number(value).toLocaleString()}`,
    "Revenue",
  ]}/>
      <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
  {chartData.map((entry, index) => (
    <Cell
      key={`cell-${index}`}
      fill={index === 0 ? "#dc2626" : "#16a34a"}
    />
  ))}
</Bar>
    </BarChart>
  </ResponsiveContainer>
</div>
    </div>
  )
}

export default Dashboard