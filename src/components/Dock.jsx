import { NavLink } from "react-router-dom";

const baseClass =
  "flex h-12 items-center gap-2 rounded-full px-5 text-sm transition-colors";

function linkClass({ isActive }) {
  return `${baseClass} ${
    isActive
      ? "bg-primary font-semibold text-primary-content"
      : "font-medium text-neutral-content/80"
  }`;
}

function Icon({ children }) {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export default function Dock() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 flex justify-center">
      <nav className="pointer-events-auto flex gap-1 rounded-full bg-neutral p-1.5 shadow-xl">
        <NavLink to="/home" className={linkClass}>
          <Icon>
            <path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
          </Icon>
          Home
        </NavLink>
        <NavLink to="/history" className={linkClass}>
          <Icon>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </Icon>
          History
        </NavLink>
      </nav>
    </div>
  );
}
