import { useEffect, useState } from "react"

function Transactions() {
  const [transactions, setTransactions] = useState([])
const [showForm, setShowForm] = useState(false)

const [search, setSearch] = useState("")
const [statusFilter, setStatusFilter] = useState("All")
const [reasonFilter, setReasonFilter] = useState("All")
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
      .catch((error) =>
        console.error("Error fetching transactions:", error)
      )
  }, [])

  const filteredTransactions = transactions.filter((transaction) => {
  const matchesSearch = transaction.customer
    .toLowerCase()
    .includes(search.toLowerCase())

  const matchesStatus =
    statusFilter === "All" ||
    transaction.status === statusFilter

  const matchesReason =
    reasonFilter === "All" ||
    transaction.reason === reasonFilter

  return matchesSearch && matchesStatus && matchesReason
})

  const addTransaction = async () => {
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
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1>Transactions</h1>
          <p className="subtitle">
            Monitor and manage revenue-loss transactions
          </p>
        </div>

        <button onClick={() => setShowForm(!showForm)}>
          + Add Transaction
        </button>
      </div>

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

          <button onClick={addTransaction}>
            Add Transaction
          </button>
        </div>
      )}

      <div className="revenue-section">
  <div className="transaction-toolbar">
    <h2>All Transactions</h2>

    <div className="filters">
      <input
        type="text"
        placeholder="Search customer..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option>All</option>
        <option>Pending</option>
        <option>Recovered</option>
      </select>

      <select
        value={reasonFilter}
        onChange={(e) => setReasonFilter(e.target.value)}
      >
        <option>All</option>
        <option>Payment Failed</option>
        <option>Checkout Abandoned</option>
        <option>Subscription Failed</option>
        <option>Card Declined</option>
        <option>Payment Timeout</option>
        <option>Insufficient Funds</option>
      </select>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Customer</th>
        <th>Amount</th>
        <th>Reason</th>
        <th>Status</th>
        <th>Date</th>
      </tr>
    </thead>

    <tbody>
      {filteredTransactions.map((transaction) => (
        <tr key={transaction.id}>
          <td>{transaction.customer}</td>

          <td>₹{transaction.amount}</td>

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

          <td>{transaction.createdAt}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
</div>
  )
}

export default Transactions