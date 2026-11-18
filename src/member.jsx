import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Users,
  Gift,
  Medal,
  LockKeyhole,
  Check,
  Copy,
  MessageCircle,
  TicketPercent,
  Sprout,
  Layers,
  Compass,
  Award,
  Building2,
  ShieldCheck,
  Gem,
  Crown,
  Clock,
  LifeBuoy,
  ChevronRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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
  Ledger,
  Empty,
  Field,
  Submit,
  formChange,
  Badge,
  Pager,
  Modal,
  SafeLink,
  title,
} from "./core";
import { PrivateImage } from "./layout";
const icons = {
  Sprout,
  BriefcaseBusiness,
  Layers,
  ChartNoAxesCombined,
  Compass,
  Award,
  Building2,
  ShieldCheck,
  Gem,
  Crown,
};
export function EarningsChart({ data, admin = false }) {
  return data?.length ? (
    <div className="chart">
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart
          data={data.map((d) => ({
            ...d,
            value: (d.total || 0) / 100,
            deposits: (d.deposits || 0) / 100,
            withdrawals: (d.withdrawals || 0) / 100,
          }))}
        >
          <defs>
            <linearGradient id="earningsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C0E44" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#7C0E44" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="4 5"
            vertical={false}
            stroke="#eadfe1"
          />
          <XAxis
            dataKey="_id"
            tickFormatter={(v) => v.slice(5)}
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={50}
          />
          <Tooltip
            formatter={(v, name) => [
              `$${Number(v).toLocaleString("en-US")}`,
              name,
            ]}
            contentStyle={{ borderRadius: 12, border: "1px solid #eadfe1" }}
          />
          <Area
            name={admin ? "Deposits" : "All earnings"}
            type="monotone"
            dataKey={admin ? "deposits" : "value"}
            stroke="#7C0E44"
            strokeWidth={3}
            fill="url(#earningsFill)"
          />
          {admin && (
            <Area
              name="Withdrawals (net reserved)"
              type="monotone"
              dataKey="withdrawals"
              stroke="#AA5E7A"
              fill="none"
              strokeWidth={2}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  ) : (
    <Empty
      title="Your story starts here"
      text="Actual recorded activity will appear in this chart. No activity has been recorded yet."
    />
  );
}
export function Overview() {
  const r = useData("/overview");
  return (
    <>
      <Load resource={r}>
        {(d) => {
          const rank = d.ranks.ranks.filter((x) => x.qualified).at(-1),
            next = d.ranks.ranks.find((x) => !x.qualified);
          return (
            <>
              <PageHead
                eyebrow="MEMBER WORKSPACE"
                title={`Good to see you, ${d.user.name?.split(" ")[0] || "Member"}.`}
                description="Here is a clear view of your wallets, plans and recent progress."
              />
              <div className="overview-grid">
                <section className="wallet-hero">
                  <div className="row between">
                    <span className="eyebrow">YOUR WALLETS</span>
                    <Wallet size={25} />
                  </div>
                  <span className="wallet-label">Withdrawable wallet</span>
                  <strong className="wallet-value">
                    {money(d.user.withdrawableBalance)}
                  </strong>
                  <small className="currency-equivalent">
                    ≈ {pkrFromUsd(d.user.withdrawableBalance)} · 1 USD = PKR 280
                  </small>
                  <p>
                    Profits, commissions and rewards available for withdrawal.
                  </p>
                  <div className="wallet-deposit">
                    <span>Deposit wallet</span>
                    <span className="wallet-balance">
                      <strong>{money(d.user.depositBalance)}</strong>
                      <small>≈ {pkrFromUsd(d.user.depositBalance)}</small>
                    </span>
                  </div>
                  <div className="row wrap">
                    <Link className="btn cream" to="/app/withdraw">
                      Withdraw
                      <ArrowUpRight size={17} />
                    </Link>
                    <Link className="btn light-outline" to="/app/deposit">
                      Add funds
                      <ArrowDownLeft size={17} />
                    </Link>
                  </div>
                </section>
                <section className="portfolio-feature">
                  <img
                    src="/images/platinum-portfolio.webp"
                    alt="Premium portfolio illustration"
                  />
                  <div>
                    <span className="eyebrow">BUILD WITH PERSPECTIVE</span>
                    <h2>
                      Your portfolio.
                      <br />
                      Your next chapter.
                    </h2>
                    <Link to="/app/my-plans" className="text-link">
                      View your plans
                      <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </section>
              </div>
              <Stats
                items={[
                  [
                    "All-time earnings",
                    money(d.totalEarnings),
                    ChartNoAxesCombined,
                  ],
                  ["Referral commissions", money(d.totalCommissions), Users],
                  ["Total invested", money(d.invested), BriefcaseBusiness],
                  ["Active purchases", d.activePlans, Layers],
                ]}
              />
              <div className="dashboard-columns">
                <section className="card">
                  <div className="row between">
                    <div>
                      <span className="eyebrow">THE LAST 30 DAYS</span>
                      <h2>Earnings overview</h2>
                    </div>
                    <Badge>All sources · USD</Badge>
                  </div>
                  <EarningsChart data={d.chart} />
                  <div className="earnings-breakdown">
                    {d.byKind.map((k) => (
                      <div key={k._id}>
                        <span>{title(k._id)}</span>
                        <strong>{money(k.total)}</strong>
                      </div>
                    ))}
                  </div>
                </section>
                <section className="card rank-summary">
                  <div className="rank-badge">
                    <Medal size={36} />
                  </div>
                  <span className="eyebrow">YOUR CURRENT RANK</span>
                  <h2>{rank?.name || "Your journey begins"}</h2>
                  <p>
                    {rank
                      ? "Your investment milestones are recognised here."
                      : "Purchase plans and grow your network to achieve your first milestone."}
                  </p>
                  {next && (
                    <>
                      <div className="row between">
                        <small>Next: {next.name}</small>
                        <small>
                          {Math.floor(
                            Math.min(
                              d.ranks.personal / next.personal,
                              d.ranks.team / next.team,
                              1,
                            ) * 100,
                          )}
                          %
                        </small>
                      </div>
                      <progress
                        value={Math.min(
                          d.ranks.personal / next.personal,
                          d.ranks.team / next.team,
                          1,
                        )}
                        max={1}
                      />
                    </>
                  )}
                  <Link to="/app/ranks" className="btn ghost">
                    View milestones
                    <ArrowUpRight size={16} />
                  </Link>
                </section>
              </div>
              <section className="card">
                <div className="row between">
                  <h2>Recent activity</h2>
                  <Link className="text-link" to="/app/activity">
                    View all
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
                <Ledger items={d.recent} />
              </section>
            </>
          );
        }}
      </Load>
    </>
  );
}
export function Plans() {
  const r = useData("/plans");
  return (
    <>
      <PageHead
        title="Investment plans"
        eyebrow="EXPLORE THE COLLECTION"
        description="Choose a plan, review its terms and grow your portfolio at your own pace."
      />
      <Load resource={r}>
        {(plans) => (
          <div className="plan-grid">
            {plans.map((p, i) => (
              <article className="plan-card" key={p._id}>
                <Link to={`/app/plans/${p._id}`}>
                  <div className="plan-image">
                    <img
                      src={p.image}
                      loading="lazy"
                      alt={`${p.name} investment illustration`}
                    />
                    <span className="plan-number">
                      COLLECTION / {String(i + 1).padStart(2, "0")}
                    </span>
                    <Badge status={p.locked ? "rejected" : undefined}>
                      {p.locked ? "Coming soon" : `${p.duration} days`}
                    </Badge>
                  </div>
                </Link>
                <div className="plan-body">
                  <h2>{p.name}</h2>
                  <p className="muted">
                    A considered step in your investment journey.
                  </p>
                  <span className="eyebrow">PLAN PRICE</span>
                  <strong className="plan-price">{money(p.price)}</strong>
                  <div className="plan-metrics">
                    <div>
                      <span>Daily payout</span>
                      <strong>{money(p.daily)}</strong>
                    </div>
                    <div>
                      <span>{p.duration}-day total</span>
                      <strong>{money(p.total)}</strong>
                    </div>
                  </div>
                  {p.locked ? (
                    <button className="btn ghost full" disabled>
                      Locked · Coming soon
                    </button>
                  ) : (
                    <Link to={`/app/plans/${p._id}`} className="btn ghost full">
                      Explore plan
                      <ArrowUpRight size={17} />
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </Load>
    </>
  );
}
export function PlanDetail() {
  const { id } = useParams(),
    r = useData(`/plans/${id}`),
    session = useSession(),
    a = useAction(),
    navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);
  return (
    <>
      <Link className="text-link" to="/app/plans">
        ← Back to plans
      </Link>
      <Load resource={r}>
        {(p) => (
          <>
            <PageHead
              eyebrow="PLAN OVERVIEW"
              title={p.name}
              description="Review the plan terms and available balance before purchasing."
            />
            <div className="detail-grid">
              <img className="detail-image" src={p.image} alt={p.name} />
              <section className="card">
                <span className="eyebrow">INVESTMENT SUMMARY</span>
                {p.locked && <Badge status="rejected">Coming soon</Badge>}
                <strong className="detail-price">{money(p.price)}</strong>
                <dl className="details-list">
                  <div>
                    <dt>Daily payout</dt>
                    <dd>{money(p.daily)}</dd>
                  </div>
                  <div>
                    <dt>Total payout</dt>
                    <dd>{money(p.total)}</dd>
                  </div>
                  <div>
                    <dt>Duration / payouts</dt>
                    <dd>
                      {p.duration} days / {p.duration}
                    </dd>
                  </div>
                  <div>
                    <dt>Purchase wallet</dt>
                    <dd>Deposited funds only</dd>
                  </div>
                  <div>
                    <dt>Available deposit balance</dt>
                    <dd>{money(session.user.depositBalance)}</dd>
                  </div>
                </dl>
                {p.locked && (
                  <p className="form-error">
                    This investment plan will be available soon.
                  </p>
                )}
                <button
                  className="btn full"
                  disabled={p.locked}
                  onClick={() => setConfirm(true)}
                >
                  {p.locked ? "Locked · Coming soon" : "Purchase this plan"}
                  {!p.locked && <ArrowUpRight size={17} />}
                </button>
              </section>
            </div>
            {confirm && (
              <Modal
                title="Confirm your purchase"
                onClose={() => !a.busy && setConfirm(false)}
              >
                <p>
                  You are purchasing <strong>{p.name}</strong> for{" "}
                  <strong>{money(p.price)}</strong> from your deposit wallet.
                </p>
                <button
                  className="btn"
                  disabled={a.busy}
                  onClick={() =>
                    a.run(
                      () =>
                        api("/purchases", {
                          method: "POST",
                          body: { planId: p._id },
                        }),
                      "Plan purchased",
                      async () => {
                        await session.refresh();
                        navigate("/app/my-plans");
                      },
                    )
                  }
                >
                  {a.busy ? "Processing…" : "Confirm purchase"}
                </button>
                <button
                  className="btn ghost"
                  disabled={a.busy}
                  onClick={() => setConfirm(false)}
                >
                  Cancel
                </button>
              </Modal>
            )}
          </>
        )}
      </Load>
    </>
  );
}
export function MyPlans() {
  const r = useData("/purchases");
  return (
    <>
      <PageHead
        title="Your portfolio."
        description="Every purchase retains its original price and payout terms."
      />
      <Load resource={r}>
        {(items) =>
          items.length ? (
            <div className="plan-grid">
              {items.map((p) => (
                <article className="card purchase-card" key={p._id}>
                  <img src={p.image} alt={p.name} />
                  <div className="row between">
                    <h2>{p.name}</h2>
                    <Badge status={p.status} />
                  </div>
                  <p>Purchased {date(p.createdAt)}</p>
                  <div className="plan-metrics">
                    <div>
                      <span>Invested</span>
                      <strong>{money(p.price)}</strong>
                    </div>
                    <div>
                      <span>Paid so far</span>
                      <strong>{money(p.paid)}</strong>
                    </div>
                  </div>
                  <progress value={p.creditedDays} max={p.duration} />
                  <div className="row between">
                    <small>
                      {p.creditedDays} / {p.duration} payouts
                    </small>
                    <small>{money(p.total)} total</small>
                  </div>
                  <p className="next-payout">
                    <Clock size={16} />
                    {p.nextCreditAt
                      ? `Next due ${date(p.nextCreditAt)}`
                      : "All payouts completed"}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="card">
              <Empty title="Your portfolio is ready for its first plan" />
              <Link className="btn" to="/app/plans">
                Explore plans
              </Link>
            </div>
          )
        }
      </Load>
    </>
  );
}
export function DepositPage() {
  const r = useData("/settings"),
    a = useAction();
  const [f, setF] = useState({ amount: "", method: "easypaisa", tid: "" }),
    [file, setFile] = useState(null);
  const nav = useNavigate(),
    change = formChange(setF);
  async function submit(e) {
    e.preventDefault();
    const body = new FormData();
    Object.entries(f).forEach(([k, v]) => body.append(k, v));
    if (file) body.append("screenshot", file);
    await a.run(
      () => api("/deposits", { method: "POST", body }),
      "Deposit submitted for review",
      () => nav("/app/deposits/history"),
    );
  }
  return (
    <>
      <PageHead
        title="Add funds with confidence."
        description="Deposit in USD · 1 USD = PKR 280"
      />
      <Load resource={r}>
        {(s) => (
          <div className="form-grid">
            <section className="card">
              <span className="eyebrow">STEP 01 / TRANSFER FUNDS</span>
              <h2>Your deposit destination</h2>
              <div className="payment-tabs">
                {["easypaisa", "jazzcash"].map((m) => (
                  <button
                    key={m}
                    className={f.method === m ? "selected" : ""}
                    onClick={() => setF({ ...f, method: m })}
                  >
                    {m === "easypaisa" ? "Easypaisa" : "JazzCash"}
                  </button>
                ))}
              </div>
              <div className="payment-account">
                <span>Account name</span>
                <strong>
                  {f.method === "easypaisa" ? s.accountName : s.jazzcashName}
                </strong>
                <span>Account number</span>
                <strong>
                  {f.method === "easypaisa"
                    ? s.accountNumber
                    : s.jazzcashNumber}
                </strong>
                <button
                  className="text-link"
                  onClick={() =>
                    a.run(
                      () =>
                        navigator.clipboard.writeText(
                          f.method === "easypaisa"
                            ? s.accountNumber
                            : s.jazzcashNumber,
                        ),
                      "Account number copied",
                    )
                  }
                >
                  <Copy size={16} />
                  Copy number
                </button>
              </div>
              <div className="notice">
                <ShieldCheck size={20} />
                <p>
                  Transfer first, then submit the exact amount and transaction
                  ID. Only approved payments enter your deposit wallet. Deposits
                  cannot be withdrawn or refunded through the withdrawal
                  feature.
                </p>
              </div>
            </section>
            <section className="card">
              <span className="eyebrow">STEP 02 / SUBMIT YOUR PROOF</span>
              <h2>Confirm your transfer</h2>
              <form onSubmit={submit}>
                <Field
                  label="Amount (USD)"
                  name="amount"
                  type="number"
                  min={3}
                  max={10000000}
                  step="0.01"
                  value={f.amount}
                  onChange={change}
                />
                {f.amount && (
                  <p className="currency-hint deposit-conversion">
                    Transfer <strong>{pkrFromUsd(Math.round(Number(f.amount) * 100))}</strong>
                    {" "}to receive <strong>{money(Math.round(Number(f.amount) * 100))}</strong> in your deposit wallet.
                  </p>
                )}
                <Field
                  label="Transaction ID"
                  name="tid"
                  value={f.tid}
                  onChange={change}
                  minLength={5}
                  maxLength={80}
                />
                <label className="field upload-field">
                  <span>Payment screenshot</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    required
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <small>PNG, JPEG or WebP · Maximum 5 MB</small>
                </label>
                <Submit busy={a.busy}>
                  Submit for verification
                  <ArrowUpRight size={17} />
                </Submit>
              </form>
            </section>
          </div>
        )}
      </Load>
    </>
  );
}
export function WithdrawPage() {
  const r = useData("/institutions"),
    a = useAction(),
    session = useSession(),
    nav = useNavigate();
  const [f, setF] = useState({
      amount: "",
      institution: "easypaisa",
      customInstitution: "",
      accountName: "",
      accountNumber: "",
    }),
    change = formChange(setF);
  return (
    <>
      <PageHead
        title="Request a withdrawal."
        description="Withdraw in USD, paid in PKR at 1 USD = PKR 280 · Minimum $1"
      />
      <div className="form-grid">
        <section className="wallet-hero">
          <span className="eyebrow">WITHDRAWABLE WALLET</span>
          <strong className="wallet-value">
            {money(session.user.withdrawableBalance)}
          </strong>
          <small className="currency-equivalent">
            ≈ {pkrFromUsd(session.user.withdrawableBalance)} · 1 USD = PKR 280
          </small>
          <p>
            Withdraw profits, referral commissions and rewards. Deposited funds
            are reserved for plan purchases.
          </p>
          <div className="notice dark">
            <Clock size={21} />
            <p>
              We reserve your requested amount immediately. An administrator
              sends the payment manually. A rejected request returns the
              reserved funds to this wallet.
            </p>
          </div>
          <Link className="btn light-outline" to="/app/withdrawals/history">
            Withdrawal history
            <ArrowUpRight size={17} />
          </Link>
        </section>
        <section className="card">
          <h2>Payment details</h2>
          <Load resource={r}>
            {(items) => (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  a.run(
                    () =>
                      api("/withdrawals", {
                        method: "POST",
                        body: { ...f, amount: Number(f.amount) },
                      }),
                    "Withdrawal requested",
                    async () => {
                      await session.refresh();
                      nav("/app/withdrawals/history");
                    },
                  );
                }}
              >
                <Field
                  label="Amount (USD)"
                  name="amount"
                  type="number"
                  min={1}
                  max={session.user.withdrawableBalance / 100}
                  step="0.01"
                  value={f.amount}
                  onChange={change}
                />
                {f.amount && (
                  <p className="currency-hint">
                    You will receive approximately {" "}
                    <strong>{pkrFromUsd(Math.round(Number(f.amount) * 100))}</strong>.
                  </p>
                )}
                <label className="field">
                  <span>Bank or wallet</span>
                  <select
                    name="institution"
                    value={f.institution}
                    onChange={change}
                  >
                    {items.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name}
                      </option>
                    ))}
                  </select>
                </label>
                {f.institution === "other" && (
                  <Field
                    label="Bank or wallet name"
                    name="customInstitution"
                    value={f.customInstitution}
                    onChange={change}
                    minLength={3}
                    maxLength={160}
                  />
                )}
                <Field
                  label="Account holder name"
                  name="accountName"
                  value={f.accountName}
                  onChange={change}
                />
                <Field
                  label="Account number / IBAN"
                  name="accountNumber"
                  value={f.accountNumber}
                  onChange={change}
                  minLength={6}
                  maxLength={40}
                />
                <p className="muted">
                  Check your payment details carefully before submitting.
                </p>
                <Submit busy={a.busy}>
                  Request payment
                  <ArrowUpRight size={17} />
                </Submit>
              </form>
            )}
          </Load>
        </section>
      </div>
    </>
  );
}
export function Records({ type = "activity" }) {
  const [page, setPage] = useState(1),
    [filter, setFilter] = useState("");
  const path = type === "activity" ? "transactions" : type;
  const r = useData(
    `/${path}?page=${page}${filter ? `&${["deposits", "withdrawals"].includes(type) ? "status" : "kind"}=${filter}` : ""}`,
  );
  const names = {
    activity: "Your account activity.",
    earnings: "Every source of earnings.",
    deposits: "Deposit history.",
    withdrawals: "Withdrawal history.",
  };
  return (
    <>
      <PageHead
        title={names[type]}
        description="Clear records, with timestamps shown in Pakistan time."
      />
      <section className="card records-card">
        <div className="row between">
          <h2>{title(type)}</h2>
          <select
            aria-label="Filter records"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All records</option>
            {(type === "deposits"
              ? ["pending", "approved", "rejected"]
              : type === "withdrawals"
                ? ["pending", "paid", "rejected"]
                : type === "earnings"
                  ? [
                      "earning",
                      "commission",
                      "rank_reward",
                      "code_reward",
                      "community_reward",
                    ]
                  : [
                      "deposit",
                      "purchase",
                      "earning",
                      "commission",
                      "withdrawal",
                      "refund",
                      "adjustment",
                      "rank_reward",
                      "code_reward",
                      "community_reward",
                    ]
            ).map((x) => (
              <option key={x} value={x}>
                {title(x)}
              </option>
            ))}
          </select>
        </div>
        <Load resource={r}>
          {(d) => (
            <>
              {["activity", "earnings"].includes(type) ? (
                <Ledger items={d.items} />
              ) : d.items.length ? (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Amount</th>
                        <th>
                          {type === "deposits"
                            ? "Method / transaction ID"
                            : "Bank or wallet / account"}
                        </th>
                        <th>Status</th>
                        <th>Review note</th>
                        <th>Date · PKT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d.items.map((x) => (
                        <tr key={x._id}>
                          <td data-label="Amount">
                            {type === "deposits" ? (
                              <>
                                <strong>{money(x.creditedAmount || Math.floor(x.amount / 280))}</strong>
                                <small>
                                  Transfer {pkr(x.amount)}
                                </small>
                              </>
                            ) : (
                              <>
                                <strong>{money(x.amount)}</strong>
                                <small>≈ {pkrFromUsd(x.amount)}</small>
                              </>
                            )}
                          </td>
                          <td data-label={type === "deposits" ? "Method / transaction ID" : "Account"}>
                            {title(
                              x.method || x.customInstitution || x.institution,
                            )}
                            <small>
                              {x.tid || `${x.accountName} · ${x.accountNumber}`}
                            </small>
                          </td>
                          <td data-label="Status">
                            <Badge status={x.status} />
                          </td>
                          <td data-label="Review note">{x.note || "Awaiting review"}</td>
                          <td data-label="Date">{date(x.createdAt)}</td>
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
export function Team() {
  const r = useData("/team"),
    session = useSession(),
    a = useAction();
  return (
    <>
      <PageHead
        title="Grow a connected network."
        description="Commissions apply to approved deposits across three referral levels."
      />
      <Load resource={r}>
        {(d) => {
          const invite = `${window.location.origin}/register?ref=${d.referralCode}`;
          return (
            <>
              <section className="invite-banner">
                <div>
                  <span className="eyebrow">YOUR PERSONAL INVITATION</span>
                  <h2>A connection starts with you.</h2>
                  <p>
                    Referral code: <strong>{d.referralCode}</strong>
                  </p>
                  <code>{invite}</code>
                </div>
                <button
                  className="btn cream"
                  onClick={() =>
                    a.run(
                      () => navigator.clipboard.writeText(invite),
                      "Invitation link copied",
                    )
                  }
                >
                  <Copy size={17} />
                  Copy invite link
                </button>
              </section>
              <Stats
                items={[
                  ["Total referral earnings", money(d.totalCommissions), Users],
                  ...d.levels.map((l) => [
                    `Level ${l.level} · ${l.rate}%`,
                    l.count,
                    Users,
                  ]),
                ]}
              />
              {d.levels.map((l) => (
                <section className="card" key={l.level}>
                  <div className="row between">
                    <h2>Level {l.level}</h2>
                    <Badge>{l.rate}% deposit commission</Badge>
                  </div>
                  {l.members.length ? (
                    <div className="member-list">
                      {l.members.map((m) => (
                        <div className="row" key={m._id}>
                          <span className="avatar">{m.name[0]}</span>
                          <div>
                            <strong>{m.name}</strong>
                            <small>Joined {date(m.createdAt)}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Empty
                      title="Your network is taking shape"
                      text="Members at this referral level will appear here."
                    />
                  )}
                </section>
              ))}
            </>
          );
        }}
      </Load>
    </>
  );
}
export function Ranks() {
  const r = useData("/ranks"),
    a = useAction(),
    session = useSession();
  return (
    <>
      <PageHead
        title="Investor milestones."
        description="Lifetime plan purchases. Three referral levels. Each achievement recognised once."
      />
      <Load resource={r}>
        {(d) => {
          const current = d.ranks.filter((x) => x.qualified).at(-1);
          return (
            <>
              <section className="milestone-hero">
                <div>
                  <span className="eyebrow">YOUR CURRENT RANK</span>
                  <h2>{current?.name || "Your next chapter awaits."}</h2>
                  <p>
                    Both personal and team targets must be met to unlock a rank.
                  </p>
                </div>
                <Medal size={76} />
              </section>
              <Stats
                items={[
                  ["Personal investment", money(d.personal), BriefcaseBusiness],
                  ["Team investment · Levels 1–3", money(d.team), Users],
                ]}
              />
              <div className="rank-grid">
                {d.ranks.map((rank) => {
                  const I = icons[rank.icon] || Medal;
                  return (
                    <article
                      key={rank._id}
                      className={`card rank-card ${rank.qualified ? "unlocked" : ""}`}
                    >
                      <div className="row between">
                        <span className="rank-icon">
                          <I size={30} />
                        </span>
                        <Badge>
                          RANK {String(rank.level).padStart(2, "0")}
                        </Badge>
                      </div>
                      <h2>{rank.name}</h2>
                      {[
                        ["Personal", d.personal, rank.personal],
                        ["Team", d.team, rank.team],
                      ].map(([label, value, total]) => (
                        <div className="rank-progress" key={label}>
                          <div className="row between">
                            <span>{label}</span>
                            <strong>{money(total)}</strong>
                          </div>
                          <progress
                            value={Math.min(value, total)}
                            max={total}
                          />
                          <small>
                            {Math.min(100, (value / total) * 100).toFixed(1)}%
                            complete
                          </small>
                        </div>
                      ))}
                      <div className="rank-reward">
                        <div>
                          <span>ONE-TIME REWARD</span>
                          <strong>{money(rank.reward)}</strong>
                        </div>
                        <button
                          className={`btn ${rank.claimed || !rank.qualified ? "ghost" : ""}`}
                          disabled={a.busy || rank.claimed || !rank.qualified}
                          onClick={() =>
                            a.run(
                              () =>
                                api(`/ranks/${rank._id}/claim`, {
                                  method: "POST",
                                }),
                              "Milestone reward credited",
                              async () => {
                                r.reload();
                                await session.refresh();
                              },
                            )
                          }
                        >
                          {rank.claimed ? (
                            <>
                              <Check size={16} />
                              Claimed
                            </>
                          ) : rank.qualified ? (
                            "Claim reward"
                          ) : (
                            <>
                              <LockKeyhole size={16} />
                              Locked
                            </>
                          )}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          );
        }}
      </Load>
    </>
  );
}
export function CommunityReward() {
  const r = useData("/community"),
    s = useData("/settings"),
    a = useAction(),
    [file, setFile] = useState(null);
  return (
    <>
      <PageHead
        title="Join the conversation."
        description="Follow the official StockXEarn WhatsApp channel and submit your proof once."
      />
      <div className="form-grid">
        <section className="community-art">
          <MessageCircle size={50} />
          <span className="eyebrow">COMMUNITY REWARD</span>
          <h2>
            Stay connected.
            <br />
            Earn $0.10.
          </h2>
          <p>
            Join our official channel, then upload a screenshot showing that you
            follow it. Your reward is credited after administrator approval.
          </p>
          <a
            className="btn cream"
            href={s.data?.channelLink || "#"}
            target="_blank"
            rel="noreferrer"
          >
            Open official channel
            <ArrowUpRight size={18} />
          </a>
        </section>
        <section className="card">
          <h2>Your one-time submission</h2>
          <div className="notice">
            <ShieldCheck size={21} />
            <p>
              Only one attempt is allowed. Rejected submissions are permanently
              locked. Approval credits $0.10 to your withdrawable balance;
              withdrawal rules still apply.
            </p>
          </div>
          <Load resource={r}>
            {(d) =>
              d ? (
                <div className="submission-result">
                  <Badge status={d.status} />
                  <h3>
                    {d.status === "approved"
                      ? "Your $0.10 reward was credited"
                      : d.status === "rejected"
                        ? "This reward is permanently locked"
                        : "Your screenshot is under review"}
                  </h3>
                  <p>
                    {d.note || "Check back for the administrator’s decision."}
                  </p>
                  <small>Submitted {date(d.createdAt)}</small>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const body = new FormData();
                    if (file) body.append("screenshot", file);
                    a.run(
                      () => api("/community", { method: "POST", body }),
                      "Screenshot submitted",
                      r.reload,
                    );
                  }}
                >
                  <label className="field upload-field">
                    <span>Screenshot showing channel membership</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      required
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                    <small>PNG, JPEG or WebP · Up to 5 MB</small>
                  </label>
                  <Submit busy={a.busy}>Submit my only attempt</Submit>
                </form>
              )
            }
          </Load>
        </section>
      </div>
    </>
  );
}
export function RewardCodes() {
  const [code, setCode] = useState(""),
    [page, setPage] = useState(1),
    r = useData(`/reward-codes/history?page=${page}`),
    a = useAction(),
    session = useSession();
  return (
    <>
      <PageHead
        title="A little extra, unlocked."
        eyebrow="STOCKXEARN / REWARD CODES"
        description="Codes are available to all members. Claims are first come, first served."
      />
      <section className="card redeem-card">
        <span className="rank-icon">
          <TicketPercent size={32} />
        </span>
        <h2>Have a Reward Code?</h2>
        <p>
          Enter it below. Each code can be redeemed once per member, while its
          total claim limit remains available.
        </p>
        <form
          className="row wrap"
          onSubmit={(e) => {
            e.preventDefault();
            a.run(
              () =>
                api("/reward-codes/redeem", { method: "POST", body: { code } }),
              "Reward credited",
              async () => {
                setCode("");
                r.reload();
                await session.refresh();
              },
            );
          }}
        >
          <input
            aria-label="Reward code"
            placeholder="Enter your code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            minLength={3}
            maxLength={40}
            required
          />
          <Submit busy={a.busy}>
            Redeem code
            <ArrowUpRight size={17} />
          </Submit>
        </form>
      </section>
      <section className="card">
        <h2>Your redeemed rewards</h2>
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
                        <th>Claimed · PKT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d.items.map((x) => (
                        <tr key={x._id}>
                          <td>
                            <strong className="reward-code-value">
                              {x.code?.code || "Code unavailable"}
                            </strong>
                          </td>
                          <td>{money(x.amount)}</td>
                          <td>{date(x.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Empty title="No codes redeemed yet" />
              )}
              <Pager data={d} onPage={setPage} />
            </>
          )}
        </Load>
      </section>
    </>
  );
}
export function Profile() {
  const s = useSession(),
    a = useAction(),
    [name, setName] = useState(s.user.name);
  return (
    <>
      <PageHead title="Your personal profile." />
      <section className="card narrow">
        <div className="profile-heading">
          <span className="avatar large">
            {s.user.avatar ? (
              <PrivateImage path={s.user.avatar} alt="Your profile photo" />
            ) : (
              s.user.name[0]
            )}
          </span>
          <div>
            <h2>{s.user.name}</h2>
            <p>Member since {date(s.user.createdAt)}</p>
          </div>
        </div>
        <label className="field upload-field">
          <span>Profile photo</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            disabled={a.busy}
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              const body = new FormData();
              body.append("avatar", file);
              a.run(
                () => api("/me/avatar", { method: "POST", body }),
                "Profile photo updated",
                s.refresh,
              );
            }}
          />
          <small>PNG, JPEG or WebP · Up to 5 MB</small>
        </label>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            a.run(
              () => api("/me", { method: "PATCH", body: { name } }),
              "Profile saved",
              s.refresh,
            );
          }}
        >
          <Field
            label="Full name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Field
            label="Registered mobile number"
            name="phone"
            value={s.user.phone || s.user.email}
            onChange={() => {}}
            disabled
          />
          <p className="muted">
            Only an administrator can change your registered mobile number.
            Contact support to request a change.
          </p>
          <Field
            label="Referral code"
            value={s.user.referralCode}
            onChange={() => {}}
            disabled
          />
          <Submit busy={a.busy} />
        </form>
      </section>
    </>
  );
}
export function Security() {
  const s = useSession(),
    a = useAction(),
    navigate = useNavigate();
  const [f, setF] = useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }),
    change = formChange(setF);
  return (
    <>
      <PageHead
        title={
          s.user.mustChangePassword
            ? "Choose a new password."
            : "Keep your account secure."
        }
        description={
          s.user.mustChangePassword
            ? "Your temporary password must be replaced before you can continue."
            : "Use a unique password of at least 10 characters."
        }
      />
      <section className="card narrow">
        {s.user.impersonating ? (
          <p>
            Use the admin password reset function to manage a member’s password.
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              a.run(
                async () => {
                  if (f.newPassword !== f.confirmPassword)
                    throw Error("New passwords do not match");
                  return api("/me/password", {
                    method: "POST",
                    body: {
                      currentPassword: f.currentPassword,
                      newPassword: f.newPassword,
                    },
                  });
                },
                "Password updated",
                (d) => {
                  s.login(d);
                  setF({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                  navigate(d.user.role === "admin" ? "/admin" : "/app");
                },
              );
            }}
          >
            <Field
              label={
                s.user.mustChangePassword
                  ? "Temporary password"
                  : "Current password"
              }
              name="currentPassword"
              type="password"
              value={f.currentPassword}
              onChange={change}
              autoComplete="current-password"
            />
            <Field
              label="New password"
              name="newPassword"
              type="password"
              value={f.newPassword}
              onChange={change}
              minLength={10}
              maxLength={128}
              autoComplete="new-password"
            />
            <Field
              label="Confirm new password"
              name="confirmPassword"
              type="password"
              value={f.confirmPassword}
              onChange={change}
              minLength={10}
              autoComplete="new-password"
            />
            <Submit busy={a.busy}>Update password</Submit>
          </form>
        )}
      </section>
    </>
  );
}
export function Notifications() {
  const r = useData("/notifications"),
    a = useAction();
  return (
    <>
      <PageHead
        title="Your latest updates."
        action={
          <button
            className="btn ghost"
            disabled={a.busy}
            onClick={() =>
              a.run(
                () => api("/notifications/read", { method: "POST" }),
                "Marked as read",
                r.reload,
              )
            }
          >
            Mark all as read
          </button>
        }
      />
      <section className="card">
        <Load resource={r}>
          {(d) =>
            d.items.length ? (
              <div className="notification-list">
                {d.items.map((n) => (
                  <Link to={n.link || "/app/activity"} key={n._id}>
                    <span className="mini-icon">
                      <Gift size={19} />
                    </span>
                    <div>
                      <strong>{n.title}</strong>
                      <p>{n.body}</p>
                      <small>{date(n.createdAt)}</small>
                    </div>
                    <ChevronRight size={17} />
                  </Link>
                ))}
              </div>
            ) : (
              <Empty title="You’re all caught up" />
            )
          }
        </Load>
      </section>
    </>
  );
}
export function Support() {
  const [page, setPage] = useState(1),
    r = useData(`/tickets?page=${page}`),
    s = useData("/settings"),
    a = useAction(),
    navigate = useNavigate();
  const [f, setF] = useState({ subject: "", category: "account", message: "" }),
    change = formChange(setF);
  return (
    <>
      <PageHead
        title="A real conversation starts here."
        description="Contact us on WhatsApp or keep your support conversation in a ticket."
        action={
          <a
            className="btn"
            href={`https://wa.me/${(s.data?.supportPhone || "").replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={17} />
            WhatsApp support
          </a>
        }
      />
      <div className="form-grid">
        <section className="card">
          <h2>Open a support ticket</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              a.run(
                () => api("/tickets", { method: "POST", body: f }),
                "Support ticket opened",
                (d) => navigate(`/app/support/${d._id}`),
              );
            }}
          >
            <Field
              label="Subject"
              name="subject"
              value={f.subject}
              onChange={change}
            />
            <label className="field">
              <span>Category</span>
              <select name="category" value={f.category} onChange={change}>
                {["account", "deposit", "withdrawal", "plan", "other"].map(
                  (x) => (
                    <option key={x}>{x}</option>
                  ),
                )}
              </select>
            </label>
            <label className="field">
              <span>How can we help?</span>
              <textarea
                name="message"
                required
                minLength={5}
                maxLength={4000}
                rows={5}
                value={f.message}
                onChange={change}
              />
            </label>
            <Submit busy={a.busy}>Send to support</Submit>
          </form>
        </section>
        <section className="card">
          <h2>Your conversations</h2>
          <Load resource={r}>
            {(d) => (
              <>
                {d.items.length ? (
                  <div className="ticket-list">
                    {d.items.map((t) => (
                      <Link key={t._id} to={`/app/support/${t._id}`}>
                        <div>
                          <strong>{t.subject}</strong>
                          <small>{date(t.createdAt)}</small>
                        </div>
                        <Badge status={t.status} />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Empty title="No conversations yet" />
                )}
                <Pager data={d} onPage={setPage} />
              </>
            )}
          </Load>
        </section>
      </div>
    </>
  );
}
export function TicketThread({ admin = false }) {
  const { id } = useParams(),
    base = admin ? "/admin/tickets" : "/tickets",
    r = useData(`${base}/${id}`),
    a = useAction(),
    [message, setMessage] = useState("");
  return (
    <>
      <PageHead title="Support conversation." />
      <Load resource={r}>
        {(t) => (
          <section className="card narrow">
            <div className="row between">
              <h2>{t.subject}</h2>
              <Badge status={t.status} />
            </div>
            {admin && (
              <p>
                Member: {t.user?.name} · {t.user?.phone}
              </p>
            )}
            <div className="thread">
              {t.messages.map((m, i) => (
                <article
                  className={m.role === "admin" ? "admin-message" : ""}
                  key={i}
                >
                  <div className="row between">
                    <strong>
                      {m.role === "admin" ? "StockXEarn support" : "Member"}
                    </strong>
                    <small>{date(m.createdAt)}</small>
                  </div>
                  <p>{m.body}</p>
                </article>
              ))}
            </div>
            {t.status === "open" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  a.run(
                    () =>
                      api(`${base}/${id}/replies`, {
                        method: "POST",
                        body: { message },
                      }),
                    "Reply sent",
                    () => {
                      setMessage("");
                      r.reload();
                    },
                  );
                }}
              >
                <label className="field">
                  <span>Your reply</span>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    maxLength={4000}
                  />
                </label>
                <Submit busy={a.busy}>Send reply</Submit>
              </form>
            )}
            {admin && (
              <button
                className="btn ghost"
                disabled={a.busy}
                onClick={() =>
                  a.run(
                    () =>
                      api(`${base}/${id}`, {
                        method: "PATCH",
                        body: {
                          status: t.status === "open" ? "closed" : "open",
                        },
                      }),
                    "Ticket updated",
                    r.reload,
                  )
                }
              >
                {t.status === "open"
                  ? "Close conversation"
                  : "Reopen conversation"}
              </button>
            )}
          </section>
        )}
      </Load>
    </>
  );
}
export function FAQ() {
  const r = useData("/content");
  return (
    <>
      <PageHead
        eyebrow="HELP & GUIDANCE"
        title="Questions, answered clearly."
        description="Find quick answers about plans, payments, rewards and account support."
      />
      <section className="card faq-list-card">
        <Load resource={r}>
          {(d) =>
            d.faqs.map((f, i) => (
              <details className="member-faq" key={i}>
                <summary>
                  {f.question}
                  <span>+</span>
                </summary>
                <p>{f.answer}</p>
              </details>
            ))
          }
        </Load>
      </section>
    </>
  );
}
