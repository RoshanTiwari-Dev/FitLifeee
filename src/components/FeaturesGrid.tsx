import React from "react";
import { CreditCard, Award, Heart, Shield, Dumbbell, Activity } from "lucide-react";

export default function FeaturesGrid() {
  const benefits = [
    {
      icon: <CreditCard size={24} />,
      title: "All-India Smart Card",
      desc: "One single membership grants you workout privileges across any of our 25+ branches in major Indian metro cities.",
      color: "purple",
    },
    {
      icon: <Dumbbell size={24} />,
      title: "Elite Strength Equipment",
      desc: "Train with top-tier international lines, Olympic-standard bars, bumper plates, rogue rigs, and massive dumbbell selections.",
      color: "pink",
    },
    {
      icon: <Shield size={24} />,
      title: "Certified Personal Trainers",
      desc: "Achieve results faster and safer under the supervision of expert coaches certified in kinesiology and injury prevention.",
      color: "emerald",
    },
    {
      icon: <Activity size={24} />,
      title: "Track Logs & Goals",
      desc: "Set fitness milestones, register your weight logs, and monitor structural changes over time with interactive dashboard trends.",
      color: "pink",
    },
    {
      icon: <Heart size={24} />,
      title: "Luxury Amenities",
      desc: "Relax post-workout in high-temp dry saunas, steam rooms, premium locker zones, shower facilities, and nutrition cafes.",
      color: "purple",
    },
    {
      icon: <Award size={24} />,
      title: "Studio Group Classes",
      desc: "Gain unlimited bookings to power Yoga, pilates, high-octane Zumba, spinning cycles, and fat-loss HIIT camps.",
      color: "emerald",
    },
  ];

  return (
    <section className="section-padding" id="features" style={{ background: "rgba(255, 255, 255, 0.01)" }}>
      <div className="container">
        <div className="features-header">
          <div className="hero-badge" style={{ marginBottom: "1rem" }}>
            <span>Franchise Benefits</span>
          </div>
          <h2 className="features-title">The AB Gym Standard</h2>
          <p>We blend world-class athletic facilities with smart modern tracking interfaces to support you at every stage.</p>
        </div>

        <div className="responsive-grid">
          {benefits.map((item, index) => (
            <div key={index} className="glass-panel feature-card">
              <div className={`feature-icon-wrapper feature-card-${item.color}`}>
                {item.icon}
              </div>
              <h3 className="feature-card-title">{item.title}</h3>
              <p className="feature-card-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
