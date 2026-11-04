import { useState } from "react";
import Dock from "../components/Dock";
import EntryModal from "../components/EntryModal";
import TransactionRow from "../components/TransactionRow";
import { filterByRange, sortNewestFirst, withIndex } from "../lib/helpers";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
  { id: "year", label: "Year" },
];

export default function HistoryScreen({ expenses, onUpdate, onRemove }) {
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState(null); // the entry being edited, or null

  const items = sortNewestFirst(filterByRange(withIndex(expenses), filter));

  function handleDelete(item) {
    if (window.confirm("Delete this entry?")) {
      onRemove(item.index);
    }
  }

  return (
    <div className="flex min-h-screen flex-col gap-5 px-6 pb-32 pt-10">
      <h1 className="text-3xl font-bold">History</h1>

      <div className="flex gap-1 rounded-2xl bg-base-200 p-1">
        {FILTERS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={`h-11 flex-1 rounded-xl text-sm ${
              filter === id
                ? "bg-neutral font-semibold text-neutral-content"
                : ""
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <section className="flex flex-col gap-2">
        {items.length === 0 && (
          <p className="text-sm text-base-content/70">
            No entries for this period.
          </p>
        )}

        {items.map((item) => (
          <TransactionRow
            key={item.index}
            item={item}
            onEdit={setEditing}
            onDelete={handleDelete}
          />
        ))}
      </section>

      <EntryModal
        open={editing !== null}
        entry={editing}
        onSave={(entry) => onUpdate(editing.index, entry)}
        onClose={() => setEditing(null)}
      />
      <Dock />
    </div>
  );
}
