import { NavLink } from "react-router-dom"

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>AI Revenue</h2>
        <span>Recovery</span>
      </div>

      <nav>
        <NavLink to="/" end>
          Dashboard
        </NavLink>

        <NavLink to="/transactions">
          Transactions
        </NavLink>

        <NavLink to="/ai-recovery">
          AI Recovery
        </NavLink>

        <NavLink to="/history">
          Recovery History
        </NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar