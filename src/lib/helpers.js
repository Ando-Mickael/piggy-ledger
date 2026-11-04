const pad = (value) => String(value).padStart(2, "0");

function toISO(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function todayISO() {
  return toISO(new Date());
}

function groupDigits(value) {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// 1234567 -> "1 234 567" (keeps the minus sign)
export function formatNumber(amount) {
  return `${amount < 0 ? "-" : ""}${groupDigits(Math.abs(amount))}`;
}

// -45500 -> "-45 500 MGA", 1200000 -> "+1 200 000 MGA"
export function formatMGA(amount) {
  const sign = amount < 0 ? "-" : amount > 0 ? "+" : "";
  return `${sign}${groupDigits(Math.abs(amount))} MGA`;
}

// Positive amount = income, negative amount = expense
export function getTotals(expenses) {
  let income = 0;
  let expense = 0;

  expenses.forEach(({ amount }) => {
    if (amount > 0) income += amount;
    else expense += -amount;
  });

  return { income, expense, balance: income - expense };
}

// Keep the position of each entry in the CSV file (needed to edit / delete)
export function withIndex(expenses) {
  return expenses.map((expense, index) => ({ ...expense, index }));
}

export function sortNewestFirst(items) {
  return [...items].sort(
    (a, b) => b.date.localeCompare(a.date) || b.index - a.index,
  );
}

// Returns [startISO, endISO] for the current week / month / year, or null for "all"
function getRange(filter) {
  const now = new Date();
  const year = now.getFullYear();

  if (filter === "year") {
    return [`${year}-01-01`, `${year}-12-31`];
  }

  if (filter === "month") {
    const month = now.getMonth() + 1;
    const lastDay = new Date(year, month, 0).getDate();
    return [
      `${year}-${pad(month)}-01`,
      `${year}-${pad(month)}-${pad(lastDay)}`,
    ];
  }

  if (filter === "week") {
    const daysSinceMonday = (now.getDay() + 6) % 7;
    const start = new Date(
      year,
      now.getMonth(),
      now.getDate() - daysSinceMonday,
    );
    const end = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate() + 6,
    );
    return [toISO(start), toISO(end)];
  }

  return null;
}

export function filterByRange(items, filter) {
  const range = getRange(filter);
  if (!range) return items;
  return items.filter((item) => item.date >= range[0] && item.date <= range[1]);
}
