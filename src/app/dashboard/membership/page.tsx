import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  Dumbbell, 
  CreditCard, 
  AlertCircle,
  TrendingUp,
  Receipt
} from "lucide-react";
import { formatINR } from "@/lib/razorpay";
import "./membership.css";

// Renders a styled inline mock QR code SVG based on the card number
function VirtualCardQRCode({ cardNumber }: { cardNumber: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className="card-qr-image" 
      aria-label={`QR Code for member card ${cardNumber}`}
    >
      {/* Corner Anchor top-left */}
      <rect x="5" y="5" width="20" height="20" fill="currentColor" />
      <rect x="9" y="9" width="12" height="12" fill="#fff" />
      <rect x="12" y="12" width="6" height="6" fill="currentColor" />
      
      {/* Corner Anchor top-right */}
      <rect x="75" y="5" width="20" height="20" fill="currentColor" />
      <rect x="79" y="9" width="12" height="12" fill="#fff" />
      <rect x="82" y="12" width="6" height="6" fill="currentColor" />
      
      {/* Corner Anchor bottom-left */}
      <rect x="5" y="75" width="20" height="20" fill="currentColor" />
      <rect x="9" y="79" width="12" height="12" fill="#fff" />
      <rect x="12" y="82" width="6" height="6" fill="currentColor" />
      
      {/* Tiny alignment pattern bottom-right */}
      <rect x="75" y="75" width="8" height="8" fill="currentColor" />
      <rect x="83" y="83" width="12" height="12" fill="currentColor" />
      <rect x="79" y="79" width="4" height="4" fill="currentColor" />

      {/* Cyber/QR texture elements (reconstructed dynamically) */}
      <rect x="35" y="10" width="4" height="8" fill="currentColor" />
      <rect x="45" y="5" width="8" height="4" fill="currentColor" />
      <rect x="60" y="12" width="8" height="8" fill="currentColor" />
      
      <rect x="10" y="35" width="8" height="4" fill="currentColor" />
      <rect x="5" y="45" width="4" height="8" fill="currentColor" />
      <rect x="12" y="60" width="8" height="8" fill="currentColor" />
      
      <rect x="30" y="30" width="16" height="16" fill="currentColor" />
      <rect x="34" y="34" width="8" height="8" fill="#fff" />
      <rect x="36" y="36" width="4" height="4" fill="currentColor" />

      <rect x="55" y="30" width="12" height="4" fill="currentColor" />
      <rect x="55" y="40" width="4" height="12" fill="currentColor" />
      <rect x="63" y="45" width="8" height="4" fill="currentColor" />
      
      <rect x="30" y="55" width="4" height="12" fill="currentColor" />
      <rect x="40" y="55" width="12" height="4" fill="currentColor" />
      <rect x="45" y="63" width="4" height="8" fill="currentColor" />

      <rect x="50" y="50" width="8" height="8" fill="currentColor" />
      <rect x="70" y="60" width="16" height="4" fill="currentColor" />
      <rect x="60" y="70" width="4" height="16" fill="currentColor" />
      
      <rect x="35" y="80" width="8" height="12" fill="currentColor" />
      <rect x="48" y="75" width="12" height="8" fill="currentColor" />
    </svg>
  );
}

// Spaces the card number out beautifully for realistic digital plastic printing
function formatCardNumber(num: string): string {
  const cleaned = num.replace(/\s+/g, "");
  const chunks = [];
  for (let i = 0; i < cleaned.length; i += 4) {
    chunks.push(cleaned.slice(i, i + 4));
  }
  return chunks.join(" ");
}

export default async function MembershipPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  // Fetch current active membership and historical successful payment orders
  const [membership, payments] = await Promise.all([
    db.membership.findFirst({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
      },
      include: {
        plan: true,
      },
    }),
    db.payment.findMany({
      where: {
        userId: session.user.id,
        status: "SUCCESS",
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        membership: {
          include: {
            plan: true,
          },
        },
      },
    }),
  ]);

  return (
    <div className="membership-page-wrapper">
      <div>
        <h2 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>My Membership Card</h2>
        <p style={{ color: "var(--text-muted)" }}>
          Access your digital gym card and trace your verified billing statements
        </p>
      </div>

      {membership ? (
        <>
          {/* Card Showcase Perspectived Workspace */}
          <div className="membership-card-showcase">
            <div className={`virtual-gym-card tier-${membership.plan.tier.toLowerCase()}`}>
              {/* Top Banner Row */}
              <div className="card-header-row">
                <div className="card-brand-logo">
                  <div className="card-brand-logo-icon">
                    <Dumbbell size={14} />
                  </div>
                  <span>FiTLiFe</span>
                </div>
                <span className="card-tier-badge">
                  {membership.plan.name}
                </span>
              </div>

              {/* Central Electronic Chip */}
              <div className="card-chip-container">
                <div className="card-smart-chip"></div>
              </div>

              {/* Embossed Card Number */}
              <div className="card-digital-number">
                {formatCardNumber(membership.cardNumber)}
              </div>

              {/* Bottom Cardholder Name, validity and QR graphic */}
              <div className="card-footer-row">
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <div className="card-holder-info">
                    <span className="card-holder-label">Card Holder</span>
                    <span className="card-holder-name">
                      {session.user.name || "AB Member"}
                    </span>
                  </div>

                  <div className="card-dates-container">
                    <div>
                      <span className="card-date-label">Valid:</span>
                      <span>
                        {new Date(membership.startDate).toLocaleDateString("en-IN", {
                          month: "2-digit",
                          year: "2-digit",
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="card-date-label">Expires:</span>
                      <span>
                        {new Date(membership.endDate).toLocaleDateString("en-IN", {
                          month: "2-digit",
                          year: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card-qr-box">
                  <VirtualCardQRCode cardNumber={membership.cardNumber} />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Warning Panel for Members with No Active Package */
        <div className="membership-no-plan-card glass-panel">
          <div className="membership-no-plan-icon">
            <AlertCircle size={32} />
          </div>
          <h3 style={{ fontSize: "1.45rem", marginBottom: "0.75rem" }}>
            No Active Membership
          </h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", maxWidth: "450px", margin: "0 auto 2rem auto" }}>
            You do not have a registered active membership package. Select from our flexible, top-tier subscription plans to activate your digital gym card.
          </p>
          <Link href="/#plans" className="btn btn-primary">
            Explore Pricing Plans
          </Link>
        </div>
      )}

      {/* Payment Billing History Logs Table */}
      <section className="membership-history-section">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Receipt size={20} style={{ color: "var(--accent-purple)" }} />
          <h3 style={{ fontSize: "1.25rem", margin: 0 }}>Payment Transactions</h3>
        </div>

        {payments.length === 0 ? (
          <div className="glass-panel" style={{ padding: "2.5rem", textAlign: "center", color: "var(--text-muted)" }}>
            No transaction records found for this account.
          </div>
        ) : (
          <div className="payment-history-table-wrapper glass-panel">
            <table className="payment-history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Order Reference</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td>
                      {new Date(payment.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                      {payment.razorpayOrderId || payment.id}
                    </td>
                    <td>
                      {payment.description || 
                       (payment.membership?.plan?.name 
                         ? `${payment.membership.plan.name} Membership Plan` 
                         : "Gym Membership Payment")}
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {formatINR(payment.amount)}
                    </td>
                    <td>
                      <span className="badge badge-success">Success</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
