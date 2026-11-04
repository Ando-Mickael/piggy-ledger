import { useEffect, useRef, useState } from "react";
import { todayISO } from "../lib/helpers";

// Bottom sheet used to add a new entry or edit an existing one
export default function EntryModal({ open, entry, onSave, onClose }) {
  const [type, setType] = useState("expense");
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayISO());
  const [error, setError] = useState("");
  const labelRef = useRef(null);

  // Fill the form each time the modal opens
  useEffect(() => {
    if (!open) return;

    if (entry) {
      setType(entry.amount < 0 ? "expense" : "income");
      setLabel(entry.label);
      setAmount(String(Math.abs(entry.amount)).replace(".", ","));
      setDate(entry.date);
    } else {
      setType("expense");
      setLabel("");
      setAmount("");
      setDate(todayISO());
    }
    setError("");
    labelRef.current?.focus();
  }, [open, entry]);

  if (!open) return null;

  async function handleSubmit(event) {
    event.preventDefault();
    const value = Number(amount.replace(/\s/g, "").replace(",", "."));

    if (!label.trim()) return setError("Label is required.");
    if (!Number.isFinite(value) || value <= 0) {
      return setError("Enter an amount greater than 0.");
    }
    if (!date) return setError("Date is required.");

    // Sign carries the type: negative = expense, positive = income
    await onSave({
      label: label.trim(),
      amount: type === "expense" ? -value : value,
      date,
    });
    onClose();
  }

  const segment = "h-11 flex-1 rounded-xl text-sm font-medium";
  const field = "input h-[52px] w-full rounded-2xl";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/50"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
        className="flex w-full flex-col gap-4 rounded-t-[28px] bg-base-100 px-6 pb-8 pt-3"
      >
        <div className="mx-auto h-1.5 w-10 rounded-full bg-base-300" />
        <h2 className="text-xl font-bold">
          {entry ? "Edit entry" : "Add entry"}
        </h2>

        <div className="flex gap-1 rounded-2xl bg-base-200 p-1">
          <button
            type="button"
            onClick={() => setType("income")}
            className={`${segment} ${
              type === "income" ? "bg-neutral text-neutral-content" : ""
            }`}
          >
            Income
          </button>
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`${segment} ${
              type === "expense" ? "bg-neutral text-neutral-content" : ""
            }`}
          >
            Expense
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="entry-label" className="text-sm font-semibold">
            Label
          </label>
          <input
            id="entry-label"
            ref={labelRef}
            type="text"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="Groceries"
            className={field}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="entry-amount" className="text-sm font-semibold">
            Amount (MGA)
          </label>
          <input
            id="entry-amount"
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="0"
            className={field}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="entry-date" className="text-sm font-semibold">
            Date
          </label>
          <input
            id="entry-date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className={field}
          />
        </div>

        {error && <p className="text-sm text-error">{error}</p>}

        <div className="mt-1 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn h-[52px] flex-1 rounded-2xl border-0 bg-base-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary h-[52px] flex-1 rounded-2xl"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
