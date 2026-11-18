import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  X,
  TriangleAlert,
} from "lucide-react";
export const money = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format((n || 0) / 100);
export const PKR_PER_USD = 280;
export const pkr = (n) =>
  `PKR ${new Intl.NumberFormat("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format((n || 0) / 100)}`;
export const pkrFromUsd = (n) => pkr(Math.round((n || 0) * PKR_PER_USD));
export const date = (d) =>
  d
    ? new Intl.DateTimeFormat("en-PK", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Karachi",
      }).format(new Date(d))
    : "—";
export const title = (s) =>
  (s || "").replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
let authHandler = () => {};
export async function api(path, options = {}) {
  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...options.headers,
  };
  const token = sessionStorage.getItem("sx-token");
  if (token) headers.Authorization = `Bearer ${token}`;
  if (options.method && options.method !== "GET")
    headers["Idempotency-Key"] = options.requestKey || crypto.randomUUID();
  const res = await fetch(`/api${path}`, {
    ...options,
    headers,
    body:
      options.body instanceof FormData
        ? options.body
        : options.body
          ? JSON.stringify(options.body)
          : undefined,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    if (res.status === 401) authHandler();
    throw new Error(error.message || "Unable to complete request");
  }
  return res.status === 204 ? null : res.json();
}
const Session = createContext();
export function useSession() {
  return useContext(Session);
}
export function Provider({ children }) {
  const [user, setUser] = useState(null),
    [loading, setLoading] = useState(true),
    [toast, setToast] = useState(null);
  const clear = useCallback(() => {
    sessionStorage.removeItem("sx-token");
    sessionStorage.removeItem("sx-admin");
    setUser(null);
  }, []);
  authHandler = clear;
  const refresh = useCallback(async () => {
    if (!sessionStorage.getItem("sx-token")) {
      setLoading(false);
      return;
    }
    try {
      setUser(await api("/me"));
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    refresh();
  }, [refresh]);
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 6000);
      return () => clearTimeout(t);
    }
  }, [toast]);
  function login(data) {
    sessionStorage.setItem("sx-token", data.token);
    setUser(data.user);
  }
  async function logout() {
    try {
      await api("/auth/logout", { method: "POST" });
    } catch {}
    clear();
  }
  async function impersonate(id) {
    const data = await api(`/admin/users/${id}/login`, { method: "POST" });
    sessionStorage.setItem("sx-admin", sessionStorage.getItem("sx-token"));
    login({ ...data, user: { ...data.user, impersonating: true } });
  }
  async function exit() {
    const token = sessionStorage.getItem("sx-admin");
    sessionStorage.removeItem("sx-admin");
    if (token) {
      sessionStorage.setItem("sx-token", token);
      await refresh();
    } else clear();
  }
  return (
    <Session.Provider
      value={{
        user,
        loading,
        refresh,
        login,
        logout,
        impersonate,
        exit,
        toast: (text, error = false) => setToast({ text, error }),
      }}
    >
      {children}
      {toast && (
        <div className={`toast ${toast.error ? "error" : ""}`} role="status">
          {toast.error ? <TriangleAlert size={19} /> : <Check size={19} />}
          <span>{toast.text}</span>
          <button aria-label="Dismiss message" onClick={() => setToast(null)}>
            <X size={18} />
          </button>
        </div>
      )}
    </Session.Provider>
  );
}
export function useData(path) {
  const [data, setData] = useState(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(true),
    [version, setVersion] = useState(0);
  const reload = useCallback(() => setVersion((v) => v + 1), []);
  useEffect(() => {
    let live = true;
    setBusy(true);
    setError("");
    api(path)
      .then((d) => {
        if (live) setData(d);
      })
      .catch((e) => {
        if (live) setError(e.message);
      })
      .finally(() => {
        if (live) setBusy(false);
      });
    return () => {
      live = false;
    };
  }, [path, version]);
  return { data, error, busy, reload };
}
export function Load({ resource, children }) {
  if (resource.busy)
    return (
      <div className="loading">
        <LoaderCircle className="spin" /> Loading your workspace…
      </div>
    );
  if (resource.error)
    return (
      <div className="card error-box" role="alert">
        <TriangleAlert />
        <p>{resource.error}</p>
        <button onClick={resource.reload} className="btn">
          Try again
        </button>
      </div>
    );
  return children(resource.data);
}
export function useAction() {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const s = useSession();
  async function run(fn, message, after) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const value = await fn();
      if (message) s.toast(message);
      if (after) await after(value);
      return value;
    } catch (e) {
      setError(e.message);
      s.toast(e.message, true);
    } finally {
      setBusy(false);
    }
  }
  return { busy, error, run };
}
export function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = true,
  ...props
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        name={name}
        type={type}
        value={value ?? ""}
        onChange={onChange}
        required={required}
        {...props}
      />
    </label>
  );
}
export function Submit({ busy, children = "Save changes" }) {
  return (
    <button className="btn" disabled={busy} type="submit">
      {busy ? (
        <>
          <LoaderCircle size={17} className="spin" /> Processing…
        </>
      ) : (
        children
      )}
    </button>
  );
}
export function PageHead({
  eyebrow = "YOUR WORKSPACE",
  title: heading,
  description,
  action,
}) {
  return (
    <header className="page-head">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{heading}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </header>
  );
}
export function Empty({
  title: heading = "Nothing here yet",
  text = "Your records will appear here as you use StockXEarn.",
}) {
  return (
    <div className="empty">
      <span className="empty-symbol">
        <ArrowUpRight size={21} />
      </span>
      <h3>{heading}</h3>
      <p>{text}</p>
    </div>
  );
}
export function Badge({ children, status }) {
  return (
    <span className={`badge ${status || ""}`}>{children || title(status)}</span>
  );
}
export function Pager({ data, onPage }) {
  return (
    data.pages > 1 && (
      <div className="pager">
        <button
          className="btn ghost"
          disabled={data.page <= 1}
          onClick={() => onPage(data.page - 1)}
        >
          <ChevronLeft size={16} />
          Previous
        </button>
        <span>
          {data.page} / {data.pages}
        </span>
        <button
          className="btn ghost"
          disabled={data.page >= data.pages}
          onClick={() => onPage(data.page + 1)}
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    )
  );
}
export function Modal({ title: heading, children, onClose }) {
  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", fn);
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", fn);
      document.body.style.overflow = old;
    };
  }, [onClose]);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={heading}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="row between">
          <h2>{heading}</h2>
          <button
            className="icon-btn"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <X />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
export function Stats({ items }) {
  return (
    <div className="stats">
      {items.map(([label, value, Icon]) => (
        <div className="card stat" key={label}>
          <div className="row between">
            <span>{label}</span>
            {Icon && <Icon size={19} />}
          </div>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
}
export function Ledger({ items, admin = false }) {
  return items?.length ? (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {admin && <th>Member</th>}
            <th>Activity</th>
            <th>Wallet</th>
            <th>Amount</th>
            <th>Date · PKT</th>
          </tr>
        </thead>
        <tbody>
          {items.map((t) => (
            <tr key={t._id}>
              {admin && (
                <td>
                  {t.user?.name || "Member"}
                  <small>{t.user?.phone}</small>
                </td>
              )}
              <td>
                <strong>{title(t.kind)}</strong>
                <small>{t.note}</small>
              </td>
              <td>{title(t.wallet)}</td>
              <td className={t.direction === "in" ? "positive" : "negative"}>
                <strong>
                  {t.direction === "in" ? "+" : "−"}
                  {money(t.amount)}
                </strong>
                <small>≈ {pkrFromUsd(t.amount)}</small>
              </td>
              <td>{date(t.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <Empty />
  );
}
export function SafeLink({ to, children, ...props }) {
  return /^https:\/\//.test(to || "") ? (
    <a href={to} target="_blank" rel="noreferrer" {...props}>
      {children}
    </a>
  ) : (
    <Link to={to || "/app"} {...props}>
      {children}
    </Link>
  );
}
export const formChange = (set) => (e) => {
  const { name, value, type, checked } = e.target;
  set((v) => ({ ...v, [name]: type === "checkbox" ? checked : value }));
};
