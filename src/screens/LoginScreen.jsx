import { useEffect, useRef, useState } from "react";
import { listCsvFiles, normalizeFileName } from "../lib/csvFile";

export default function LoginScreen({ onOpen }) {
  const [name, setName] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef(null);

  // Load the existing CSV files of the Documents folder once
  useEffect(() => {
    let cancelled = false;

    listCsvFiles().then((list) => {
      if (cancelled) return;
      setFiles(list);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    const fileName = normalizeFileName(name);

    if (!fileName) {
      inputRef.current?.focus();
      return;
    }
    onOpen(fileName);
  }

  return (
    <div className="flex min-h-screen flex-col gap-7 bg-base-100 px-6 py-8">
      <header className="mt-16 flex flex-col gap-3">
        <div className="size-12 rounded-2xl bg-primary" />
        <h1 className="text-3xl font-bold">Expenses</h1>
        <p className="text-base-content/70">
          Choose a file to store your data, or create a new one.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-3xl bg-base-200 p-4"
      >
        <label htmlFor="file-name" className="text-sm font-semibold">
          File name
        </label>
        <div className="flex items-center gap-2">
          <input
            id="file-name"
            ref={inputRef}
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="expenses"
            autoCapitalize="none"
            autoCorrect="off"
            className="input h-[52px] flex-1 rounded-2xl"
          />
          <span className="text-base-content/70">.csv</span>
        </div>
        <button type="submit" className="btn btn-neutral h-[52px] rounded-2xl">
          Open or create file
        </button>
      </form>

      <section className="flex flex-col gap-2">
        <h2 className="mb-1 text-xs font-semibold uppercase tracking-wider text-base-content/70">
          Existing files
        </h2>

        {loading && <p className="text-sm text-base-content/70">Loading...</p>}

        {!loading && files.length === 0 && (
          <p className="text-sm text-base-content/70">No CSV file found yet.</p>
        )}

        {files.map((file) => (
          <button
            key={file}
            type="button"
            onClick={() => onOpen(file)}
            className="btn btn-ghost h-14 justify-start rounded-2xl border border-base-300 font-normal"
          >
            {file}
          </button>
        ))}
      </section>

      <p className="mt-auto text-sm text-base-content/70">
        Files are saved in your Documents folder.
      </p>
    </div>
  );
}
