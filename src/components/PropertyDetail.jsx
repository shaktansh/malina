import React, { useState } from "react";
import { X, Check, Calendar, Users, Home, ShieldAlert } from "lucide-react";

export default function PropertyDetail({ property, onClose, onAddBooking }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [roomType, setRoomType] = useState("Luxury Suite");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!property) return null;

  const {
    name,
    location,
    rating,
    image,
    description,
    features = [],
    priceEUR,
    priceINR,
    currencySymbolEUR = "€",
    currencySymbolINR = "₹"
  } = property;

  const formatNumber = (num) => {
    return num ? num.toLocaleString("en-IN") : "";
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      setErrorMsg("Please select check-in and check-out dates.");
      return;
    }
    if (new Date(checkIn) >= new Date(checkOut)) {
      setErrorMsg("Check-out date must be after check-in date.");
      return;
    }

    const newBooking = {
      id: "bk-" + Date.now(),
      propertyId: property.id,
      propertyName: name,
      location,
      checkIn,
      checkOut,
      guests,
      roomType,
      priceEUR,
      priceINR,
      status: "pending", // pending, confirmed
      createdAt: new Date().toISOString()
    };

    onAddBooking(newBooking);
    setBookingSuccess(true);
    setErrorMsg("");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="drawer-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Hero Image */}
        <div className="drawer-hero">
          <img src={image} alt={name} className="drawer-hero-img" />
        </div>

        {/* Body content */}
        <div className="drawer-body">
          {/* Header Info */}
          <div className="drawer-title-section">
            <div className="drawer-title-row">
              <h2 className="drawer-title">{name}</h2>
            </div>
            <p className="drawer-location">{location}</p>
          </div>

          <div className="divider"></div>

          {/* Description */}
          <div className="drawer-desc">
            <h3>The Experience</h3>
            <p>{description}</p>
          </div>

          <div className="divider"></div>

          {/* Highlights */}
          {features.length > 0 && (
            <div className="drawer-features">
              <h3>Bespoke Highlights</h3>
              <ul className="features-list">
                {features.map((feature, idx) => (
                  <li key={idx}>
                    <Check size={16} className="feature-bullet" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="divider"></div>

          {/* Pricing & Booking Form */}
          <div className="drawer-booking">
            <h3>Request an Escape</h3>
            
            {bookingSuccess ? (
              <div style={{
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                color: "var(--clr-success)",
                padding: "24px",
                borderRadius: "var(--radius-md)",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
                border: "1px solid rgba(16, 185, 129, 0.2)"
              }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  backgroundColor: "var(--clr-success)",
                  color: "white",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Check size={24} strokeWidth={3} />
                </div>
                <h4 style={{ fontSize: "1.2rem", fontWeight: "600", fontFamily: "var(--font-sans)" }}>
                  Inquiry Requested
                </h4>
                <p style={{ fontSize: "0.95rem", color: "var(--clr-grey-dark)" }}>
                  Your bespoke inquiry for {name} has been received. Our luxury travel advisor will contact you within 24 hours.
                </p>
                <button 
                  className="submit-booking-btn" 
                  onClick={onClose} 
                  style={{ width: "100%", marginTop: "12px" }}
                >
                  Close Details
                </button>
              </div>
            ) : (
              <form className="booking-form" onSubmit={handleBookingSubmit}>
                {errorMsg && (
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "var(--clr-danger)",
                    fontSize: "0.9rem",
                    backgroundColor: "rgba(239, 68, 68, 0.05)",
                    padding: "10px 14px",
                    borderRadius: "6px",
                    border: "1px solid rgba(239, 68, 68, 0.1)"
                  }}>
                    <ShieldAlert size={16} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label>Check In</label>
                    <input 
                      type="date" 
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Check Out</label>
                    <input 
                      type="date" 
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Guests</label>
                    <select value={guests} onChange={(e) => setGuests(e.target.value)}>
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="5+">5+ Guests (Villa Exclusive)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Residence Category</label>
                    <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
                      <option value="Luxury Suite">Luxury Suite</option>
                      <option value="Presidential Suite">Presidential Suite</option>
                      <option value="Private Villa">Private Villa</option>
                      <option value="Royal Pavilion">Royal Pavilion</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span className="price-label">Price Estimate</span>
                    {priceEUR ? (
                      <span className="price-val" style={{ fontSize: "1.6rem" }}>
                        {currencySymbolEUR}{formatNumber(priceEUR)} <span style={{ fontSize: "0.85rem", color: "var(--clr-grey)" }}>/night</span>
                      </span>
                    ) : (
                      <span className="price-val" style={{ fontSize: "1.6rem" }}>
                        {currencySymbolINR}{formatNumber(priceINR)} <span style={{ fontSize: "0.85rem", color: "var(--clr-grey)" }}>/night</span>
                      </span>
                    )}
                  </div>
                  <button type="submit" className="submit-booking-btn">
                    Submit Inquiry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
