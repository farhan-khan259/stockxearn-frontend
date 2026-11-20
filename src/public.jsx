import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
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
      aria-label="TickerNest home"
    >
      <img
        className="brand-logo"
        src="/images/tickernest-logo.svg"
        alt="TickerNest"
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
            About TickerNest
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
              <i /> TICKERNEST / A NEW PERSPECTIVE
            </span>
            <h1>
              {c.data?.heroTitle ||
                "A considered approach to your financial future."}
            </h1>
            <p>
              {c.data?.heroSubtitle ||
                "Meet TickerNest. A privately operated investment platform with a clear member workspace, transparent records, and personal support."}
            </p>
            <div className="row wrap">
              <Link className="btn" to="/register">
                Discover your workspace
                <ArrowUpRight size={18} />
              </Link>
              <a className="text-link" href="#about">
                Get to know TickerNest
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
              TickerNest <span>/ Our approach</span>
            </div>
          </div>
          <div>
            <span className="eyebrow">GET TO KNOW TICKERNEST</span>
            <h2>
              A personal approach.
              <br />
              <em>A connected experience.</em>
            </h2>
            <p>
              TickerNest brings your investment activity, records and community
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
              general market concepts, not a forecast of TickerNest payouts.
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
                "What is TickerNest?",
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
          © {new Date().getFullYear()} TickerNest. Investing involves risk.
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
      register ? "Welcome to TickerNest" : null,
      (d) => {
        session.login(d);
        navigate(d.user.role === "admin" ? "/admin" : "/app");
      },
    );
  }
  return (
    <div className={`auth-page${admin ? "" : " member-auth-page"}`}>
      <aside className="auth-art">
        <Brand />
        <img src="/images/hero.webp" alt="TickerNest financial architecture" />
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
          {!admin && (
            <nav className="auth-tabs" aria-label="Account access">
              <Link
                to="/login"
                className={!register ? "active" : ""}
                aria-current={!register ? "page" : undefined}
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className={register ? "active" : ""}
                aria-current={register ? "page" : undefined}
              >
                Create account
              </Link>
            </nav>
          )}
          <span className="eyebrow">
            {admin
              ? "ADMINISTRATION"
              : register
                ? "WELCOME TO TICKERNEST"
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
              placeholder={admin ? "Administrator email" : "03XXXXXXXXX"}
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
                    <Link to="/terms">
                      Terms & Conditions
                    </Link>{" "}
                    and have read the{" "}
                    <Link to="/privacy">
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
                {register ? "Already a member?" : "New to TickerNest?"}{" "}
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
          {!admin && (
            <div className="auth-security-note">
              <LockKeyhole size={15} aria-hidden="true" />
              <span>
                Protected by secure sign-in and encrypted transport when served
                over HTTPS.
              </span>
            </div>
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
        <img src="/images/hero.webp" alt="TickerNest account recovery" />
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
            href={`https://wa.me/${(s.data?.supportPhone || "+923379092183").replace(/\D/g, "")}?text=I%20need%20help%20resetting%20my%20TickerNest%20password`}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={18} />
            Contact support
          </a>
          <Link to="/login" className="btn ghost recovery-back-btn">
            <ArrowLeft size={17} />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
export function Legal({ privacy = false }) {
  return (
    <main className="legal-page legal-document">
      <header className="legal-document-header">
        <Brand />
        <Link className="btn ghost small" to="/login">
          ← Back to sign in
        </Link>
      </header>
      <article className="legal-document-card">
        <div className="legal-document-hero">
          <span className="eyebrow">TICKERNEST / PARTICIPATION DOCUMENT</span>
          <h1>{privacy ? "Privacy notice" : "Terms & conditions"}</h1>
          <p>
            {privacy
              ? "How TickerNest collects, uses, protects and retains account information."
              : "The rules, wallet terms and participation risks that apply to your TickerNest account."}
          </p>
        </div>
        {privacy ? (
          <div className="legal-section-grid">
            <section>
              <span>01</span>
              <h2>Information collected</h2>
              <p>
                TickerNest stores your name, mobile number, password hash,
                referral relationships, wallet balances, transaction records,
                accepted Terms timestamp, profile image, payment proof images,
                support conversations and account activity needed to operate
                the platform.
              </p>
            </section>
            <section>
              <span>02</span>
              <h2>How information is used</h2>
              <p>
                Data supports registration, identity and account recovery,
                payment review, deposit and withdrawal processing, plan
                purchases, commissions, rewards, notifications and member
                support. Administrator access is restricted to account and
                platform operations.
              </p>
            </section>
            <section>
              <span>03</span>
              <h2>Proof and payment data</h2>
              <p>
                Deposit and payment proof images are private operational
                records. Payment account information is only displayed after
                authentication where required. Never submit passwords, PINs,
                banking OTPs or unrelated identity secrets.
              </p>
            </section>
            <section>
              <span>04</span>
              <h2>Retention and security</h2>
              <p>
                Account and financial records may be retained for accounting,
                dispute resolution, security and operational requirements.
                Reasonable technical controls are used, but no internet service
                can guarantee absolute security.
              </p>
            </section>
            <section>
              <span>05</span>
              <h2>Visibility and sharing</h2>
              <p>
                Referral network views may show member names and joining dates.
                Private balances, payment destinations and proof images are not
                intended for public display. Data is not sold for advertising.
              </p>
            </section>
            <section>
              <span>06</span>
              <h2>Access and support</h2>
              <p>
                Contact +92 337 9092183 through WhatsApp or in-platform support
                for access, correction or privacy questions. Support may verify
                account ownership before handling an account request.
              </p>
            </section>
          </div>
        ) : (
          <div className="legal-section-grid">
            <section>
              <span>01</span>
              <h2>Participation and risk</h2>
              <p>
                TickerNest is privately operated. Listed plans and scheduled
                payouts are participation products, not guaranteed bank
                returns, brokerage services or exchange products. Participation
                involves market, operator and payment risk.
              </p>
            </section>
            <section>
              <span>02</span>
              <h2>Deposits and plan purchases</h2>
              <p>
                Deposits are manually reviewed. The minimum deposit is $3.
                Approved deposit funds credit the USD deposit wallet and may
                only be used to purchase plans. Deposited funds cannot be
                withdrawn. Plans may be purchased multiple times.
              </p>
            </section>
            <section>
              <span>03</span>
              <h2>Plan payouts</h2>
              <p>
                Plans provide scheduled daily payouts over the published term,
                beginning 24 hours after purchase. The payout scheduler credits
                due earnings and reconciles catch-up payouts. Each purchase
                retains its original terms.
              </p>
            </section>
            <section>
              <span>04</span>
              <h2>Withdrawals</h2>
              <p>
                The earnings, commission and reward balances may be withdrawn
                only after a currently active plan is in place. The minimum
                withdrawal is $1. There is no withdrawal fee. Requests are
                reviewed and paid manually; approval is not immediate.
              </p>
            </section>
            <section>
              <span>05</span>
              <h2>Commissions and ranks</h2>
              <p>
                A valid referral code is required at registration. Approved
                deposits may generate commissions across the configured three
                referral levels. Rank progress uses lifetime plan purchases
                across personal and team levels. Both targets must be met before
                each reward can be claimed once.
              </p>
            </section>
            <section>
              <span>06</span>
              <h2>Community and reward codes</h2>
              <p>
                Community Reward allows one screenshot attempt; approval credits
                $0.10 and rejection permanently locks the attempt. Reward Codes
                have their displayed expiry and claim limit, and may only be
                redeemed once by each member.
              </p>
            </section>
            <section>
              <span>07</span>
              <h2>Account responsibility</h2>
              <p>
                Keep login credentials private and provide accurate account
                information. Administrators may block access, reset credentials
                after ownership verification and adjust balances with recorded
                reasons. Scheduled payouts may continue according to applicable
                purchase terms.
              </p>
            </section>
            <section>
              <span>08</span>
              <h2>Changes and support</h2>
              <p>
                Plan catalogue changes do not alter existing purchases.
                Commission and rank configurations may change for future
                eligibility. Contact +92 337 9092183 through WhatsApp or
                in-platform support for questions or disputes.
              </p>
            </section>
          </div>
        )}
        <footer className="legal-document-footer">
          <span>Last reviewed: November 2026</span>
          <a href="https://wa.me/923379092183" target="_blank" rel="noreferrer">
            WhatsApp support
          </a>
        </footer>
      </article>
    </main>
  );
}
