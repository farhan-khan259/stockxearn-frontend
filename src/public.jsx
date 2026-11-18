import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  Layers,
  ChartNoAxesCombined,
  Wallet,
  Users,
  MessageCircle,
  Menu,
  X,
  LockKeyhole,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  api,
  useData,
  useSession,
  useAction,
  Field,
  Submit,
  formChange,
} from "./core";
export function Brand({ light = false }) {
  return (
    <Link
      to="/"
      className={`brand ${light ? "light" : ""}`}
      aria-label="StockXEarn home"
    >
      <img
        className="brand-logo"
        src="/images/logo-transparent.webp"
        alt="StockXEarn"
      />
    </Link>
  );
}
const educational = [
  [
    "Equity, explained",
    "A stock represents a share of ownership in a company. Its value can rise or fall with business performance, market conditions and investor expectations.",
    ChartNoAxesCombined,
  ],
  [
    "Two paths to returns",
    "Stock investors may receive dividends or sell shares for a capital gain. Neither happens automatically, and both depend on the investment and prevailing conditions.",
    Layers,
  ],
  [
    "Risk belongs in the picture",
    "Diversification can reduce concentration risk, but it cannot eliminate losses. Understand the operator, the terms and your financial capacity before committing funds.",
    ShieldCheck,
  ],
];
export function Home() {
  const [menu, setMenu] = useState(false);
  const c = useData("/public/content");
  const s = useData("/public/settings");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.08 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return (
    <div className="public-site">
      <div className="top-strip">
        A thoughtful perspective. A more connected workspace.
      </div>
      <header className="public-header">
        <Brand />
        <nav className={menu ? "open" : ""}>
          <a href="#about" onClick={() => setMenu(false)}>
            About StockXEarn
          </a>
          <a href="#markets" onClick={() => setMenu(false)}>
            Market essentials
          </a>
          <a href="#experience" onClick={() => setMenu(false)}>
            The experience
          </a>
          <a href="#questions" onClick={() => setMenu(false)}>
            FAQs
          </a>
        </nav>
        <div className="row">
          <Link to="/login" className="login-link">
            Sign in
          </Link>
          <Link to="/register" className="btn small">
            Get started
            <ArrowUpRight size={16} />
          </Link>
          <button
            className="mobile-menu icon-btn"
            aria-label="Toggle navigation"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">
              <i /> STOCKXEARN / A NEW PERSPECTIVE
            </span>
            <h1>
              {c.data?.heroTitle ||
                "A considered approach to your financial future."}
            </h1>
            <p>
              {c.data?.heroSubtitle ||
                "Meet StockXEarn. A privately operated investment platform with a clear member workspace, transparent records, and personal support."}
            </p>
            <div className="row wrap">
              <Link className="btn" to="/register">
                Discover your workspace
                <ArrowUpRight size={18} />
              </Link>
              <a className="text-link" href="#about">
                Get to know StockXEarn
                <ArrowRight size={17} />
              </a>
            </div>
            <div className="hero-foot">
              <span>
                <ShieldCheck size={17} />
                Clear account records
              </span>
              <span>
                <MessageCircle size={17} />
                Personal support
              </span>
            </div>
          </div>
          <div className="hero-art">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <img
              src="/images/hero.webp"
              alt="Burgundy financial architecture with a sculptural market bull"
              fetchPriority="high"
            />
            <div className="floating-card">
              <span className="mini-icon">
                <ChartNoAxesCombined />
              </span>
              <div>
                <small>YOUR NEXT CHAPTER</small>
                <strong>Clarity starts here.</strong>
              </div>
            </div>
            <div className="art-caption">
              A broader perspective on the world of investing.
            </div>
          </div>
        </section>
        <div className="brand-band">
          <span>BUILT AROUND WHAT MATTERS</span>
          <strong>Clarity.</strong>
          <strong>Connection.</strong>
          <strong>Perspective.</strong>
          <strong>Accountability.</strong>
        </div>
        <section id="about" className="public-section split reveal">
          <div className="editorial-image">
            <img
              src="/images/market-leader.webp"
              loading="lazy"
              alt="Modern financial district architecture"
            />
            <div className="image-label">
              StockXEarn <span>/ Our approach</span>
            </div>
          </div>
          <div>
            <span className="eyebrow">GET TO KNOW STOCKXEARN</span>
            <h2>
              A personal approach.
              <br />
              <em>A connected experience.</em>
            </h2>
            <p>
              StockXEarn brings your investment activity, records and community
              into one carefully designed member workspace.
            </p>
            <p>
              The platform is privately operated. The operator personally
              invests funds and manages the listed payout arrangements. Members
              can review the available plans and their terms after signing in.
            </p>
            <div className="feature-line">
              <Wallet />
              <div>
                <h3>Separate, transparent wallets</h3>
                <p>
                  Keep funds reserved for plan purchases separate from earnings
                  and rewards.
                </p>
              </div>
            </div>
            <div className="feature-line">
              <Users />
              <div>
                <h3>A community with a clear structure</h3>
                <p>
                  Track your referral network, milestones and support
                  conversations in one place.
                </p>
              </div>
            </div>
            <Link to="/login" className="text-link">
              Explore the member experience
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </section>
        <section id="markets" className="public-section education reveal">
          <div className="section-heading">
            <span className="eyebrow">MARKET ESSENTIALS</span>
            <h2>
              Understand the market.
              <br />
              <em>See the bigger picture.</em>
            </h2>
            <p>
              A little knowledge gives you a better starting point. These are
              general market concepts, not a forecast of StockXEarn payouts.
            </p>
          </div>
          <div className="three-col">
            {educational.map(([h, p, I], i) => (
              <article className="education-card" key={h}>
                <div className="row between">
                  <I size={28} />
                  <span className="index">0{i + 1}</span>
                </div>
                <h3>{h}</h3>
                <p>{p}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="public-section perspective reveal">
          <img
            src="/images/exchange-elite.webp"
            loading="lazy"
            alt="An artistic stock exchange interior"
          />
          <div>
            <span className="eyebrow">PERSPECTIVE OVER NOISE</span>
            <h2>
              Markets move.
              <br />
              Understanding matters.
            </h2>
            <p>
              Prices react to company results, economic conditions and changing
              expectations. Short-term movement does not tell the whole story.
              Take time to understand what you are participating in.
            </p>
            <a href="#questions" className="btn cream">
              Know before you begin
              <ArrowUpRight size={18} />
            </a>
          </div>
        </section>
        <section id="experience" className="public-section reveal">
          <div className="section-heading">
            <span className="eyebrow">YOUR MEMBER EXPERIENCE</span>
            <h2>
              Everything in view.
              <br />
              <em>Every step connected.</em>
            </h2>
          </div>
          <div className="three-col steps">
            {[
              [
                "Create your account",
                "Register with your mobile number and a valid referral code. Review the terms before joining.",
              ],
              [
                "Review your options",
                "Sign in to see the full plan details, payout schedule and funding instructions.",
              ],
              [
                "Stay informed",
                "Follow your records, review notifications and connect with our support team.",
              ],
            ].map(([h, p], i) => (
              <article key={h}>
                <span className="step-num">0{i + 1}</span>
                <h3>{h}</h3>
                <p>{p}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="risk-section public-section reveal">
          <ShieldCheck size={32} />
          <div>
            <span className="eyebrow">AN INFORMED DECISION</span>
            <h2>Know the risks. Read the terms.</h2>
            <p>
              Investing involves risk, including possible loss of funds. Stock
              market gains are not guaranteed. Listed plan payouts are
              arrangements managed by the operator, not verified exchange
              returns or broker-backed guarantees. Consider market risk,
              operator payment risk and your ability to bear a loss.
            </p>
            <Link to="/terms" className="text-link">
              Read participation terms
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </section>
        <section id="questions" className="public-section faq-section reveal">
          <div>
            <span className="eyebrow">A LITTLE MORE CLARITY</span>
            <h2>
              Good questions.
              <br />
              <em>Clear answers.</em>
            </h2>
            <p>Need a personal answer? Our support team is a message away.</p>
            <a
              className="text-link"
              href={`https://wa.me/${(s.data?.supportPhone || "+923379092183").replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
            >
              Talk to support
              <ArrowUpRight size={17} />
            </a>
          </div>
          <div>
            {[
              [
                "What is StockXEarn?",
                "A privately operated platform for viewing investment plans, managing account activity and connecting with support. The operator personally invests funds and manages payouts.",
              ],
              [
                "Where can I see plan details?",
                "Full plan prices, payout schedules and totals are visible after you log in. Review those terms before purchasing a plan.",
              ],
              [
                "Does joining require a referral?",
                "Yes. A valid referral code is required to create an account.",
              ],
              [
                "Are stock market returns guaranteed?",
                "No. Markets can fall as well as rise. The educational content and market-inspired artwork on this website do not establish future investment performance.",
              ],
              [
                "How can I get help?",
                "Contact our team on WhatsApp. Registered members can also open support tickets inside their account.",
              ],
            ].map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <span>+</span>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="closing public-section reveal">
          <span className="eyebrow">YOUR NEXT STEP</span>
          <h2>
            A clearer view starts
            <br />
            with a closer look.
          </h2>
          <Link className="btn cream" to="/register">
            Create your account
            <ArrowUpRight size={18} />
          </Link>
        </section>
      </main>
      <footer className="public-footer">
        <Brand />
        <p>Privately operated. Thoughtfully connected.</p>
        <div className="row wrap">
          <Link to="/terms">Terms & conditions</Link>
          <Link to="/privacy">Privacy</Link>
        </div>
        <small>
          © {new Date().getFullYear()} StockXEarn. Investing involves risk.
          Illustrations are conceptual.
        </small>
      </footer>
    </div>
  );
}
export function Auth({ register = false, admin = false }) {
  const [search] = useSearchParams();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: search.get("ref") || "",
    terms: false,
  });
  const [show, setShow] = useState(false);
  const session = useSession(),
    action = useAction(),
    navigate = useNavigate();
  const change = formChange(setForm);
  async function submit(e) {
    e.preventDefault();
    await action.run(
      () =>
        api(register ? "/auth/register" : "/auth/login", {
          method: "POST",
          body: register
            ? form
            : admin
              ? { email: form.email, password: form.password, admin: true }
              : { phone: form.phone, password: form.password },
        }),
      register ? "Welcome to StockXEarn" : null,
      (d) => {
        session.login(d);
        navigate(d.user.role === "admin" ? "/admin" : "/app");
      },
    );
  }
  return (
    <div className="auth-page">
      <aside className="auth-art">
        <Brand />
        <img src="/images/hero.webp" alt="StockXEarn financial architecture" />
        <div>
          <span className="eyebrow">A CLEARER FINANCIAL PERSPECTIVE</span>
          <h1>
            Grow with clarity.
            <br />
            <em>Invest with confidence.</em>
          </h1>
          <p>
            Manage plans, deposits, earnings and rewards from one refined workspace.
          </p>
          <div className="auth-art-trust">
            <span><ShieldCheck size={16} /> Secure access</span>
            <span><Wallet size={16} /> Clear records</span>
          </div>
        </div>
        <small>Financial participation involves risk. Review the terms before continuing.</small>
      </aside>
      <div className="auth-form">
        <div className="auth-inner">
          <div className="auth-mobile-brand">
            <Brand />
          </div>
          <span className="eyebrow">
            {admin
              ? "ADMINISTRATION"
              : register
                ? "WELCOME TO STOCKXEARN"
                : "YOUR MEMBER WORKSPACE"}
          </span>
          <h1>
            {admin
              ? "Administrator access"
              : register
                ? "Begin your next chapter."
                : "Welcome back."}
          </h1>
          <p>
            {register
              ? "Create your account with a valid referral code."
              : admin
                ? "Sign in with your administrator email."
                : "Sign in to see your complete financial workspace."}
          </p>
          <form onSubmit={submit}>
            {register && (
              <Field
                label="Full name"
                name="name"
                value={form.name}
                onChange={change}
                autoComplete="name"
                maxLength={160}
                placeholder="Enter your full name"
              />
            )}
            <Field
              label={admin ? "Admin email" : "Mobile number"}
              name={admin ? "email" : "phone"}
              type={admin ? "email" : "tel"}
              value={admin ? form.email : form.phone}
              onChange={change}
              autoComplete={admin ? "username" : "tel"}
              placeholder={admin ? "admin@stockxearn.site" : "03XXXXXXXXX"}
            />
            <div className="password-wrap">
              <Field
                label="Password"
                name="password"
                type={show ? "text" : "password"}
                value={form.password}
                onChange={change}
                minLength={register ? 10 : 1}
                maxLength={128}
                autoComplete={register ? "new-password" : "current-password"}
                placeholder={register ? "Create a strong password" : "Enter your password"}
              />
              <button
                type="button"
                className="password-toggle"
                aria-label={show ? "Hide password" : "Show password"}
                onClick={() => setShow(!show)}
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {register && (
              <>
                <Field
                  label="Confirm password"
                  name="confirmPassword"
                  type={show ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={change}
                  minLength={10}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                />
                <Field
                  label="Referral code"
                  name="referralCode"
                  value={form.referralCode}
                  onChange={change}
                  maxLength={24}
                  placeholder="Enter referral code"
                />
                <label className="check-label">
                  <input
                    type="checkbox"
                    name="terms"
                    checked={form.terms}
                    onChange={change}
                    required
                  />
                  <span>
                    I accept the{" "}
                    <Link to="/terms" target="_blank">
                      Terms & Conditions
                    </Link>{" "}
                    and have read the{" "}
                    <Link to="/privacy" target="_blank">
                      Privacy Notice
                    </Link>
                    .
                  </span>
                </label>
              </>
            )}
            {action.error && (
              <p className="form-error" role="alert">
                {action.error}
              </p>
            )}
            <Submit busy={action.busy}>
              {register ? (
                "Create account"
              ) : (
                <>
                  <LockKeyhole size={17} />
                  Sign in
                </>
              )}
            </Submit>
          </form>
          {!admin && (
            <>
              <p className="auth-switch">
                {register ? "Already a member?" : "New to StockXEarn?"}{" "}
                <Link to={register ? "/login" : "/register"}>
                  {register ? "Sign in" : "Create account"}
                </Link>
              </p>
              {!register && (
                <Link to="/forgot-password" className="text-link">
                  Forgot your password?
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export function Forgot() {
  const s = useData("/public/settings");
  return (
    <div className="auth-page recovery-page">
      <aside className="auth-art">
        <Brand />
        <img src="/images/hero.webp" alt="StockXEarn account recovery" />
        <div>
          <span className="eyebrow">ACCOUNT RECOVERY</span>
          <h1>
            Secure access.
            <br />
            <em>Restored safely.</em>
          </h1>
          <p>
            Our support team verifies ownership before account access is restored.
          </p>
        </div>
        <small>Never share passwords or banking PINs with support.</small>
      </aside>
      <div className="auth-form">
        <div className="auth-inner recovery-inner">
          <div className="auth-mobile-brand">
            <Brand />
          </div>
          <span className="eyebrow">PASSWORD RECOVERY</span>
          <h1>Let’s get you back in.</h1>
          <p>
            Contact support from your registered number. After verifying account
            ownership, an administrator can provide a temporary password.
          </p>
          <a
            className="btn recovery-button"
            href={`https://wa.me/${(s.data?.supportPhone || "+923379092183").replace(/\D/g, "")}?text=I%20need%20help%20resetting%20my%20StockXEarn%20password`}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={18} />
            Contact support
          </a>
          <p className="auth-switch">
            Remembered your password? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
export function Legal({ privacy = false }) {
  return (
    <div className="legal-page">
      <Brand />
      <article className="card">
        <span className="eyebrow">STOCKXEARN / PARTICIPATION INFORMATION</span>
        <h1>{privacy ? "Privacy notice" : "Terms & conditions"}</h1>
        {privacy ? (
          <>
            <h2>Your information</h2>
            <p>
              StockXEarn stores your name, mobile number, password hash,
              referral relationships, wallet records, payment details, proof
              images, support messages and accepted-terms timestamp to operate
              your account.
            </p>
            <h2>How it is used</h2>
            <p>
              Data supports registration, payment review, plan accounting,
              rewards, notifications, account recovery and support.
              Administrators can access member accounts to provide support.
              Admin actions are logged. Never submit passwords, PINs or banking
              OTPs in tickets or payment proof.
            </p>
            <h2>Records and support</h2>
            <p>
              Account and financial records are retained for operational
              accounting and dispute resolution. Contact support on WhatsApp at
              +92 337 9092183 for access, correction or privacy questions.
              Financial records may need to remain available for accounting
              purposes. Your public referral network shows member names and
              joining dates, not their private payment information.
            </p>
          </>
        ) : (
          <>
            <h2>Participation and risk</h2>
            <p>
              StockXEarn is privately operated. The operator personally invests
              funds and manages listed plan payouts. Participation exposes funds
              to investment losses and operator payment risk. Market returns are
              not guaranteed. No exchange affiliation, broker protection or
              regulatory approval is represented by the stock market imagery.
            </p>
            <h2>Deposits and purchases</h2>
            <p>
              Deposits are manually reviewed. A minimum deposit of $420
              applies. Deposited funds can only purchase plans and cannot be
              withdrawn. Review this restriction before sending funds. Plans can
              be purchased multiple times. Each purchase retains its original
              payout terms even when the plan catalogue changes.
            </p>
            <h2>Plan payouts</h2>
            <p>
              The default plans have 60 daily payouts beginning 24 hours after
              purchase. The scheduler credits due payouts and catches up after
              downtime. The final payout adjusts rounding to the listed total.
              The purchase principal is not returned separately. Full financial
              details appear after login and must be reviewed before purchase.
            </p>
            <h2>Withdrawals</h2>
            <p>
              Only earnings, commissions and rewards can be withdrawn. A
              currently active plan and at least $100 are required. There is
              no withdrawal fee. Requests are available 24/7, processed and paid
              manually. Submission does not promise immediate payment. Rejected
              requests return the reserved amount to the earnings wallet.
            </p>
            <h2>Referrals and rewards</h2>
            <p>
              A valid referral code is required. Approved deposits generate
              three-level commissions at the rates in your workspace. Rate
              changes affect future deposit approvals. Rank progress counts
              lifetime plan purchase amounts for you and your first three
              referral levels. Both targets must be met; each rank reward can be
              claimed once. Unclaimed rank requirements may be updated by the
              administrator; previously credited rewards are retained.
            </p>
            <p>
              Community Reward permits one screenshot submission. Approval
              credits $0.10 once. Rejection permanently locks the attempt.
              Reward Codes are subject to expiry, availability, an
              administrator-defined total claim limit and one redemption per
              user per code. Rewards do not bypass withdrawal requirements.
            </p>
            <h2>Account access and support</h2>
            <p>
              You are responsible for keeping login details private.
              Administrators may block access; scheduled payouts and eligible
              referral commissions continue for blocked accounts. Only an
              administrator can change the registered mobile number. Support may
              verify ownership before issuing a temporary password.
              Administrative access and balance adjustments are logged.
            </p>
          </>
        )}
        <p>
          Support:{" "}
          <a href="https://wa.me/923379092183" target="_blank" rel="noreferrer">
            +92 337 9092183
          </a>
        </p>
        <Link className="text-link" to="/">
          ← Return home
        </Link>
      </article>
    </div>
  );
}
