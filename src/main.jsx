import React from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
} from "react-router-dom";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/dm-serif-display/latin-400.css";
import "@fontsource/dm-serif-display/latin-400-italic.css";
import "./style.css";
import { Provider, useSession } from "./core";
import { Auth, Forgot, Legal } from "./public";
import { Shell } from "./layout";
import {
  Overview,
  Plans,
  PlanDetail,
  MyPlans,
  DepositPage,
  WithdrawPage,
  Records,
  Team,
  Ranks,
  CommunityReward,
  RewardCodes,
  Profile,
  Security,
  Notifications,
  Support,
  TicketThread,
  FAQ,
} from "./member";
import {
  AdminOverview,
  AdminUsers,
  AdminPlans,
  AdminRanks,
  Reviews,
  AdminLedger,
  AdminCommissions,
  PaymentSettings,
  AdminCodes,
  AdminContent,
  AdminTickets,
  Reports,
} from "./admin";
class Boundary extends React.Component {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <main className="legal-page">
        <h1>Something interrupted this view.</h1>
        <p>Reload the page to reconnect to your workspace.</p>
        <button className="btn" onClick={() => window.location.reload()}>
          Reload page
        </button>
      </main>
    ) : (
      this.props.children
    );
  }
}
function Guard({ admin = false }) {
  const { user, loading } = useSession(),
    location = useLocation();
  if (loading) return <div className="loading">Connecting to StockXEarn…</div>;
  if (!user) return <Navigate to={admin ? "/admin/login" : "/login"} replace />;
  if (admin && user.role !== "admin") return <Navigate to="/app" replace />;
  if (!admin && user.role === "admin") return <Navigate to="/admin" replace />;
  if (
    !admin &&
    user.mustChangePassword &&
    location.pathname !== "/app/security"
  )
    return (
      <Navigate to="/app/security" replace />
    );
  return <Shell admin={admin} />;
}
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth register />} />
      <Route path="/forgot-password" element={<Forgot />} />
      <Route path="/terms" element={<Legal />} />
      <Route path="/privacy" element={<Legal privacy />} />
      <Route path="/admin/login" element={<Auth admin />} />
      <Route path="/app" element={<Guard />}>
        <Route index element={<Overview />} />
        <Route path="plans" element={<Plans />} />
        <Route path="plans/:id" element={<PlanDetail />} />
        <Route path="my-plans" element={<MyPlans />} />
        <Route path="deposit" element={<DepositPage />} />
        <Route path="withdraw" element={<WithdrawPage />} />
        <Route path="team" element={<Team />} />
        <Route path="ranks" element={<Ranks />} />
        <Route path="community" element={<CommunityReward />} />
        <Route path="reward-codes" element={<RewardCodes />} />
        <Route path="activity" element={<Records />} />
        <Route path="earnings" element={<Records type="earnings" />} />
        <Route path="deposits/history" element={<Records type="deposits" />} />
        <Route
          path="withdrawals/history"
          element={<Records type="withdrawals" />}
        />
        <Route path="profile" element={<Profile />} />
        <Route path="security" element={<Security />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="support" element={<Support />} />
        <Route path="support/:id" element={<TicketThread />} />
        <Route path="faq" element={<FAQ />} />
      </Route>
      <Route path="/admin" element={<Guard admin />}>
        <Route index element={<AdminOverview />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="plans" element={<AdminPlans />} />
        <Route path="ranks" element={<AdminRanks />} />
        <Route path="deposits" element={<Reviews type="deposits" />} />
        <Route path="withdrawals" element={<Reviews type="withdrawals" />} />
        <Route path="community" element={<Reviews type="community" />} />
        <Route path="transactions" element={<AdminLedger />} />
        <Route path="commissions" element={<AdminCommissions />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<PaymentSettings />} />
        <Route path="reward-codes" element={<AdminCodes />} />
        <Route path="content" element={<AdminContent />} />
        <Route path="tickets" element={<AdminTickets />} />
        <Route path="tickets/:id" element={<TicketThread admin />} />
      </Route>
      <Route
        path="*"
        element={
          <main className="legal-page">
            <h1>Let’s find your way back.</h1>
            <p>This page is unavailable.</p>
            <Link className="btn" to="/">
              Go to StockXEarn
            </Link>
          </main>
        }
      />
    </Routes>
  );
}
createRoot(document.getElementById("root")).render(
  <Boundary>
    <BrowserRouter>
      <Provider>
        <App />
      </Provider>
    </BrowserRouter>
  </Boundary>,
);
