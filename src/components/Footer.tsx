import React from "react";
import Link from "next/link";
import { Dumbbell, Instagram, Twitter, Youtube, Facebook, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand block */}
          <div className="footer-brand">
            <Link href="/" className="footer-logo" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div className="footer-logo-icon">
                  <Dumbbell size={18} />
                </div>
                <span>FiTLiFe</span>
              </div>
              <span style={{ fontSize: "0.65rem", fontWeight: 500, color: "var(--text-muted)", marginTop: "2px", textTransform: "none", letterSpacing: "normal" }}>
                our fitness companion
              </span>
            </Link>
            <p className="footer-description">
              India's premium fitness ecosystem. Experience luxurious training spaces, smart progress metrics, and customized diet plans.
            </p>
            <div className="footer-socials">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="YouTube">
                <Youtube size={18} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Facebook">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="footer-column-title">Company</h4>
            <ul className="footer-links">
              <li><Link href="/" className="footer-link">Home</Link></li>
              <li><Link href="/locations" className="footer-link">Locations</Link></li>
              <li><Link href="/workouts" className="footer-link">Workout Library</Link></li>
              <li><Link href="/tips" className="footer-link">Fitness Tips</Link></li>
            </ul>
          </div>

          {/* Training categories */}
          <div>
            <h4 className="footer-column-title">Workouts</h4>
            <ul className="footer-links">
              <li><Link href="/workouts" className="footer-link">Strength Training</Link></li>
              <li><Link href="/workouts" className="footer-link">HIIT Circuits</Link></li>
              <li><Link href="/workouts" className="footer-link">Core Focus</Link></li>
              <li><Link href="/workouts" className="footer-link">Cardio Conditioning</Link></li>
            </ul>
          </div>

          {/* Contact details */}
          <div>
            <h4 className="footer-column-title">Support Office</h4>
            <div className="footer-contact-info">
              <div className="footer-contact-item">
                <MapPin size={18} className="footer-contact-icon" />
                <span>Linking Rd, Bandra West, Mumbai, MH 400050</span>
              </div>
              <div className="footer-contact-item">
                <Phone size={18} className="footer-contact-icon" />
                <span>+91 90000 88888</span>
              </div>
              <div className="footer-contact-item">
                <Mail size={18} className="footer-contact-icon" />
                <span>support@fitlifegym.in</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} FiTLiFe. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <Link href="/" className="footer-bottom-link">Privacy Policy</Link>
            <Link href="/" className="footer-bottom-link">Terms of Service</Link>
            <Link href="/" className="footer-bottom-link">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
