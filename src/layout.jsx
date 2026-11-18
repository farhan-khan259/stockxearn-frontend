import React, { useState, useEffect } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  LayoutDashboard,
  ChartNoAxesCombined,
  BriefcaseBusiness,
  ArrowDownLeft,
  ArrowUpRight,
  Users,
  Medal,
  TicketPercent,
  MessageCircle,
  History,
  UserRound,
  ShieldCheck,
  Bell,
  LifeBuoy,
  HelpCircle,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Settings,
  FileText,
  ClipboardCheck,
  ScrollText,
  Home,
  Gift,
  Globe,
} from "lucide-react";
import { Brand } from "./public";
import { useSession, useData, Modal, SafeLink } from "./core";
const memberNav = [
  ["Overview", "", LayoutDashboard],
  ["Explore plans", "plans", ChartNoAxesCombined],
  ["My portfolio", "my-plans", BriefcaseBusiness],
  ["Deposit funds", "deposit", ArrowDownLeft],
  ["Withdraw", "withdraw", ArrowUpRight],
  ["My network", "team", Users],
  ["Investor milestones", "ranks", Medal],
  ["Community reward", "community", MessageCircle],
  ["Reward codes", "reward-codes", TicketPercent],
  ["All earnings", "earnings", Gift],
  ["Activity", "activity", History],
  ["Deposit history", "deposits/history", ArrowDownLeft],
  ["Withdrawal history", "withdrawals/history", ArrowUpRight],
  ["My profile", "profile", UserRound],
  ["Security", "security", ShieldCheck],
  ["Notifications", "notifications", Bell],
  ["Support", "support", LifeBuoy],
  ["FAQs", "faq", HelpCircle],
];
const adminNav = [
  ["Overview", "", LayoutDashboard],
  ["Members", "users", Users],
  ["Plan catalogue", "plans", BriefcaseBusiness],
  ["Deposit reviews", "deposits", ArrowDownLeft],
  ["Withdrawal reviews", "withdrawals", ArrowUpRight],
  ["Community reviews", "community", ClipboardCheck],
  ["Investor milestones", "ranks", Medal],
  ["Reward codes", "reward-codes", TicketPercent],
  ["Transactions", "transactions", History],
  ["Commissions", "commissions", ChartNoAxesCombined],
  ["Reports", "reports", FileText],
  ["Content studio", "content", ScrollText],
  ["Support inbox", "tickets", LifeBuoy],
  ["Settings", "settings", Settings],
];
export function Shell({ admin = false }) {
  const [menu, setMenu] = useState(false),
    [popup, setPopup] = useState(false);
  const session = useSession(),
    navigate = useNavigate(),
    location = useLocation();
  const settings = useData("/settings"),
    content = useData("/content"),
    notifications = useData("/notifications");
  const base = admin ? "/admin" : "/app",
    nav = admin ? adminNav : memberNav;
  useEffect(() => {
    setMenu(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);
  useEffect(() => {
    const t = setInterval(() => {
      notifications.reload();
      session.refresh();
    }, 60000);
    return () => clearInterval(t);
  }, [notifications.reload, session.refresh]);
  const popupKey =
    content.data && session.user
      ? `sx-popup-${session.user._id}-${content.data.popupVersion}`
      : null;
  const isLaunchNotice =
    content.data?.popupVersion === 2 &&
    content.data?.popupTitle === "StockXEarn launches 20 November 2026";
  useEffect(() => {
    if (
      !admin &&
      popupKey &&
      content.data.popupEnabled &&
      !session.user?.mustChangePassword
    )
      setPopup(true);
    else setPopup(false);
  }, [
    popupKey,
    admin,
    content.data?.popupEnabled,
    session.user?.mustChangePassword,
  ]);
  function dismiss() {
    setPopup(false);
  }
  const current =
    nav.find(([, p]) =>
      p ? location.pathname === `${base}/${p}` : location.pathname === base,
    )?.[0] || "Workspace";
  return (
    <div
      className={`workspace ${
        admin ? "admin-workspace" : "member-workspace"
      }`}
    >
      {menu && (
        <button
          className="sidebar-scrim"
          aria-label="Close menu"
          onClick={() => setMenu(false)}
        />
      )}
      <aside className={`sidebar ${menu ? "is-open" : ""}`}>
        <div className="sidebar-brand">
          <Brand />
          <button
            className="icon-btn mobile-menu"
            aria-label="Close menu"
            onClick={() => setMenu(false)}
          >
            <X />
          </button>
        </div>
        {admin && (
          <div className="admin-panel-mark">
            <span className="admin-panel-icon">
              <ShieldCheck size={24} />
            </span>
            <span>
              <strong>Admin panel</strong>
              <small>Management workspace</small>
            </span>
          </div>
        )}
        <span className="nav-label">
          {admin ? "NAVIGATION" : "MEMBER WORKSPACE"}
        </span>
        <nav>
          {nav.map(([label, p, I]) => (
            <NavLink end={!p} to={`${base}${p ? "/" + p : ""}`} key={label}>
              <I size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <a
            href={settings.data?.channelLink || "#"}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={18} />
            Official channel
            <ArrowUpRight size={15} />
          </a>
          <button
            onClick={async () => {
              await session.logout();
              navigate("/");
            }}
          >
            <LogOut size={18} />
            Sign out
          </button>
          <small>© StockXEarn · All amounts in USD</small>
        </div>
      </aside>
      <div className="workspace-main">
        {session.user?.impersonating && (
          <div className="impersonation">
            <span>ADMIN ACCESS · Acting as {session.user.name}</span>
            <button
              onClick={async () => {
                await session.exit();
                navigate("/admin/users");
              }}
            >
              Exit to Admin
              <ArrowUpRight size={15} />
            </button>
          </div>
        )}
        <header className="topbar">
          <div className="row">
            {admin ? (
              <>
                <button
                  className="icon-btn mobile-menu"
                  aria-label="Open menu"
                  onClick={() => setMenu(true)}
                >
                  <Menu />
                </button>
                <Brand />
                <div className="breadcrumb">
                  Administration
                  <ChevronRight size={14} />
                  <strong>{current}</strong>
                </div>
              </>
            ) : (
              <>
                <Brand />
                <Link to="/app/profile" className="avatar" title="My account">
                  {session.user?.avatar ? (
                    <PrivateImage
                      path={session.user.avatar}
                      alt="Your profile photo"
                    />
                  ) : (
                    session.user?.name?.slice(0, 1).toUpperCase()
                  )}
                </Link>
              </>
            )}
          </div>
          <div className="row">
            <Link
              to="/"
              className="icon-btn desktop-only"
              title="Public homepage"
            >
              <Globe size={19} />
            </Link>
            <Link
              to={`${base}/${admin ? "tickets" : "notifications"}`}
              className="icon-btn notification-button"
              aria-label={
                admin
                  ? "Support inbox"
                  : `Notifications ${notifications.data?.unread || 0} unread`
              }
            >
              <Bell size={20} />
              {!admin && notifications.data?.unread > 0 && <i />}
            </Link>
            {admin && (
              <>
                <div className="avatar" title="My account">
                  {session.user?.avatar ? (
                    <PrivateImage
                      path={session.user.avatar}
                      alt="Your profile photo"
                    />
                  ) : (
                    session.user?.name?.slice(0, 1).toUpperCase()
                  )}
                </div>
                <div className="topbar-user">
                  <strong>{session.user?.name}</strong>
                  <small>Administrator</small>
                </div>
              </>
            )}
          </div>
        </header>
        <main className="page-content">
          {content.data?.announcementEnabled && !admin && (
            <div className="announcement">
              {content.data.announcementImage && (
                <PrivateImage
                  path={content.data.announcementImage}
                  alt="Announcement"
                />
              )}
              <div>
                <strong>{content.data.announcementTitle}</strong>
                <p>{content.data.announcementBody}</p>
              </div>
              {content.data.announcementLink && (
                <SafeLink
                  to={content.data.announcementLink}
                  className="text-link"
                >
                  View
                  <ArrowUpRight size={16} />
                </SafeLink>
              )}
            </div>
          )}
          <Outlet />
        </main>
      </div>
      <nav className="bottom-nav" aria-label="Quick navigation">
        {(admin
          ? [adminNav[0], adminNav[1], adminNav[3], adminNav[4]]
          : [memberNav[0], memberNav[1], memberNav[2], memberNav[6]]
        ).map(([label, p, I]) => (
          <NavLink end={!p} to={`${base}${p ? "/" + p : ""}`} key={label}>
            <I size={20} />
            <span>
              {label === "My portfolio" ? "Portfolio" : label.split(" ")[0]}
            </span>
          </NavLink>
        ))}
        <button onClick={() => setMenu(true)}>
          <Menu size={20} />
          <span>More</span>
        </button>
      </nav>
      {popup && content.data && (
        <Modal
          title={isLaunchNotice ? "" : content.data.popupTitle}
          onClose={dismiss}
        >
          {isLaunchNotice ? (
            <div className="launch-popup">
              <p className="launch-popup-kicker">Platform launch</p>
              <time className="launch-popup-date" dateTime="2026-11-20">
                <strong>20</strong>
                <span>November</span>
                <b>2026</b>
              </time>
              <p className="launch-popup-message">{content.data.popupBody}</p>
              <div className="launch-popup-facts" aria-label="Launch details">
                <div>
                  <span>Minimum deposit</span>
                  <strong>$3.00</strong>
                </div>
                <div>
                  <span>Minimum withdrawal</span>
                  <strong>$1.00</strong>
                </div>
              </div>
              <div className="launch-popup-actions">
                <a
                  className="btn"
                  href={settings.data?.channelLink || content.data.popupLink}
                  target="_blank"
                  rel="noreferrer"
                  onClick={dismiss}
                >
                  <MessageCircle size={18} />
                  Join WhatsApp channel
                </a>
                <button className="btn ghost" onClick={dismiss}>
                  Continue to dashboard
                </button>
              </div>
            </div>
          ) : (
            <>
              {content.data.popupImage && (
                <PrivateImage
                  path={content.data.popupImage}
                  alt="Welcome to StockXEarn"
                />
              )}
              <p>{content.data.popupBody}</p>
              {content.data.popupButton && (
                <SafeLink
                  className="btn"
                  to={content.data.popupLink}
                  onClick={dismiss}
                >
                  {content.data.popupButton}
                  <ArrowUpRight size={17} />
                </SafeLink>
              )}
              <button className="btn ghost" onClick={dismiss}>
                Dismiss
              </button>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
export function PrivateImage({ path, alt, ...props }) {
  const [url, setUrl] = useState(""),
    [error, setError] = useState(false);
  useEffect(() => {
    let live = true,
      objectUrl;
    if (!path) {
      setUrl("");
      return;
    }
    if (!path.startsWith("/api/")) {
      setUrl(path);
      return;
    }
    fetch(path, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("sx-token")}`,
      },
    })
      .then((r) => {
        if (!r.ok) throw Error();
        return r.blob();
      })
      .then((b) => {
        objectUrl = URL.createObjectURL(b);
        if (live) setUrl(objectUrl);
      })
      .catch(() => {
        if (live) setError(true);
      });
    return () => {
      live = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [path]);
  return error ? (
    <p>Image unavailable.</p>
  ) : url ? (
    <img src={url} alt={alt} {...props} />
  ) : (
    <span className="muted">Loading image…</span>
  );
}
