"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Check, Sparkles, X } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  slug: string;
  price: number;
  duration: number;
  tier: string;
  description: string | null;
  features: string; // JSON string list
  popular: boolean;
  active: boolean;
}

export default function PricingCards({ plans }: { plans: Plan[] }) {
  const { data: session } = useSession();
  const router = useRouter();

  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  
  // Sandbox Simulator Modal state
  const [showSandbox, setShowSandbox] = useState(false);
  const [sandboxData, setSandboxData] = useState<{
    orderId: string;
    planName: string;
    price: number;
    planId: string;
  } | null>(null);

  const handleCheckout = async (planId: string, planName: string, price: number) => {
    if (!session) {
      router.push(`/login?callbackUrl=/`);
      return;
    }

    setLoadingPlanId(planId);

    try {
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId }),
      });

      const orderData = await res.json();

      if (!res.ok) {
        alert(orderData.error || "Failed to create payment order.");
        setLoadingPlanId(null);
        return;
      }

      if (orderData.isMock) {
        // Trigger simulated checkout modal
        setSandboxData({
          orderId: orderData.orderId,
          planName,
          price,
          planId,
        });
        setShowSandbox(true);
      } else {
        // Load Razorpay dynamically
        const loadScript = () => {
          return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
          });
        };

        const scriptLoaded = await loadScript();
        if (!scriptLoaded) {
          alert("Failed to load Razorpay SDK. Check your internet connection.");
          setLoadingPlanId(null);
          return;
        }

        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "FiTLiFe",
          description: `Subscription: ${planName}`,
          order_id: orderData.orderId,
          handler: async function (response: any) {
            setLoadingPlanId(planId);
            try {
              const verifyRes = await fetch("/api/payments/verify", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                }),
              });

              if (verifyRes.ok) {
                router.push("/dashboard/membership?success=true");
              } else {
                const verifyData = await verifyRes.json();
                alert(verifyData.error || "Payment verification failed.");
              }
            } catch (err) {
              console.error(err);
              alert("Payment verification error.");
            } finally {
              setLoadingPlanId(null);
            }
          },
          prefill: {
            name: session.user.name || "",
            email: session.user.email || "",
            contact: session.user.phone || "",
          },
          theme: {
            color: "#8b5cf6",
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setLoadingPlanId(null);
    }
  };

  const handleSimulateSuccess = async () => {
    if (!sandboxData) return;
    
    setLoadingPlanId(sandboxData.planId);
    setShowSandbox(false);

    try {
      const verifyRes = await fetch("/api/payments/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: sandboxData.orderId,
          paymentId: `pay_mock_${Math.random().toString(36).substring(2, 10)}`,
          signature: "mock_signature",
        }),
      });

      if (verifyRes.ok) {
        router.push("/dashboard/membership?success=true");
      } else {
        const verifyData = await verifyRes.json();
        alert(verifyData.error || "Mock verification failed.");
        setLoadingPlanId(null);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during mock payment simulation.");
      setLoadingPlanId(null);
    }
  };

  return (
    <section className="section-padding" id="plans">
      <div className="container">
        <div className="pricing-header">
          <div className="hero-badge" style={{ marginBottom: "1rem" }}>
            <span>Flexible Plans</span>
          </div>
          <h2 className="pricing-title">Find Your Perfect Plan</h2>
          <p>Choose the level of access that aligns with your goals. No hidden setup fees.</p>
        </div>

        <div className="pricing-grid">
          {plans.map((plan) => {
            const featuresList = JSON.parse(plan.features) as string[];
            return (
              <div
                key={plan.id}
                className={`glass-panel pricing-card ${plan.popular ? "popular" : ""}`}
                style={{ position: "relative" }}
              >
                {plan.popular && (
                  <div className="pricing-popular-badge">
                    <Sparkles size={12} style={{ display: "inline", marginRight: "3px", verticalAlign: "middle" }} />
                    <span style={{ verticalAlign: "middle" }}>Popular</span>
                  </div>
                )}
                <div
                  className="pricing-tier"
                  style={{
                    color:
                      plan.tier === "PLATINUM"
                        ? "var(--accent-purple)"
                        : plan.tier === "GOLD"
                        ? "var(--accent-pink)"
                        : "var(--text-secondary)",
                  }}
                >
                  {plan.tier}
                </div>
                <h3 className="pricing-name">{plan.name}</h3>
                
                <div className="pricing-price-container">
                  <span className="pricing-price">₹{plan.price.toLocaleString("en-IN")}</span>
                  <span className="pricing-period">/{plan.duration === 1 ? "mo" : `${plan.duration} mos`}</span>
                </div>

                <p className="feature-card-desc" style={{ marginBottom: "2rem" }}>
                  {plan.description}
                </p>

                <ul className="pricing-features-list">
                  {featuresList.map((f, i) => (
                    <li key={i} className="pricing-feature-item">
                      <Check size={16} className="pricing-feature-icon" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleCheckout(plan.id, plan.name, plan.price)}
                  className={`btn ${plan.popular ? "btn-primary" : "btn-secondary"}`}
                  style={{ width: "100%", marginTop: "auto", minHeight: "50px" }}
                  disabled={loadingPlanId === plan.id}
                >
                  {loadingPlanId === plan.id ? "Processing..." : session ? "Upgrade Now" : "Get Started"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sandbox Simulator Modal */}
      {showSandbox && sandboxData && (
        <div className="sandbox-overlay">
          <div className="sandbox-modal glass-panel">
            <div className="sandbox-header">
              <h3 style={{ fontFamily: "var(--font-heading)" }}>Razorpay Sandbox Simulator</h3>
              <button 
                className="sandbox-close-btn" 
                onClick={() => { 
                  setShowSandbox(false); 
                  setLoadingPlanId(null); 
                }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="sandbox-body">
              <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
                Razorpay API keys are not configured. We have fallback-launched simulated sandbox checkout.
              </p>
              
              <div className="sandbox-details">
                <div className="sandbox-detail-row">
                  <span className="sandbox-detail-label">Subscription Plan:</span>
                  <span className="sandbox-detail-value">{sandboxData.planName}</span>
                </div>
                <div className="sandbox-detail-row">
                  <span className="sandbox-detail-label">Amount Due:</span>
                  <span className="sandbox-detail-value" style={{ color: "var(--accent-emerald)" }}>
                    ₹{sandboxData.price.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="sandbox-detail-row">
                  <span className="sandbox-detail-label">Mock Order ID:</span>
                  <span className="sandbox-detail-value" style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
                    {sandboxData.orderId}
                  </span>
                </div>
              </div>
            </div>

            <div className="sandbox-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => { 
                  setShowSandbox(false); 
                  setLoadingPlanId(null); 
                }}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSimulateSuccess}>
                Simulate Success
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
