import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Dock from "../components/Dock";
import EntryModal from "../components/EntryModal";
import TransactionRow from "../components/TransactionRow";
import {
  formatNumber,
  getTotals,
  sortNewestFirst,
  withIndex,
} from "../lib/helpers";

function SummaryCard({ label, value, className }) {
  return (
    <div
      className={`flex flex-1 flex-col gap-1 rounded-2xl px-3 py-3.5 ${className}`}
    >
      <span className="text-xs font-semibold">{label}</span>
      <span className="whitespace-nowrap text-sm font-bold">{value}</span>
      <span className="text-[11px]">MGA</span>
    </div>
  );
}

export default function HomeScreen({ fileName, expenses, onAdd }) {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const totals = getTotals(expenses);
  const latest = sortNewestFirst(withIndex(expenses)).slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col gap-5 px-6 pb-32 pt-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Home</h1>
          <p className="text-sm text-base-content/70">{fileName}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="btn btn-sm h-11 rounded-full border-0 bg-base-200"
        >
          Change file
        </button>
      </header>

      <div className="flex gap-2">
        <SummaryCard
          label="Income"
          value={formatNumber(totals.income)}
          className="bg-[#ecfdf3] text-[#166534]"
        />
        <SummaryCard
          label="Expense"
          value={formatNumber(totals.expense)}
          className="bg-red-100 text-red-700"
        />
        <SummaryCard
          label="Balance"
          value={formatNumber(totals.balance)}
          className="bg-neutral text-neutral-content"
        />
      </div>

      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="btn btn-primary h-14 rounded-2xl text-base"
      >
        + Add entry
      </button>

      <section className="flex flex-col gap-2">
        <h2 className="mb-1 text-xs font-semibold uppercase tracking-wider text-base-content/70">
          Latest transactions
        </h2>

        {latest.length === 0 && (
          <p className="text-sm text-base-content/70">No entries yet.</p>
        )}

        {latest.map((item) => (
          <TransactionRow key={item.index} item={item} />
        ))}

        {latest.length > 0 && (
          <Link to="/history" className="mt-1 py-3 font-semibold text-primary">
            See all history
          </Link>
        )}
      </section>

      <EntryModal
        open={modalOpen}
        onSave={onAdd}
        onClose={() => setModalOpen(false)}
      />
      <Dock />
    </div>
  );
}
