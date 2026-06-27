"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

interface Quote {
  text: string;
  image: string;
}

const MOTIVATIONAL_QUOTES: Quote[] = [
  {
    text: "The only bad workout is the one that didn't happen. Let's make today count!",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80"
  },
  {
    text: "Success isn't always about greatness. It's about consistency. Consistent hard work gains success.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80"
  },
  {
    text: "Your body can stand almost anything. It's your mind that you have to convince.",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80"
  },
  {
    text: "Dream check: Are you working hard or just wishing hard? Let's push the boundaries!",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    text: "Action is the foundational key to all success. Sweat today, smile tomorrow.",
    image: "https://images.unsplash.com/photo-1571731979149-75beec7970d6?auto=format&fit=crop&w=1200&q=80"
  },
  {
    text: "What hurts today makes you stronger tomorrow. Push your limits and exceed expectations!",
    image: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=1200&q=80"
  }
];

export default function WelcomeBanner({ userName }: { userName: string }) {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [spinning, setSpinning] = useState(false);

  const setRandomQuote = () => {
    setSpinning(true);
    setTimeout(() => setSpinning(false), 600); // match animation duration

    if (MOTIVATIONAL_QUOTES.length === 0) return;
    
    // Choose a random quote that is different from the current one if possible
    let newQuote = currentQuote;
    while (newQuote === currentQuote) {
      const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
      newQuote = MOTIVATIONAL_QUOTES[randomIndex];
      if (MOTIVATIONAL_QUOTES.length <= 1) break;
    }
    
    setCurrentQuote(newQuote);
  };

  useEffect(() => {
    // Select first quote after mounting to prevent React hydration mismatch
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    setCurrentQuote(MOTIVATIONAL_QUOTES[randomIndex]);
  }, []);

  if (!currentQuote) {
    return (
      <div className="dashboard-welcome-banner loading">
        <h1 className="dashboard-welcome-title">Welcome back, {userName}!</h1>
        <p className="dashboard-welcome-quote">Loading motivation...</p>
      </div>
    );
  }

  return (
    <div 
      className="dashboard-welcome-banner"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(20, 17, 28, 0.88) 0%, rgba(10, 9, 13, 0.94) 100%), url(${currentQuote.image})`,
        transition: "background-image 0.5s ease-in-out"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1.5rem" }}>
        <div style={{ flexGrow: 1 }}>
          <h1 className="dashboard-welcome-title">Welcome back, {userName}!</h1>
          <p className="dashboard-welcome-quote" style={{ color: "rgba(255,255,255,0.85)", fontStyle: "italic", fontSize: "1.05rem" }}>
            "{currentQuote.text}"
          </p>
        </div>
        
        <button 
          onClick={setRandomQuote}
          className="welcome-refresh-btn"
          title="Refresh Motivation"
          aria-label="Refresh Motivation Quote"
        >
          <RefreshCw size={16} className={spinning ? "animate-spin-once" : ""} />
        </button>
      </div>
    </div>
  );
}
