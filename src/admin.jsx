import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  BriefcaseBusiness,
  ArrowDownLeft,
  ArrowUpRight,
  Gift,
  Wallet,
  ChartNoAxesCombined,
  ClipboardCheck,
  ShieldCheck,
  Copy,
  Plus,
  Search,
  Settings,
  MessageCircle,
  Eye,
  KeyRound,
  UserRound,
  Coins,
} from "lucide-react";
import {
  api,
  useData,
  Load,
  useSession,
  useAction,
  PageHead,
  Stats,
  money,
  pkr,
  pkrFromUsd,
  date,
  title,
  Ledger,
  Empty,
  Field,
  Submit,
  formChange,
  Badge,
  Pager,
  Modal,
} from "./core";
import { EarningsChart } from "./member";
import { PrivateImage } from "./layout";
export function AdminOverview() {
  const r = useData("/admin/overview"),
    a = useAction();
  return (
    <>
      <PageHead
        eyebrow="STOCKXEARN / CONTROL CENTRE"
        title="The complete operating picture."
        description="Real records. Clear decisions. Your platform at a glance."
        action={
          <Link className="btn" to="/admin/settings">
            <Settings size={17} />
            Platform settings
          </Link>
        }
      />
      <Load resource={r}>
        {(d) => (
          <>
            <div className="admin-welcome">
              <div>
                <span className="eyebrow">TODAY’S PERSPECTIVE</span>
                <h2>Welcome to your control centre.</h2>
                <p>
                  Keep payments, members and the platform experience moving
                  together.
                </p>
              </div>
              <img
                src="/images/capital-prime.webp"
                alt="Capital Prime financial illustration"
              />
            </div>
            <Stats
              items={[
                ["Members", d.users, Users],
                ["Active purchases", d.activePlans, BriefcaseBusiness],
                ["Approved deposits", money(d.deposits), ArrowDownLeft],
                ["Paid withdrawals", money(d.withdrawals), ArrowUpRight],
              ]}
            />
            <div className="review-queue">
              {[
                [
                  "Deposits to review",
                  d.pendingDeposits,
                  "deposits",
                  ArrowDownLeft,
                ],
                [
                  "Withdrawals to pay",
                  d.pendingWithdrawals,
                  "withdrawals",
                  ArrowUpRight,
                ],
                [
                  "Community submissions",
                  d.pendingCommunity,
                  "community",
                  ClipboardCheck,
                ],
              ].map(([label, n, path, I]) => (
                <Link
                  className="card row between"
                  key={path}
                  to={`/admin/${path}`}
                >
                  <div className="row">
                    <span className="mini-icon">
                      <I size={21} />
                    </span>
                    <div>
                      <strong>{n}</strong>
                      <p>{label}</p>
                    </div>
                  </div>
                  <ArrowUpRight />
                </Link>
              ))}
            </div>
            <div className="dashboard-columns">
              <section className="card">
                <div className="row between">
                  <h2>Cashflow activity</h2>
                  <Badge>Last 30 days · USD</Badge>
                </div>
                <EarningsChart data={d.chart} admin />
                <small>
                  Withdrawals show reserved amounts less refunds, not just
                  completed payments.
                </small>
              </section>
              <section className="card">
                <span className="eyebrow">PLATFORM SUMMARY</span>
                <h2>Wallets & distributions</h2>
                <dl className="details-list">
                  {[
                    ["Deposit wallets", d.balances.deposits],
                    ["Earnings wallets", d.balances.withdrawable],
                    ["Total plan purchases", d.investment],
                    ["Plan profits credited", d.earnings],
                    ["Commissions credited", d.commissions],
                    ["Rewards credited", d.rewards],
                  ].map(([label, v]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{money(v)}</dd>
                    </div>
                  ))}
                </dl>
                <p className="muted">
                  Wallet totals are platform liabilities, not a bank balance.
                </p>
              </section>
            </div>
            <section className="card row between wrap">
              <div>
                <span className="eyebrow">FIRST MEMBER INVITATION</span>
                <h2>Administrator referral code</h2>
                <code>{d.referralCode}</code>
                <p>
                  Use this code to invite the first members. New users receive
                  their own referral code.
                </p>
              </div>
              <button
                className="btn ghost"
                onClick={() =>
                  a.run(
                    () => navigator.clipboard.writeText(d.referralCode),
                    "Code copied",
                  )
                }
              >
                <Copy size={17} />
                Copy code
              </button>
            </section>
            <section className="card">
              <div className="row between">
                <h2>Latest transactions</h2>
                <Link className="text-link" to="/admin/transactions">
                  View ledger
                  <ArrowUpRight size={16} />
                </Link>
              </div>
              <Ledger items={d.recent} admin />
            </section>
          </>
        )}
      </Load>
    </>
  );
}
export function AdminUsers() {
  const [page, setPage] = useState(1),
    [query, setQuery] = useState(""),
    [search, setSearch] = useState(""),
    [selected, setSelected] = useState(null);
  const r = useData(
      `/admin/users?page=${page}&q=${encodeURIComponent(search)}`,
    ),
    a = useAction(),
    session = useSession(),
    navigate = useNavigate();
  return (
    <>
      <PageHead
        title="Your member community."
        description="Manage access, review account records and provide direct support."
      />
      <section className="card">
        <form
          className="row wrap search-form"
          onSubmit={(e) => {
            e.preventDefault();
            setSearch(query);
            setPage(1);
          }}
        >
          <input
            aria-label="Find member"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or mobile number"
          />
          <button className="btn ghost">
            <Search size={17} />
            Search
          </button>
        </form>
        <Load resource={r}>
          {(d) => (
            <>
              {d.items.length ? (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Member</th>
                        <th>Deposit wallet</th>
                        <th>Earnings wallet</th>
                        <th>Access</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d.items.map((u) => (
                        <tr key={u._id}>
                          <td>
                            <strong>{u.name}</strong>
                            <small>{u.phone}</small>
                            <small>{u.referralCode}</small>
                          </td>
                          <td>{money(u.depositBalance)}</td>
                          <td>{money(u.withdrawableBalance)}</td>
                          <td>
                            <Badge status={u.blocked ? "rejected" : "active"}>
                              {u.blocked ? "Blocked" : "Active"}
                            </Badge>
                          </td>
                          <td>
                            <div className="row wrap">
                              <button
                                className="btn tiny ghost"
                                onClick={() => setSelected(u)}
                              >
                                <UserRound size={14} />
                                Manage
                              </button>
                              <button
                                className="btn tiny ghost"
                                disabled={a.busy || u.blocked}
                                onClick={() =>
                                  a.run(
                                    () => session.impersonate(u._id),
                                    "Admin user access started",
                                    () => navigate("/app"),
                                  )
                                }
                              >
                                <Eye size={14} />
                                Access account
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Empty title="No members found" />
              )}
              <Pager data={d} onPage={setPage} />
            </>
          )}
        </Load>
      </section>
      {selected && (
        <ManageUser
          user={selected}
          onClose={() => {
            setSelected(null);
            r.reload();
          }}
        />
      )}
    </>
  );
}
function ManageUser({ user, onClose }) {
  const r = useData(`/admin/users/${user._id}/detail`),
    a = useAction();
  const [f, setF] = useState({ name: user.name, phone: user.phone }),
    [balance, setBalance] = useState({
      wallet: "deposit",
      direction: "add",
      amount: "",
      reason: "",
    }),
    [temp, setTemp] = useState("");
  return (
    <Modal title={`Manage ${user.name}`} onClose={onClose}>
      <Load resource={r}>
        {(d) => (
          <>
            <div className="row between">
              <Badge status={d.user.blocked ? "rejected" : "active"}>
                {d.user.blocked ? "Blocked" : "Access active"}
              </Badge>
              <button
                className="btn tiny ghost"
                disabled={a.busy}
                onClick={() =>
                  a.run(
                    () =>
                      api(`/admin/users/${user._id}`, {
                        method: "PATCH",
                        body: { blocked: !d.user.blocked },
                      }),
                    "Member access updated",
                    r.reload,
                  )
                }
              >
                {d.user.blocked ? "Unblock member" : "Block login"}
              </button>
            </div>
            <h3>Profile and registered number</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                a.run(
                  () =>
                    api(`/admin/users/${user._id}`, {
                      method: "PATCH",
                      body: f,
                    }),
                  "Member updated",
                  r.reload,
                );
              }}
            >
              <Field
                label="Full name"
                name="name"
                value={f.name}
                onChange={formChange(setF)}
              />
              <Field
                label="Mobile number"
                name="phone"
                type="tel"
                value={f.phone}
                onChange={formChange(setF)}
              />
              <Submit busy={a.busy} />
            </form>
            <hr />
            <h3>Wallet adjustment</h3>
            <p>
              Deposit: {money(d.user.depositBalance)} · Earnings:{" "}
              {money(d.user.withdrawableBalance)}
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                a.run(
                  () =>
                    api(`/admin/users/${user._id}/balance`, {
                      method: "POST",
                      body: { ...balance, amount: Number(balance.amount) },
                    }),
                  "Balance adjusted",
                  () => {
                    setBalance({ ...balance, amount: "", reason: "" });
                    r.reload();
                  },
                );
              }}
            >
              <div className="two-col">
                <label className="field">
                  <span>Wallet</span>
                  <select
                    name="wallet"
                    value={balance.wallet}
                    onChange={formChange(setBalance)}
                  >
                    <option value="deposit">Deposit</option>
                    <option value="withdrawable">Earnings</option>
                  </select>
                </label>
                <label className="field">
                  <span>Action</span>
                  <select
                    name="direction"
                    value={balance.direction}
                    onChange={formChange(setBalance)}
                  >
                    <option value="add">Add funds</option>
                    <option value="remove">Deduct funds</option>
                  </select>
                </label>
              </div>
              <Field
                label="Amount (USD)"
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                value={balance.amount}
                onChange={formChange(setBalance)}
              />
              <Field
                label="Required reason"
                name="reason"
                minLength={5}
                maxLength={500}
                value={balance.reason}
                onChange={formChange(setBalance)}
              />
              <Submit busy={a.busy}>Apply adjustment</Submit>
            </form>
            <hr />
            <h3>Password recovery</h3>
            <p>
              Verify ownership before issuing a temporary password. Issuing one
              ends existing member sessions.
            </p>
            <button
              className="btn ghost"
              disabled={a.busy}
              onClick={() =>
                a.run(
                  () =>
                    api(`/admin/users/${user._id}/reset-password`, {
                      method: "POST",
                    }),
                  null,
                  (v) => setTemp(v.temporaryPassword),
                )
              }
            >
              <KeyRound size={16} />
              Generate temporary password
            </button>
            {temp && (
              <div className="notice">
                <code>{temp}</code>
                <p>
                  Share privately. A new password is required at next login.
                </p>
              </div>
            )}
            <hr />
            <h3>Recent transactions</h3>
            <Ledger items={d.transactions} />
            <h3>Purchased plans</h3>
            {d.plans.map((p) => (
              <p key={p._id}>
                {p.name} · {money(p.price)} · {p.status}
              </p>
            ))}
            {!d.plans.length && <p>No plans purchased.</p>}
          </>
        )}
      </Load>
    </Modal>
  );
}
export function AdminPlans() {
  const r = useData("/admin/plans"),
    [editing, setEditing] = useState(null);
  return (
    <>
      <PageHead
        title="The plan collection."
        description="Changes apply to future purchases. Existing purchases retain their original terms."
      />
      <Load resource={r}>
        {(plans) => (
          <div className="plan-grid">
            {plans.map((p) => (
              <article className="plan-card" key={p._id}>
                <div className="plan-image">
                  <img src={p.image} alt={p.name} />
                  <Badge status={p.enabled ? "active" : "rejected"}>
                    {p.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                  {p.locked && <Badge status="rejected">Locked</Badge>}
                </div>
                <div className="plan-body">
                  <h2>{p.name}</h2>
                  <strong className="plan-price">{money(p.price)}</strong>
                  <div className="plan-metrics">
                    <div>
                      <span>Daily</span>
                      <strong>{money(p.daily)}</strong>
                    </div>
                    <div>
                      <span>{p.duration}-day total</span>
                      <strong>{money(p.total)}</strong>
                    </div>
                  </div>
                  <button
                    className="btn ghost full"
                    onClick={() => setEditing(p)}
                  >
                    Edit plan
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </Load>
      {editing && (
        <EditPlan
          plan={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            r.reload();
          }}
        />
      )}
    </>
  );
}
function EditPlan({ plan, onClose, onSaved }) {
  const [f, setF] = useState({
      ...plan,
      price: plan.price / 100,
      daily: plan.daily / 100,
      locked: !!plan.locked,
    }),
    a = useAction(),
    change = formChange(setF);
  return (
    <Modal title={`Edit ${plan.name}`} onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          a.run(
            () =>
              api(`/admin/plans/${plan._id}`, {
                method: "PATCH",
                body: {
                  name: f.name,
                  description: f.description || "",
                  image: f.image,
                  price: Number(f.price),
                  daily: Number(f.daily),
                  duration: Number(f.duration),
                  enabled: f.enabled,
                  locked: f.locked,
                },
              }),
            "Plan updated",
            onSaved,
          );
        }}
      >
        <Field label="Plan name" name="name" value={f.name} onChange={change} />
        <div className="two-col">
          {[
            ["Price (USD)", "price"],
            ["Daily payout (USD)", "daily"],
            ["Duration (days)", "duration"],
          ].map(([label, name]) => (
            <Field
              key={name}
              label={label}
              name={name}
              type="number"
              min={name === "duration" ? 1 : 0.01}
              step={name === "duration" ? 1 : 0.01}
              value={f[name]}
              onChange={change}
            />
          ))}
        </div>
        <Field
          label="Image path"
          name="image"
          value={f.image}
          onChange={change}
        />
        <label className="field">
          <span>Description</span>
          <textarea
            name="description"
            value={f.description}
            onChange={change}
            rows={3}
          />
        </label>
        <label className="check-label">
          <input
            name="enabled"
            type="checkbox"
            checked={f.enabled}
            onChange={change}
          />
          Enable future purchases
        </label>
        <p className="muted">
          Total scheduled payout: {" "}
          {money(Math.round(Number(f.daily || 0) * Number(f.duration || 0) * 100))}.
          The backend recalculates and stores this total when you save.
        </p>
        <label className="check-label">
          <input
            name="locked"
            type="checkbox"
            checked={f.locked}
            onChange={change}
          />
          Lock this plan and show it as coming soon
        </label>
        <Submit busy={a.busy} />
      </form>
    </Modal>
  );
}
export function AdminRanks() {
  const r = useData("/admin/ranks"),
    [editing, setEditing] = useState(null);
  return (
    <>
      <PageHead
        title="Milestone configuration."
        description="Both personal and three-level team investment targets must be met. Claimed rewards remain credited."
      />
      <section className="card">
        <Load resource={r}>
          {(ranks) => (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Personal</th>
                    <th>Team</th>
                    <th>Reward</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {ranks.map((x) => (
                    <tr key={x._id}>
                      <td>
                        <strong>
                          {String(x.level).padStart(2, "0")} · {x.name}
                        </strong>
                      </td>
                      <td>{money(x.personal)}</td>
                      <td>{money(x.team)}</td>
                      <td>{money(x.reward)}</td>
                      <td>
                        <button
                          className="btn tiny ghost"
                          onClick={() => setEditing(x)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Load>
      </section>
      {editing && (
        <RankEdit
          rank={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            r.reload();
          }}
        />
      )}
    </>
  );
}
function RankEdit({ rank, onClose, onSaved }) {
  const [f, setF] = useState({
      ...rank,
      personal: rank.personal / 100,
      team: rank.team / 100,
      reward: rank.reward / 100,
    }),
    a = useAction();
  return (
    <Modal title={`Rank ${rank.level}`} onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          a.run(
            () =>
              api(`/admin/ranks/${rank._id}`, {
                method: "PATCH",
                body: {
                  name: f.name,
                  personal: Number(f.personal),
                  team: Number(f.team),
                  reward: Number(f.reward),
                },
              }),
            "Rank updated",
            onSaved,
          );
        }}
      >
        <Field
          label="Rank name"
          name="name"
          value={f.name}
          onChange={formChange(setF)}
        />
        {[
          ["Personal target (USD)", "personal"],
          ["Team target (USD)", "team"],
          ["Reward (USD)", "reward"],
        ].map(([label, name]) => (
          <Field
            label={label}
            name={name}
            key={name}
            type="number"
            min="0.01"
            step="0.01"
            value={f[name]}
            onChange={formChange(setF)}
          />
        ))}
        <Submit busy={a.busy} />
      </form>
    </Modal>
  );
}
export function Reviews({ type }) {
  const [page, setPage] = useState(1),
    [status, setStatus] = useState("pending"),
    [selected, setSelected] = useState(null);
  const r = useData(
      `/admin/${type}?page=${page}${status ? "&status=" + status : ""}`,
    ),
    a = useAction();
  const labels = {
    deposits: "Deposit verification.",
    withdrawals: "Withdrawal payments.",
    community: "Community reward reviews.",
  };
  return (
    <>
      <PageHead
        title={labels[type]}
        description={
          type === "withdrawals"
            ? "Send the external payment before marking a withdrawal paid. Rejection refunds the reserved funds."
            : type === "community"
              ? "Each user has one attempt. Approval credits $10; rejection locks the reward permanently."
              : "Verify the actual transfer against its transaction ID and screenshot before approval."
        }
      />
      <section className="card">
        <div className="row between">
          <h2>Review queue</h2>
          <select
            aria-label="Review status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All requests</option>
            {[
              "pending",
              type === "withdrawals" ? "paid" : "approved",
              "rejected",
            ].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </div>
        <Load resource={r}>
          {(d) => (
            <>
              {d.items.length ? (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Member</th>
                        <th>{type === "community" ? "Reward" : "Amount"}</th>
                        <th>Details</th>
                        <th>Status</th>
                        <th>Submitted · PKT</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {d.items.map((x) => (
                        <tr key={x._id}>
                          <td>
                            <strong>{x.user?.name}</strong>
                            <small>{x.user?.phone}</small>
                          </td>
                          <td>
                            {type === "community" ? (
                              money(1000)
                            ) : type === "deposits" ? (
                              <>
                                <strong>{money(x.creditedAmount || Math.floor(x.amount / 280))}</strong>
                                <small>
                                  Transfer {pkr(x.amount)}
                                </small>
                              </>
                            ) : (
                              <>
                                <strong>{money(x.amount)}</strong>
                                <small>Pay {pkrFromUsd(x.amount)}</small>
                              </>
                            )}
                          </td>
                          <td>
                            {type === "withdrawals" ? (
                              <>
                                {title(x.customInstitution || x.institution)}
                                <small>
                                  {x.accountName} · {x.accountNumber}
                                </small>
                              </>
                            ) : type === "deposits" ? (
                              <>
                                {title(x.method)}
                                <small>{x.tid}</small>
                              </>
                            ) : (
                              "One-time channel reward"
                            )}
                          </td>
                          <td>
                            <Badge status={x.status} />
                          </td>
                          <td>{date(x.createdAt)}</td>
                          <td>
                            <button
                              className="btn tiny ghost"
                              onClick={() => setSelected(x)}
                            >
                              Review
                              <ArrowUpRight size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Empty title="No requests in this queue" />
              )}
              <Pager data={d} onPage={setPage} />
            </>
          )}
        </Load>
      </section>
      {selected && (
        <ReviewModal
          item={selected}
          type={type}
          onClose={() => setSelected(null)}
          onSaved={() => {
            setSelected(null);
            r.reload();
          }}
        />
      )}
    </>
  );
}
function ReviewModal({ item, type, onClose, onSaved }) {
  const [note, setNote] = useState(""),
    [confirmPaid, setConfirmPaid] = useState(false),
    a = useAction();
  function review(action) {
    a.run(
      () =>
        api(`/admin/${type}/${item._id}/review`, {
          method: "POST",
          body: { action, note },
        }),
      "Review recorded",
      onSaved,
    );
  }
  return (
    <Modal title="Review submission" onClose={onClose}>
      <p>
        <strong>{item.user?.name}</strong> · {item.user?.phone}
      </p>
      <strong className="detail-price">
        {type === "community"
          ? money(1000)
          : type === "deposits"
            ? money(item.creditedAmount || Math.floor(item.amount / 280))
            : money(item.amount)}
      </strong>
      {type === "deposits" ? (
        <p className="currency-hint">
          Transfer received: {pkr(item.amount)} at 1 USD = PKR 280.
        </p>
      ) : type === "withdrawals" ? (
        <p className="currency-hint">
          Send {pkrFromUsd(item.amount)} to the member at 1 USD = PKR 280.
        </p>
      ) : null}
      {type !== "withdrawals" ? (
        <PrivateImage
          className="proof-image"
          path={`/api/${type}/${item._id}/proof`}
          alt="User submitted screenshot"
        />
      ) : (
        <dl className="details-list">
          <div>
            <dt>Institution</dt>
            <dd>{title(item.customInstitution || item.institution)}</dd>
          </div>
          <div>
            <dt>Account holder</dt>
            <dd>{item.accountName}</dd>
          </div>
          <div>
            <dt>Account / IBAN</dt>
            <dd>{item.accountNumber}</dd>
          </div>
        </dl>
      )}
      {item.tid && (
        <p>
          Transaction ID: <code>{item.tid}</code>
        </p>
      )}
      {item.status === "pending" ? (
        <>
          <label className="field">
            <span>Review note / required rejection reason</span>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={500}
            />
          </label>
          {type === "withdrawals" && (
            <label className="check-label">
              <input
                type="checkbox"
                checked={confirmPaid}
                onChange={(e) => setConfirmPaid(e.target.checked)}
              />
              I have sent the external payment to this account.
            </label>
          )}
          <div className="row wrap">
            <button
              className="btn"
              disabled={a.busy || (type === "withdrawals" && !confirmPaid)}
              onClick={() =>
                review(type === "withdrawals" ? "paid" : "approved")
              }
            >
              {a.busy
                ? "Processing…"
                : type === "withdrawals"
                  ? "Mark paid"
                  : "Approve"}
            </button>
            <button
              className="btn danger"
              disabled={a.busy || note.trim().length < 3}
              onClick={() => review("rejected")}
            >
              Reject with reason
            </button>
          </div>
        </>
      ) : (
        <>
          <Badge status={item.status} />
          <p>{item.note}</p>
          <small>Reviewed {date(item.reviewedAt)}</small>
        </>
      )}
    </Modal>
  );
}
export function AdminLedger() {
  const [page, setPage] = useState(1),
    [kind, setKind] = useState(""),
    r = useData(
      `/admin/transactions?page=${page}${kind ? "&kind=" + kind : ""}`,
    );
  return (
    <>
      <PageHead
        title="The transaction ledger."
        description="Every wallet movement, with a permanent source reference."
      />
      <section className="card">
        <div className="row between">
          <h2>All transactions</h2>
          <select
            aria-label="Transaction kind"
            value={kind}
            onChange={(e) => {
              setKind(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All sources</option>
            {[
              "deposit",
              "purchase",
              "earning",
              "commission",
              "rank_reward",
              "code_reward",
              "community_reward",
              "withdrawal",
              "refund",
              "adjustment",
            ].map((x) => (
              <option key={x} value={x}>
                {title(x)}
              </option>
            ))}
          </select>
        </div>
        <Load resource={r}>
          {(d) => (
            <>
              <Ledger items={d.items} admin />
              <Pager data={d} onPage={setPage} />
            </>
          )}
        </Load>
      </section>
    </>
  );
}
export function AdminCommissions() {
  const r = useData("/admin/commissions");
  return (
    <>
      <PageHead
        title="Network distributions."
        description="Commissions are paid only when a deposit is approved, using the configured rates at approval time."
        action={
          <Link className="btn" to="/admin/settings">
            Edit commission rates
          </Link>
        }
      />
      <Load resource={r}>
        {(d) => (
          <div className="three-col">
            {d.settings.commissions.map((rate, i) => {
              const row = d.totals.find((x) => x._id === String(i + 1));
              return (
                <section className="card" key={i}>
                  <span className="eyebrow">REFERRAL LEVEL {i + 1}</span>
                  <strong className="detail-price">{rate}%</strong>
                  <p>
                    Total credited: <strong>{money(row?.total)}</strong>
                  </p>
                  <p>{row?.count || 0} commission entries</p>
                </section>
              );
            })}
          </div>
        )}
      </Load>
    </>
  );
}
export function PaymentSettings() {
  const r = useData("/admin/settings");
  return (
    <>
      <PageHead
        title="Your platform, configured."
        description="Manage payment destinations, contact details and future deposit commission rates."
      />
      <Load resource={r}>{(s) => <SettingsForm initial={s} />}</Load>
    </>
  );
}
function SettingsForm({ initial }) {
  const [f, setF] = useState(initial),
    a = useAction(),
    change = formChange(setF);
  return (
    <form
      className="settings-form"
      onSubmit={(e) => {
        e.preventDefault();
        a.run(
          () =>
            api("/admin/settings", {
              method: "PATCH",
              body: {
                accountName: f.accountName,
                accountNumber: f.accountNumber,
                jazzcashName: f.jazzcashName,
                jazzcashNumber: f.jazzcashNumber,
                supportPhone: f.supportPhone,
                channelLink: f.channelLink,
                commissions: f.commissions.map(Number),
              },
            }),
          "Settings saved",
        );
      }}
    >
      <div className="two-col">
        <section className="card">
          <span className="eyebrow">PAYMENT ACCOUNTS</span>
          <h2>Easypaisa</h2>
          <Field
            label="Account holder name"
            name="accountName"
            value={f.accountName}
            onChange={change}
          />
          <Field
            label="Account number"
            name="accountNumber"
            type="tel"
            value={f.accountNumber}
            onChange={change}
          />
          <h2>JazzCash</h2>
          <Field
            label="Account holder name"
            name="jazzcashName"
            value={f.jazzcashName}
            onChange={change}
          />
          <Field
            label="Account number"
            name="jazzcashNumber"
            type="tel"
            value={f.jazzcashNumber}
            onChange={change}
          />
        </section>
        <section className="card">
          <span className="eyebrow">CONTACT & COMMUNITY</span>
          <h2>Stay connected</h2>
          <Field
            label="WhatsApp support number"
            name="supportPhone"
            type="tel"
            value={f.supportPhone}
            onChange={change}
          />
          <Field
            label="Official WhatsApp channel URL"
            name="channelLink"
            type="url"
            value={f.channelLink}
            onChange={change}
          />
          <h2>Deposit commissions</h2>
          {f.commissions.map((v, i) => (
            <Field
              key={i}
              label={`Level ${i + 1} (%)`}
              type="number"
              min={0}
              max={100}
              step="0.01"
              value={v}
              onChange={(e) =>
                setF({
                  ...f,
                  commissions: f.commissions.map((c, n) =>
                    n === i ? e.target.value : c,
                  ),
                })
              }
            />
          ))}
          <p className="muted">
            Existing commission records are unchanged. New rates apply to
            subsequent deposit approvals.
          </p>
        </section>
      </div>
      <Submit busy={a.busy}>Save platform settings</Submit>
    </form>
  );
}
export function AdminCodes() {
  const [page, setPage] = useState(1),
    r = useData(`/admin/reward-codes?page=${page}`),
    a = useAction(),
    [open, setOpen] = useState(false);
  const [f, setF] = useState({
      code: "",
      amount: "",
      expiresAt: "",
      limit: 30,
    }),
    change = formChange(setF);
  return (
    <>
      <PageHead
        title="Reward Codes."
        description="One redemption per user. The first successful claims receive the reward, up to your limit."
        action={
          <button className="btn" onClick={() => setOpen(true)}>
            <Plus size={17} />
            Create code
          </button>
        }
      />
      <section className="card">
        <Load resource={r}>
          {(d) => (
            <>
              {d.items.length ? (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Reward</th>
                        <th>Claims</th>
                        <th>Expires · PKT</th>
                        <th>Status</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {d.items.map((c) => (
                        <tr key={c._id}>
                          <td>
                            <strong>{c.code}</strong>
                          </td>
                          <td>{money(c.amount)}</td>
                          <td>
                            {c.used} / {c.limit}
                          </td>
                          <td>{date(c.expiresAt)}</td>
                          <td>
                            <Badge status={c.enabled ? "active" : "rejected"}>
                              {c.enabled ? "Enabled" : "Disabled"}
                            </Badge>
                          </td>
                          <td>
                            <button
                              className="btn tiny ghost"
                              disabled={a.busy}
                              onClick={() =>
                                a.run(
                                  () =>
                                    api(`/admin/reward-codes/${c._id}`, {
                                      method: "PATCH",
                                      body: { enabled: !c.enabled },
                                    }),
                                  "Code updated",
                                  r.reload,
                                )
                              }
                            >
                              {c.enabled ? "Disable" : "Enable"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Empty title="Your first code starts here" />
              )}
              <Pager data={d} onPage={setPage} />
            </>
          )}
        </Load>
      </section>
      {open && (
        <Modal title="Create a Reward Code" onClose={() => setOpen(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              a.run(
                () =>
                  api("/admin/reward-codes", {
                    method: "POST",
                    body: {
                      code: f.code,
                      amount: Number(f.amount),
                      expiresAt: new Date(
                        `${f.expiresAt}:00+05:00`,
                      ).toISOString(),
                      limit: Number(f.limit),
                    },
                  }),
                "Reward Code created",
                () => {
                  setOpen(false);
                  setF({ code: "", amount: "", expiresAt: "", limit: 30 });
                  r.reload();
                },
              );
            }}
          >
            <Field
              label="Code"
              name="code"
              value={f.code}
              onChange={change}
              minLength={3}
              maxLength={40}
              placeholder="e.g. SXWELCOME"
            />
            <Field
              label="Reward per user (USD)"
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              value={f.amount}
              onChange={change}
            />
            <Field
              label="Expiry date and time (Pakistan time)"
              name="expiresAt"
              type="datetime-local"
              value={f.expiresAt}
              onChange={change}
            />
            <Field
              label="Maximum successful claims"
              name="limit"
              type="number"
              min={1}
              max={1000000}
              value={f.limit}
              onChange={change}
            />
            <Submit busy={a.busy}>Create code</Submit>
          </form>
        </Modal>
      )}
    </>
  );
}
export function AdminContent() {
  const r = useData("/admin/content");
  return (
    <>
      <PageHead
        title="Shape the StockXEarn experience."
        description="Manage homepage copy, member announcements, welcome popups and FAQs."
      />
      <Load resource={r}>{(c) => <ContentEditor initial={c} />}</Load>
    </>
  );
}
function ContentEditor({ initial }) {
  const [f, setF] = useState(initial),
    a = useAction(),
    change = formChange(setF);
  async function uploadImage(file, key) {
    if (!file) return;
    const body = new FormData();
    body.append("image", file);
    await a.run(
      () => api("/admin/media", { method: "POST", body }),
      "Image uploaded",
      (v) => setF((old) => ({ ...old, [key]: v.url })),
    );
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const keys = [
          "heroTitle",
          "heroSubtitle",
          "announcementEnabled",
          "announcementTitle",
          "announcementBody",
          "announcementLink",
          "announcementImage",
          "popupEnabled",
          "popupTitle",
          "popupBody",
          "popupImage",
          "popupButton",
          "popupLink",
          "faqs",
        ];
        const body = Object.fromEntries(keys.map((k) => [k, f[k] ?? ""]));
        a.run(
          () => api("/admin/content", { method: "PATCH", body }),
          "Content published",
          (d) => setF(d),
        );
      }}
    >
      <section className="card">
        <span className="eyebrow">PUBLIC HOMEPAGE</span>
        <h2>The first impression</h2>
        <Field
          label="Hero title"
          name="heroTitle"
          value={f.heroTitle}
          onChange={change}
        />
        <label className="field">
          <span>Hero introduction</span>
          <textarea
            name="heroSubtitle"
            value={f.heroSubtitle}
            onChange={change}
            rows={3}
            required
          />
        </label>
      </section>
      <div className="two-col">
        {[
          ["announcement", "Member announcement"],
          ["popup", "Welcome popup"],
        ].map(([prefix, heading]) => (
          <section className="card" key={prefix}>
            <h2>{heading}</h2>
            <label className="check-label">
              <input
                type="checkbox"
                name={`${prefix}Enabled`}
                checked={f[`${prefix}Enabled`]}
                onChange={change}
              />
              Enable {heading.toLowerCase()}
            </label>
            <Field
              label="Title"
              name={`${prefix}Title`}
              value={f[`${prefix}Title`]}
              onChange={change}
              required={prefix === "popup" || f[`${prefix}Enabled`]}
            />
            <label className="field">
              <span>Message</span>
              <textarea
                rows={4}
                name={`${prefix}Body`}
                value={f[`${prefix}Body`]}
                onChange={change}
              />
            </label>
            <label className="field">
              <span>Image</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                disabled={a.busy}
                onChange={(e) =>
                  uploadImage(e.target.files[0], `${prefix}Image`)
                }
              />
              <small>Upload PNG, JPEG or WebP up to 5 MB.</small>
            </label>
            {f[`${prefix}Image`] && (
              <>
                <PrivateImage
                  className="content-preview"
                  path={f[`${prefix}Image`]}
                  alt={heading}
                />
                <button
                  type="button"
                  className="btn tiny ghost"
                  onClick={() => setF({ ...f, [`${prefix}Image`]: "" })}
                >
                  Remove image
                </button>
              </>
            )}
            {prefix === "popup" && (
              <Field
                label="Button text"
                name="popupButton"
                value={f.popupButton}
                onChange={change}
                required={false}
              />
            )}
            <Field
              label="Button / announcement link"
              name={`${prefix}Link`}
              value={f[`${prefix}Link`]}
              onChange={change}
              required={false}
              placeholder="/app/plans or https://…"
            />
            {prefix === "popup" && (
              <p className="muted">
                Publishing changed popup content creates a new version and shows
                it again to members.
              </p>
            )}
          </section>
        ))}
      </div>
      <section className="card">
        <h2>Member FAQs</h2>
        {f.faqs.map((q, i) => (
          <div className="faq-editor" key={i}>
            <Field
              label={`Question ${i + 1}`}
              value={q.question}
              onChange={(e) =>
                setF({
                  ...f,
                  faqs: f.faqs.map((v, n) =>
                    n === i ? { ...v, question: e.target.value } : v,
                  ),
                })
              }
            />
            <label className="field">
              <span>Answer</span>
              <textarea
                rows={3}
                required
                value={q.answer}
                onChange={(e) =>
                  setF({
                    ...f,
                    faqs: f.faqs.map((v, n) =>
                      n === i ? { ...v, answer: e.target.value } : v,
                    ),
                  })
                }
              />
            </label>
            <button
              type="button"
              className="btn tiny ghost"
              onClick={() =>
                setF({ ...f, faqs: f.faqs.filter((_, n) => n !== i) })
              }
            >
              Remove FAQ
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn ghost"
          onClick={() =>
            setF({ ...f, faqs: [...f.faqs, { question: "", answer: "" }] })
          }
        >
          <Plus size={16} />
          Add FAQ
        </button>
      </section>
      <Submit busy={a.busy}>Publish content</Submit>
    </form>
  );
}
export function AdminTickets() {
  const [page, setPage] = useState(1),
    [status, setStatus] = useState(""),
    r = useData(
      `/admin/tickets?page=${page}${status ? "&status=" + status : ""}`,
    );
  return (
    <>
      <PageHead
        title="The support inbox."
        description="Conversations that keep your members connected."
      />
      <section className="card">
        <div className="row between">
          <h2>Member tickets</h2>
          <select
            aria-label="Ticket status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All conversations</option>
            <option>open</option>
            <option>closed</option>
          </select>
        </div>
        <Load resource={r}>
          {(d) => (
            <>
              {d.items.length ? (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Member</th>
                        <th>Status</th>
                        <th>Date · PKT</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {d.items.map((t) => (
                        <tr key={t._id}>
                          <td>
                            <strong>{t.subject}</strong>
                            <small>{t.category}</small>
                          </td>
                          <td>
                            {t.user?.name}
                            <small>{t.user?.phone}</small>
                          </td>
                          <td>
                            <Badge status={t.status} />
                          </td>
                          <td>{date(t.createdAt)}</td>
                          <td>
                            <Link
                              className="btn tiny ghost"
                              to={`/admin/tickets/${t._id}`}
                            >
                              Open
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Empty title="No support conversations" />
              )}
              <Pager data={d} onPage={setPage} />
            </>
          )}
        </Load>
      </section>
    </>
  );
}
export function Reports() {
  const r = useData("/admin/reports");
  return (
    <>
      <PageHead
        title="A deeper financial perspective."
        description="Totals derived directly from the transaction ledger and purchase records."
      />
      <Load resource={r}>
        {(d) => (
          <>
            <section className="card">
              <h2>Plan obligations</h2>
              {d.purchases.length ? (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Purchases</th>
                        <th>Invested</th>
                        <th>Credited</th>
                        <th>Scheduled remaining</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d.purchases.map((p) => (
                        <tr key={p._id}>
                          <td>
                            <Badge status={p._id} />
                          </td>
                          <td>{p.count}</td>
                          <td>{money(p.purchased)}</td>
                          <td>{money(p.paid)}</td>
                          <td>{money(p.remaining)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Empty />
              )}
            </section>
            <section className="card">
              <h2>Ledger distributions</h2>
              {d.flow.length ? (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Source</th>
                        <th>Wallet</th>
                        <th>Direction</th>
                        <th>Count</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d.flow.map((x, i) => (
                        <tr key={i}>
                          <td>{title(x._id.kind)}</td>
                          <td>{title(x._id.wallet)}</td>
                          <td>{x._id.direction}</td>
                          <td>{x.count}</td>
                          <td>{money(x.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Empty />
              )}
            </section>
          </>
        )}
      </Load>
    </>
  );
}
export function AuditHistory() {
  const [page, setPage] = useState(1),
    r = useData(`/admin/audit?page=${page}`);
  return (
    <>
      <PageHead
        title="Administrative accountability."
        description="Append-only audit records for admin operations and actions performed through member access."
      />
      <section className="card">
        <Load resource={r}>
          {(d) => (
            <>
              {d.items.length ? (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Administrator</th>
                        <th>Action</th>
                        <th>Details</th>
                        <th>Date · PKT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d.items.map((x) => (
                        <tr key={x._id}>
                          <td>
                            {x.actor?.name}
                            <small>{x.actor?.email}</small>
                          </td>
                          <td>
                            <code>{x.action}</code>
                            {x.details?.impersonated && (
                              <Badge>On behalf of member</Badge>
                            )}
                          </td>
                          <td>
                            <small>
                              {Object.entries(x.details || {})
                                .filter(([k]) => k !== "impersonated")
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(" · ") ||
                                "Access or configuration operation"}
                            </small>
                          </td>
                          <td>{date(x.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Empty />
              )}
              <Pager data={d} onPage={setPage} />
            </>
          )}
        </Load>
      </section>
    </>
  );
}
