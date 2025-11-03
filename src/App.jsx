import React, { useEffect, useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'

const STORAGE_KEY = "budget-tracker-data-v1";

const DEFAULT_CATEGORIES = [
  "General",
  "Food & Drink",
  "Rent / Housing",
  "Transport",
  "Shopping",
  "Subscriptions",
  "Entertainment"
];

function App() {
  const [monthlyBudget, setMonthlyBudget] = useState(1000);
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: DEFAULT_CATEGORIES[0],
    date: new Date().toISOString().slice(0, 10)
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setMonthlyBudget(parsed.monthlyBudget ?? 1000);
      setExpenses(parsed.expenses ?? []);
    }
  }, []);

  useEffect(() => {
    const payload = { monthlyBudget, expenses };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [monthlyBudget, expenses]);

  const totalSpent = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const remaining = monthlyBudget - totalSpent;

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleAddExpense(e) {
    e.preventDefault();
    if (!form.description.trim() || !form.amount) return;

    const newExpense = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now(),
      description: form.description.trim(),
      amount: Number(form.amount),
      category: form.category,
      date: form.date
    };

    setExpenses(prev => [newExpense, ...prev]);
    setForm(prev => ({
      ...prev,
      description: "",
      amount: "",
      category: prev.category,
      date: new Date().toISOString().slice(0, 10)
    }));
  }

  function handleDeleteExpense(id) {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  }

  return (
    <div className="container">
      <div>
        <header className="flex" style={{ marginBottom: "1rem" }}>
          <div>
            <h1>Expense Tracker</h1>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              Track your spending without crying.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <label htmlFor="budgetInput" style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>
              Monthly budget (£)
            </label>
            <input
              id="budgetInput"
              type="number"
              min="0"
              value={monthlyBudget}
              onChange={e => setMonthlyBudget(Number(e.target.value || 0))}
              style={{ width: "100px", textAlign: "right" }}
            />
          </div>
        </header>

        <form onSubmit={handleAddExpense} className="card" style={{ marginBottom: "1rem" }}>
          <div className="flex" style={{ gap: "0.5rem", flexWrap: "wrap" }}>
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleFormChange}
              style={{ flex: "2" }}
            />
            <input
              type="number"
              name="amount"
              placeholder="£"
              value={form.amount}
              onChange={handleFormChange}
              style={{ flex: "1" }}
              min="0"
              step="0.01"
            />
            <select
              name="category"
              value={form.category}
              onChange={handleFormChange}
              style={{ flex: "1.2" }}
            >
              {DEFAULT_CATEGORIES.map(cat => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleFormChange}
              style={{ flex: "1" }}
            />
            {/*<div className="date-picker-wrapper">
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleFormChange}
                className="date-picker"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="calendar-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
              </svg>
            </div>*/}

            <button type="submit" style={{ flex: "1" }}>
              Add
            </button>
          </div>
        </form>

        <div className="card">
          <div className="flex" style={{ marginBottom: "0.5rem" }}>
            <span style={{ fontWeight: "bold" }}>Recent expenses</span>
            <span>{expenses.length} item{expenses.length !== 1 ? "s" : ""}</span>
          </div>
          <ul style={{ maxHeight: "400px", overflowY: "auto" }}>
            {expenses.length === 0 && (
              <li style={{ color: "#94a3b8", fontSize: "0.9rem" }}>No expenses yet.</li>
            )}
            {expenses.map(exp => (
              <li key={exp.id} className="flex" style={{ padding: "0.5rem 0" }}>
                <div>
                  <p style={{ margin: 0 }}>{exp.description}</p>
                  <small style={{ color: "#94a3b8" }}>
                    {exp.category} • {new Date(exp.date).toLocaleDateString()}
                  </small>
                </div>
                <div className="flex" style={{ gap: "0.5rem", alignItems: "center" }}>
                  <strong>£{exp.amount.toFixed(2)}</strong>
                  <button
                    type="button"
                    onClick={() => handleDeleteExpense(exp.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#94a3b8",
                      cursor: "pointer"
                    }}
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <aside>
        <div className="card" style={{ marginBottom: "1rem" }}>
          <h2>This Month</h2>
          <p>Budget: <strong>£{monthlyBudget.toFixed(2)}</strong></p>
          <p>Spent: <strong style={{ color: "#f87171" }}>£{totalSpent.toFixed(2)}</strong></p>
          <p>
            Remaining:{" "}
            <strong style={{ color: remaining >= 0 ? "#4ade80" : "#f87171" }}>
              £{remaining.toFixed(2)}
            </strong>
          </p>
          <div style={{
            height: "10px",
            background: "#334155",
            borderRadius: "4px",
            overflow: "hidden",
            marginTop: "0.5rem"
          }}>
            <div style={{
              height: "100%",
              width: `${Math.min((totalSpent / monthlyBudget) * 100 || 0, 110)}%`,
              background: remaining >= 0 ? "#6366f1" : "#f87171"
            }}></div>
          </div>
        </div>

        <div className="card">
          <h2>Spend by category</h2>
          <ul>
            {DEFAULT_CATEGORIES.map(cat => {
              const totalForCat = expenses
                .filter(e => e.category === cat)
                .reduce((sum, e) => sum + e.amount, 0);
              const pct = totalSpent > 0 ? (totalForCat / totalSpent) * 100 : 0;
              return (
                <li key={cat} style={{ marginBottom: "0.5rem" }}>
                  <div className="flex" style={{ fontSize: "0.85rem" }}>
                    <span>{cat}</span>
                    <span>
                      £{totalForCat.toFixed(2)} {pct > 0 ? `(${pct.toFixed(0)}%)` : ""}
                    </span>
                  </div>
                  <div style={{
                    height: "6px",
                    background: "#334155",
                    borderRadius: "3px",
                    overflow: "hidden"
                  }}>
                    <div style={{
                      width: `${pct}%`,
                      height: "100%",
                      background: "#6366f1"
                    }}></div>
                  </div>
                </li>
              );
            })}
          </ul>
          <p style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
            Stored locally in your browser — your bad spending habits are safe from prying eyes.
          </p>
        </div>
      </aside>
    </div>
  );
}

export default App;
