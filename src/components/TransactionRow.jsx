import { formatMGA } from "../lib/helpers";

// onEdit and onDelete are optional: the actions only show when both are given
export default function TransactionRow({ item, onEdit, onDelete }) {
  const isIncome = item.amount > 0;

  return (
    <div className="rounded-2xl bg-base-200 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold">{item.label}</p>
          <p className="text-sm text-base-content/70">{item.date}</p>
        </div>
        <p
          className={`whitespace-nowrap font-semibold ${
            isIncome ? "text-primary" : ""
          }`}
        >
          {formatMGA(item.amount)}
        </p>
      </div>

      {onEdit && onDelete && (
        <div className="flex justify-end">
          <button
            type="button"
            className="btn btn-ghost btn-sm h-11 text-primary"
            onClick={() => onEdit(item)}
          >
            Edit
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm h-11 underline"
            onClick={() => onDelete(item)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
