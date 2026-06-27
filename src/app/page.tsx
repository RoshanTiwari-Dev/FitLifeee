import React from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesGrid from "@/components/FeaturesGrid";
import PricingCards from "@/components/PricingCards";
import Footer from "@/components/Footer";
import CalorieCalculator from "@/components/CalorieCalculator";
import { db } from "@/lib/db";
import { Star, MapPin, ChevronRight } from "lucide-react";
import Link from "next/link";

// Force dynamic rendering on every request to fetch fresh database state
export const revalidate = 0;

export default async function Home() {
  // Fetch pricing plans from SQLite database
  const plans = await db.plan.findMany({
    where: { active: true },
    orderBy: { price: "asc" },
  });

  // Fetch a subset of branch locations for homepage network preview
  const locations = await db.gymLocation.findMany({
    where: { active: true },
    take: 3,
  });

  const testimonials = [
    {
      name: "Rohan Sharma",
      role: "Gold Pass Member (Delhi CP)",
      text: "The All-India membership is a lifesaver. I commute between Mumbai and Delhi frequently, and checking in at CP and Bandra is totally frictionless.",
      rating: 5,
    },
    {
      name: "Ananya Deshmukh",
      role: "Platinum Pass Member (Bengaluru)",
      text: "Having 4 personal coaching sessions and a personalized diet guide included in the Platinum tier helped me hit my weight goals in record time.",
      rating: 5,
    },
    {
      name: "Kabir Malhotra",
      role: "Silver Pass Member (Pune)",
      text: "High-end luxury cardio space, clean steam rooms, and the trainers are super helpful. Excellent value for money at just ₹999/month.",
      rating: 5,
    },
  ];

  return (
    <>
      {/* Global Navigation Header */}
      <Navbar />
      
      <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Dynamic Hero landing banner */}
        <HeroSection />

        {/* Benefits Grid list */}
        <FeaturesGrid />

        {/* Locations Preview Area */}
        <section className="section-padding" style={{ borderTop: "1px solid var(--border-light)" }}>
          <div className="container">
            <div className="features-header">
              <div className="hero-badge" style={{ marginBottom: "1rem" }}>
                <span>Our Network</span>
              </div>
              <h2 className="features-title">Train in 25+ Cities</h2>
              <p>Explore some of our luxury-tier gym centers located all across the nation.</p>
            </div>

            <div className="responsive-grid" style={{ marginBottom: "3rem" }}>
              {locations.map((loc) => {
                const amenitiesList = JSON.parse(loc.amenities) as string[];
                return (
                  <div key={loc.id} className="glass-panel" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
                    <div style={{ height: "200px", width: "100%", position: "relative", backgroundColor: "#201a2b" }}>
                      <div style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundImage: `linear-gradient(to bottom, transparent, rgba(10, 9, 13, 0.9)), url(${loc.imageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                      }} />
                      <div style={{ position: "absolute", bottom: "1rem", left: "1rem" }}>
                        <span className="badge badge-gold" style={{ fontSize: "0.65rem", padding: "0.2rem 0.5rem", display: "flex", alignItems: "center", gap: "3px" }}>
                          <Star size={10} fill="currentColor" />
                          <span>{loc.rating || "4.5"}</span>
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                      <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem", fontFamily: "var(--font-heading)" }}>
                        {loc.name}
                      </h3>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                        <MapPin size={16} style={{ color: "var(--accent-pink)", flexShrink: 0, marginTop: "0.15rem" }} />
                        <span>{loc.address}, {loc.city}</span>
                      </div>
                      
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "auto" }}>
                        {amenitiesList.slice(0, 3).map((am, i) => (
                          <span key={i} style={{ fontSize: "0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-light)", borderRadius: "4px", padding: "0.2rem 0.5rem", color: "var(--text-secondary)" }}>
                            {am}
                          </span>
                        ))}
                        {amenitiesList.length > 3 && (
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", padding: "0.2rem 0" }}>
                            +{amenitiesList.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ textAlign: "center" }}>
              <Link href="/locations" className="btn btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                <span>View All Gym Locations</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Block */}
        <section className="section-padding" style={{ background: "rgba(255, 255, 255, 0.005)", borderTop: "1px solid var(--border-light)" }}>
          <div className="container">
            <div className="features-header">
              <div className="hero-badge" style={{ marginBottom: "1rem" }}>
                <span>Reviews</span>
              </div>
              <h2 className="features-title">What Our Members Say</h2>
              <p>Check out recommendations from real athletes training across our gyms.</p>
            </div>

            <div className="responsive-grid">
              {testimonials.map((t, idx) => (
                <div key={idx} className="glass-panel" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", gap: "2px", color: "var(--accent-amber)" }}>
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" style={{ border: "none" }} />
                    ))}
                  </div>
                  <p style={{ fontStyle: "italic", fontSize: "0.95rem", color: "var(--text-primary)", lineHeight: 1.6 }}>
                    "{t.text}"
                  </p>
                  <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ 
                      width: "36px", 
                      height: "36px", 
                      borderRadius: "50%", 
                      background: "var(--grad-primary)", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      color: "#fff", 
                      fontWeight: 700,
                      fontSize: "0.9rem"
                    }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 700 }}>{t.name}</h4>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{t.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FiTLiFe Plus Promo & Calorie Calculator */}
        <section className="section-padding" style={{ borderTop: "1px solid var(--border-light)" }}>
          <div className="container">
            <div className="features-header" style={{ marginBottom: "2rem" }}>
              <div className="hero-badge" style={{ marginBottom: "1rem" }}>
                <span style={{ color: "var(--accent-purple)" }}>FiTLiFe Plus</span>
              </div>
              <h2 className="features-title">All-in-One Nutrition & Step Tracker</h2>
              <p>
                Estimate your daily calorie requirements using our interactive calculator below. 
                Subscribe to any membership plan to log daily nutrition counts, track steps, and plan your weekly diets.
              </p>
            </div>

            <CalorieCalculator />
          </div>
        </section>

        {/* Pricing plans block */}
        <div id="plans" style={{ borderTop: "1px solid var(--border-light)", scrollMarginTop: "80px" }}>
          <PricingCards plans={plans} />
        </div>
      </main>

      {/* Global Footer */}
      <Footer />
    </>
  );
}
