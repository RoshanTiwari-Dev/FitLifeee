"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronDown, Shield, RefreshCw, Apple, Info } from "lucide-react";
import "./tips.css";

interface FAQItem {
  id: string;
  category: "safety" | "recovery" | "nutrition";
  question: string;
  answer: React.ReactNode;
}

export default function TipsFAQPage() {
  const [activeCategory, setActiveCategory] = useState<"all" | "safety" | "recovery" | "nutrition">("all");
  const [openItem, setOpenItem] = useState<string | null>("safety-1"); // Open the first one by default

  const tips: FAQItem[] = [
    {
      id: "safety-1",
      category: "safety",
      question: "What is the correct setup for a Bench Press to prevent shoulder injuries?",
      answer: (
        <div className="faq-accordion-answer">
          <p>
            Protect your shoulders by establishing a stable, active base:
          </p>
          <ul style={{ paddingLeft: "1.2rem", marginTop: "0.5rem" }}>
            <li><strong>Retract and Depress:</strong> Pull your shoulder blades back and down into the bench as if putting them in your back pockets.</li>
            <li><strong>Leg Drive:</strong> Set your feet flat on the floor, pushing down through the heels to create tension in your quads and core.</li>
            <li><strong>Elbow Angle:</strong> Tuck your elbows slightly (around 45-60 degrees relative to your torso) instead of flaring them straight out.</li>
            <li><strong>Bar Path:</strong> Touch the bar to your lower sternum/upper stomach, pressing in a slight diagonal arc back over your shoulders.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "safety-2",
      category: "safety",
      question: "How do I maintain spinal alignment during heavy Squats or Deadlifts?",
      answer: (
        <div className="faq-accordion-answer">
          <p>
            Spinal alignment is crucial to protect your lower back from herniation or disc strains:
          </p>
          <ul style={{ paddingLeft: "1.2rem", marginTop: "0.5rem" }}>
            <li><strong>The Valsalva Maneuver:</strong> Take a deep breath into your belly, push your abdominal wall outward, and hold it. This acts as an internal brace.</li>
            <li><strong>Neutral Neck:</strong> Pick a spot on the floor 5-10 feet in front of you. Avoid looking straight up or cranking your neck.</li>
            <li><strong>Engage the Lats:</strong> For deadlifts, pull the slack out of the bar and squeeze your armpits together as if squeezing oranges.</li>
            <li><strong>Hip Hinge:</strong> Guide the movement by pushing your hips back rather than bending forward from the waist.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "recovery-1",
      category: "recovery",
      question: "What is Active Recovery and how should I practice it?",
      answer: (
        <div className="faq-accordion-answer">
          <p>
            Active recovery involves low-intensity exercise to stimulate blood circulation and accelerate the removal of waste products (lactic acid) from muscle fibers:
          </p>
          <ul style={{ paddingLeft: "1.2rem", marginTop: "0.5rem" }}>
            <li><strong>Practices:</strong> Low-intensity walks (20-30 minutes), mobility sessions, dynamic stretching, or active swimming.</li>
            <li><strong>Intensity:</strong> Keep your heart rate under 110 bpm. You should be able to hold a full conversation easily.</li>
            <li><strong>Frequency:</strong> Perform on rest days, or as a light morning sequence after a heavy lifting session.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "recovery-2",
      category: "recovery",
      question: "How does sleep impact muscle protein synthesis and recovery?",
      answer: (
        <div className="faq-accordion-answer">
          <p>
            Sleep is the single most powerful recovery tool you have:
          </p>
          <ul style={{ paddingLeft: "1.2rem", marginTop: "0.5rem" }}>
            <li><strong>Growth Hormone (GH):</strong> The deep sleep phase (SWS) triggers the release of human growth hormone, repairing microtears in muscle tissue.</li>
            <li><strong>Hormonal Balance:</strong> Insufficient sleep decreases testosterone and raises cortisol (a catabolic hormone that breaks down muscle).</li>
            <li><strong>Recommendations:</strong> Target 7.5 to 9 hours of quality sleep nightly. Avoid screen time or heavy meals within 2 hours of sleeping.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "nutrition-1",
      category: "nutrition",
      question: "What is the recommended macronutrient breakdown for gaining muscle?",
      answer: (
        <div className="faq-accordion-answer">
          <p>
            For hypertrophy (muscle building), balance your calories and macronutrients:
          </p>
          <ul style={{ paddingLeft: "1.2rem", marginTop: "0.5rem" }}>
            <li><strong>Protein:</strong> Aim for 1.6 to 2.2 grams of protein per kilogram of body weight (e.g. 140g-170g for an 80kg individual).</li>
            <li><strong>Carbohydrates:</strong> 3 to 5 grams per kg. Carbs replenish muscle glycogen stores, fueling heavy training performance.</li>
            <li><strong>Fats:</strong> 0.8 to 1.2 grams per kg. Healthy fats regulate essential hormones, including testosterone.</li>
            <li><strong>Surplus:</strong> Maintain a moderate caloric surplus (+250 to +500 kcal above maintenance) to support tissue accretion.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "nutrition-2",
      category: "nutrition",
      question: "What should I eat before and after a workout for optimal performance?",
      answer: (
        <div className="faq-accordion-answer">
          <p>
            Proper nutrient timing can enhance power output and speed muscle recovery:
          </p>
          <ul style={{ paddingLeft: "1.2rem", marginTop: "0.5rem" }}>
            <li><strong>Pre-Workout (2-3 Hours Before):</strong> A balanced meal of complex carbohydrates and lean protein (e.g., chicken breast with rice, or oatmeal with whey).</li>
            <li><strong>Pre-Workout Quick Fuel (30-60 Mins Before):</strong> Simple carbohydrates (e.g., banana, rice cakes, or cream of rice) for rapid glycogen availability.</li>
            <li><strong>Post-Workout (Within 1-2 Hours):</strong> High-quality protein (30-40g) combined with fast-digesting carbohydrates to trigger insulin, shuttling amino acids into muscle cells.</li>
          </ul>
        </div>
      ),
    },
  ];

  const filteredTips = tips.filter(
    (tip) => activeCategory === "all" || tip.category === activeCategory
  );

  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <>
      <Navbar />
      <main className="tips-wrapper">
        <div className="container">
          <div className="tips-header">
            <div className="hero-badge" style={{ marginBottom: "1rem" }}>
              <span>Knowledge Base</span>
            </div>
            <h1 className="tips-title">Fitness Guides & Tips</h1>
            <p>
              Master your form, optimize your recovery routines, and fuel your training with expert tips curated by certified fitness professionals.
            </p>
          </div>

          {/* Tips Categories */}
          <div className="tips-categories">
            <button
              className={`tips-category-btn ${activeCategory === "all" ? "active" : ""}`}
              onClick={() => { setActiveCategory("all"); setOpenItem(null); }}
            >
              All Categories
            </button>
            <button
              className={`tips-category-btn ${activeCategory === "safety" ? "active" : ""}`}
              onClick={() => { setActiveCategory("safety"); setOpenItem(null); }}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Shield size={14} />
              <span>Form Safety</span>
            </button>
            <button
              className={`tips-category-btn ${activeCategory === "recovery" ? "active" : ""}`}
              onClick={() => { setActiveCategory("recovery"); setOpenItem(null); }}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <RefreshCw size={14} />
              <span>Recovery Guides</span>
            </button>
            <button
              className={`tips-category-btn ${activeCategory === "nutrition" ? "active" : ""}`}
              onClick={() => { setActiveCategory("nutrition"); setOpenItem(null); }}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Apple size={14} />
              <span>Nutrition Guides</span>
            </button>
          </div>

          {/* Accordion List */}
          <div className="faq-accordion-list">
            {filteredTips.map((tip) => (
              <div
                key={tip.id}
                className={`faq-accordion-item ${openItem === tip.id ? "active" : ""}`}
              >
                <button
                  className="faq-accordion-header"
                  onClick={() => toggleItem(tip.id)}
                >
                  <span className="faq-accordion-question">{tip.question}</span>
                  <ChevronDown size={18} className="faq-accordion-icon" />
                </button>
                <div className="faq-accordion-body">
                  {tip.answer}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Card notice */}
          <div className="glass-panel" style={{ padding: "2rem", maxWidth: "800px", margin: "4rem auto 0 auto", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <Info size={24} style={{ color: "var(--accent-purple)", flexShrink: 0 }} />
            <div>
              <h4 style={{ fontSize: "1.1rem", marginBottom: "0.5rem", fontFamily: "var(--font-heading)" }}>
                Franchise Training & Safety Policy
              </h4>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                At FiTLiFe, your safety is our top priority. Our cardio decks, free weights zones, and training floors are monitored at all times by certified fitness safety professionals. Always consult with a trainer on the floor if you are trying a new barbell movement or need a spotter.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
