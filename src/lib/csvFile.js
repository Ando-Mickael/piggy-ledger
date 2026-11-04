import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";

const DIRECTORY = Directory.Documents;
const SEPARATOR = ";"; // French Excel expects a semicolon
const HEADER = ["label", "amount", "date"];
const BOM = "\uFEFF"; // lets Excel read UTF-8 accents correctly

// ---------- File name ----------

export function normalizeFileName(name) {
  const clean = name.trim().replace(/[\\/:*?"<>|]/g, "");
  if (!clean) return "";
  return clean.toLowerCase().endsWith(".csv") ? clean : `${clean}.csv`;
}

// ---------- CSV format ----------

// French Excel reads "12,5" as a number, but "12.5" as text or a date
function formatAmount(amount) {
  return String(amount).replace(".", ",");
}

function parseAmount(text) {
  return Number(String(text).replace(",", "."));
}

function escapeField(value) {
  const text = String(value);
  if (/[;"\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function serialize(expenses) {
  const rows = expenses.map((expense) =>
    [
      escapeField(expense.label),
      formatAmount(expense.amount),
      expense.date,
    ].join(SEPARATOR),
  );
  return BOM + [HEADER.join(SEPARATOR), ...rows].join("\r\n") + "\r\n";
}

// Minimal CSV parser that handles quoted fields
function parseRows(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === SEPARATOR) {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

export function parseExpenses(text) {
  const clean = text.replace(/^\uFEFF/, "");
  return parseRows(clean)
    .slice(1) // skip header
    .filter((row) => row.length >= 3)
    .map(([label, amount, date]) => ({
      label,
      amount: parseAmount(amount),
      date,
    }));
}

// ---------- Filesystem ----------

export async function ensurePermissions() {
  try {
    const status = await Filesystem.checkPermissions();
    if (status.publicStorage !== "granted") {
      await Filesystem.requestPermissions();
    }
  } catch (error) {
    console.warn("Permission check failed:", error);
  }
}

export async function fileExists(fileName) {
  try {
    await Filesystem.stat({ path: fileName, directory: DIRECTORY });
    return true;
  } catch {
    return false;
  }
}

export async function listCsvFiles() {
  try {
    const { files } = await Filesystem.readdir({
      path: "",
      directory: DIRECTORY,
    });
    return files
      .map((file) => file.name)
      .filter((name) => name.toLowerCase().endsWith(".csv"));
  } catch (error) {
    console.warn("Could not list files:", error);
    return [];
  }
}

export async function saveExpenses(fileName, expenses) {
  await Filesystem.writeFile({
    path: fileName,
    directory: DIRECTORY,
    data: serialize(expenses),
    encoding: Encoding.UTF8,
  });
}

// Returns the expenses of the file, creating an empty file if it does not exist
export async function openOrCreate(fileName) {
  await ensurePermissions();

  if (!(await fileExists(fileName))) {
    await saveExpenses(fileName, []);
    return [];
  }

  const { data } = await Filesystem.readFile({
    path: fileName,
    directory: DIRECTORY,
    encoding: Encoding.UTF8,
  });
  return parseExpenses(data);
}
