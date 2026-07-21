import React, { useState } from "react";
import { ArrowLeft, MapPin, Star, ChevronRight, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { goaVillas } from "../data/goaVillas";
import VillaDetailPage from "./VillaDetailPage";

const VillaCard = ({ villa, onClick }) => (
  <div className="property-card" onClick={() => onClick(villa)} style={{ cursor: "pointer" }}>
    <div className="card-image-container">
      <img src={villa.images[0].src} alt={villa.name} className="card-image" loading="lazy" />
      <div className="card-badge-container">
        {villa.tags.slice(0, 2).map((tag, i) => (
          <span key={i} className="card-badge badge-luxury">{tag}</span>
        ))}
      </div>
    </div>
    <div className="card-content">
      <div className="card-meta">
        <span className="card-location">
          <MapPin size={14} style={{ color: "var(--clr-gold)" }} /> {villa.location}
        </span>
        {villa.rating > 0 && (
          <span className="card-rating" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Star size={12} fill="var(--clr-gold)" stroke="none" />
            <span>{villa.rating}</span>
            <span style={{ color: "var(--clr-grey)", fontSize: "0.8rem" }}>({villa.reviewCount})</span>
          </span>
        )}
      </div>
      <h3 className="card-title">{villa.name}</h3>
      <div className="card-amenities">
        <span>Upto {villa.guests} Guests</span>
        <span className="amenity-dot">•</span>
        <span>{villa.bedrooms} Bedrooms</span>
        <span className="amenity-dot">•</span>
        <span>{villa.bathrooms} Bathrooms</span>
        {villa.pools > 0 && (
          <>
            <span className="amenity-dot">•</span>
            <span>{villa.pools} Pool{villa.pools > 1 ? "s" : ""}</span>
          </>
        )}
      </div>
        <div className="card-footer">
        <div className="card-price-container">
          <span className="price-label">Starting From</span>
          <span className="price-val">₹{villa.priceINR?.toLocaleString("en-IN")}</span>
          <span className="price-sub">/night</span>
        </div>
        <div className="card-actions">
          <button className="view-property-btn">View Details</button>
          <a
            href="https://wa.me/919315572283"
            target="_blank"
            rel="noopener noreferrer"
            className="chat-shortcut-btn"
            aria-label={`Contact about ${villa.name} on WhatsApp`}
            style={{ textDecoration: "none", display: "flex" }}
            onClick={(e) => e.stopPropagation()}
          >
            <MessageCircle size={18} />
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default function GoaListingPage() {
  const navigate = useNavigate();
  const [selectedVilla, setSelectedVilla] = useState(null);
  const [sortBy, setSortBy] = useState("default");
  const [locationFilter, setLocationFilter] = useState("All");

  if (selectedVilla) {
    return <VillaDetailPage villa={selectedVilla} onBack={() => setSelectedVilla(null)} />;
  }

  const locations = ["All", ...new Set(goaVillas.map(v => v.location))].sort();

  let filteredVillas = [...goaVillas];
  if (locationFilter !== "All") {
    filteredVillas = filteredVillas.filter(v => v.location === locationFilter);
  }

  if (sortBy === "price-low") {
    filteredVillas.sort((a, b) => a.priceINR - b.priceINR);
  } else if (sortBy === "price-high") {
    filteredVillas.sort((a, b) => b.priceINR - a.priceINR);
  } else if (sortBy === "rating") {
    filteredVillas.sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="app-container">
      {/* Sticky Header */}
      <div className="villa-page-topbar" style={{ position: "sticky", top: 0, zIndex: 50 }}>
        <button className="villa-back-btn" onClick={() => navigate("/")} aria-label="Go back">
          <ArrowLeft size={20} />
          <span>Home</span>
        </button>
        <span className="villa-page-breadcrumb">
          Malina Holidays &rsaquo; Goa Collection
        </span>
      </div>

      {/* Hero Banner */}
      <section
        className="goa-hero"
        style={{
          backgroundImage: "url(https://d3oo9u3p09egds.cloudfront.net/filters:format(webp)/rental_property/beleza-villa-a/1_Pool_Facade.webp)",
          height: "300px", minHeight: "300px"
        }}
      >
        <div className="goa-hero-overlay" />
        <div className="goa-hero-content" style={{ textAlign: "center", alignItems: "center" }}>
          <span className="goa-hero-tag">Goa Collection</span>
          <h1 className="goa-hero-headline" style={{ fontSize: "2.5rem" }}>
            <span className="goa-hero-script">Discover</span>
            <span className="goa-hero-bold">Goa's Finest Villas</span>
          </h1>
          <p className="goa-hero-subline" style={{ maxWidth: "500px" }}>
            {filteredVillas.length} handpicked luxury villas across Goa's most sought-after locations
          </p>
        </div>
      </section>

      {/* Filters Bar */}
      <div style={{
        padding: "16px 20px", display: "flex", gap: "12px", flexWrap: "wrap",
        alignItems: "center", backgroundColor: "var(--clr-white)", borderBottom: "1px solid var(--clr-light-grey)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--clr-navy)" }}>Location:</label>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            style={{
              padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--clr-light-grey)",
              fontSize: "0.85rem", backgroundColor: "var(--clr-white)", cursor: "pointer"
            }}
          >
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--clr-navy)" }}>Sort:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--clr-light-grey)",
              fontSize: "0.85rem", backgroundColor: "var(--clr-white)", cursor: "pointer"
            }}
          >
            <option value="default">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
        <span style={{ marginLeft: "auto", fontSize: "0.85rem", color: "var(--clr-grey-dark)" }}>
          {filteredVillas.length} villa{filteredVillas.length !== 1 ? "s" : ""} found
        </span>
      </div>

      {/* Villa Grid */}
      <main className="main-content">
        <section className="hp-villa-section" style={{ paddingTop: "20px" }}>
          <div className="hp-villa-inner">
            <div className="properties-grid">
              {filteredVillas.map(villa => (
                <VillaCard key={villa.id} villa={villa} onClick={setSelectedVilla} />
              ))}
            </div>
            {filteredVillas.length === 0 && (
              <div className="empty-state">
                <MapPin size={48} style={{ strokeWidth: 1.5, color: "var(--clr-gold)" }} />
                <h3>No villas found</h3>
                <p>Try adjusting your filters to discover more properties.</p>
                <button
                  className="browse-now-btn"
                  onClick={() => { setLocationFilter("All"); setSortBy("default"); }}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}