"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, MapPin, Phone, Clock, Star, Dumbbell } from "lucide-react";
import "./locations.css";

interface GymBranch {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  phone: string | null;
  email: string | null;
  lat: number | null;
  lng: number | null;
  amenities: string;
  timings: string | null;
  rating: number | null;
  imageUrl: string | null;
}

interface GymLocatorClientProps {
  locations: GymBranch[];
}

export default function GymLocatorClient({ locations }: GymLocatorClientProps) {
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("all");

  // Extract unique states for select dropdown
  const uniqueStates = useMemo(() => {
    const states = locations.map((loc) => loc.state);
    return ["all", ...Array.from(new Set(states))];
  }, [locations]);

  // Filter locations based on state & search string (name, address, city, state)
  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      const matchState = selectedState === "all" || loc.state === selectedState;
      const query = search.toLowerCase();
      const matchQuery =
        loc.name.toLowerCase().includes(query) ||
        loc.address.toLowerCase().includes(query) ||
        loc.city.toLowerCase().includes(query) ||
        loc.state.toLowerCase().includes(query);
      return matchState && matchQuery;
    });
  }, [locations, search, selectedState]);

  return (
    <>
      <Navbar />
      <main className="locator-wrapper">
        <div className="container">
          <div className="locator-header">
            <div className="hero-badge" style={{ marginBottom: "1rem" }}>
              <span>Locator</span>
            </div>
            <h1 className="locator-title">Find an AB Gym Near You</h1>
            <p>
              Experience high-end gym spaces equipped with top-tier gear, expert trainers, and all-day access. With your membership, train at any branch across India.
            </p>
          </div>

          {/* Locator Filters Bar */}
          <div className="locator-filters-bar">
            <div className="locator-search-input-wrapper">
              <Search size={18} className="locator-search-icon" />
              <input
                type="text"
                className="form-input locator-search-field"
                placeholder="Search by city, branch name, or address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="locator-select-field"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="all">All States</option>
              {uniqueStates.filter(s => s !== "all").map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Grid display */}
          {filteredLocations.length === 0 ? (
            <div className="locator-no-results glass-panel">
              <AlertState />
            </div>
          ) : (
            <div className="locator-grid">
              {filteredLocations.map((loc) => {
                const amenitiesList = JSON.parse(loc.amenities) as string[];
                return (
                  <div key={loc.id} className="locator-card glass-panel">
                    <div className="locator-card-img-container">
                      <div 
                        className="locator-card-img"
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundImage: `linear-gradient(to bottom, transparent, rgba(10, 9, 13, 0.95)), url(${loc.imageUrl || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80"})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center"
                        }}
                      />
                      <div className="locator-card-badge">
                        <span className="badge badge-gold" style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                          <Star size={10} fill="currentColor" />
                          <span>{loc.rating || "4.5"}</span>
                        </span>
                      </div>
                    </div>

                    <div className="locator-card-content">
                      <h3 className="locator-branch-name">{loc.name}</h3>
                      
                      <div className="locator-details-row">
                        <MapPin size={16} className="locator-details-icon" />
                        <span>{loc.address}, {loc.city}, {loc.state}</span>
                      </div>

                      {loc.phone && (
                        <div className="locator-details-row">
                          <Phone size={16} className="locator-details-icon" style={{ color: "var(--accent-purple)" }} />
                          <span>{loc.phone}</span>
                        </div>
                      )}

                      {loc.timings && (
                        <div className="locator-details-row">
                          <Clock size={16} className="locator-details-icon" style={{ color: "var(--accent-emerald)" }} />
                          <span>{loc.timings}</span>
                        </div>
                      )}

                      <div className="locator-amenities-tags">
                        {amenitiesList.map((am, idx) => (
                          <span key={idx} className="locator-amenities-tag">
                            {am}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function AlertState() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
      <Dumbbell size={48} style={{ color: "var(--text-muted)", opacity: 0.5 }} />
      <h3>No Gym Branches Found</h3>
      <p style={{ maxWidth: "400px", margin: "0 auto" }}>
        We couldn't find any gym centers matching your search criteria. Try modifying your search filter or selecting another state.
      </p>
    </div>
  );
}
