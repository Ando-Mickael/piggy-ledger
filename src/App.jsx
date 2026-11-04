import { useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { openOrCreate, saveExpenses } from "./lib/csvFile";
import HistoryScreen from "./screens/HistoryScreen";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";

export default function App() {
  const navigate = useNavigate();
  const [fileName, setFileName] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");

  const ready = fileName !== "";

  // Called by the login screen once a file name is chosen
  async function openFile(name) {
    try {
      setError("");
      const loaded = await openOrCreate(name);
      setFileName(name);
      setExpenses(loaded);
      navigate("/home");
    } catch (err) {
      console.error(err);
      setError("Could not open the file.");
    }
  }

  // Keep the state and the CSV file in sync after every change
  async function persist(next) {
    const previous = expenses;
    setError("");
    setExpenses(next);
    try {
      await saveExpenses(fileName, next);
    } catch (err) {
      console.error(err);
      setExpenses(previous);
      setError("Could not save the file.");
    }
  }

  function addExpense(expense) {
    return persist([...expenses, expense]);
  }

  // "index" is the position of the entry in the CSV file (header excluded)
  function updateExpense(index, expense) {
    return persist(expenses.map((item, i) => (i === index ? expense : item)));
  }

  function removeExpense(index) {
    return persist(expenses.filter((_, i) => i !== index));
  }

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {error && <div className="alert alert-error rounded-none">{error}</div>}

      <Routes>
        <Route path="/" element={<LoginScreen onOpen={openFile} />} />
        <Route
          path="/home"
          element={
            ready ? (
              <HomeScreen
                fileName={fileName}
                expenses={expenses}
                onAdd={addExpense}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/history"
          element={
            ready ? (
              <HistoryScreen
                expenses={expenses}
                onUpdate={updateExpense}
                onRemove={removeExpense}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
