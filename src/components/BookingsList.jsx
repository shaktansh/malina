import React from "react";
import { Calendar, Users, Home, ClipboardList, Trash2 } from "lucide-react";

export default function BookingsList({ bookings = [], onCancelBooking, onBrowseClick }) {
  const formatNumber = (num) => {
    return num ? num.toLocaleString("en-IN") : "";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  if (bookings.length === 0) {
    return (
      <div className="empty-state">
        <ClipboardList size={48} className="text-gold" style={{ strokeWidth: 1.5, color: "var(--clr-gold)" }} />
        <h3>No Inquiries Found</h3>
        <p>You haven't requested any bespoke itineraries or booking inquiries yet. Discover our exclusive handpicked escapes.</p>
        <button className="browse-now-btn" onClick={onBrowseClick}>
          Explore Properties
        </button>
      </div>
    );
  }

  return (
    <div className="bookings-section">
      <div className="section-header">
        <h2 className="section-title">My Travel Inquiries</h2>
      </div>

      <div className="bookings-grid">
        {bookings.map((booking) => (
          <div key={booking.id} className="booking-card">
            <div className="booking-card-header">
              <div>
                <h3 className="booking-hotel-name">{booking.propertyName}</h3>
                <p className="card-location" style={{ fontSize: "0.85rem" }}>{booking.location}</p>
              </div>
              <span className={`booking-status status-${booking.status}`}>
                {booking.status === "pending" ? "Advisor Reviewing" : "Confirmed"}
              </span>
            </div>

            <div className="divider"></div>

            <div className="booking-details-grid">
              <div className="booking-detail-item">
                <span className="booking-detail-lbl">Check In</span>
                <span className="booking-detail-val" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.9rem" }}>
                  <Calendar size={14} className="text-gold" />
                  {formatDate(booking.checkIn)}
                </span>
              </div>
              <div className="booking-detail-item">
                <span className="booking-detail-lbl">Check Out</span>
                <span className="booking-detail-val" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.9rem" }}>
                  <Calendar size={14} className="text-gold" />
                  {formatDate(booking.checkOut)}
                </span>
              </div>
              <div className="booking-detail-item" style={{ marginTop: "8px" }}>
                <span className="booking-detail-lbl">Guests</span>
                <span className="booking-detail-val" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.9rem" }}>
                  <Users size={14} className="text-gold" />
                  {booking.guests} {parseInt(booking.guests) === 1 ? "Guest" : "Guests"}
                </span>
              </div>
              <div className="booking-detail-item" style={{ marginTop: "8px" }}>
                <span className="booking-detail-lbl">Residence Category</span>
                <span className="booking-detail-val" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.9rem" }}>
                  <Home size={14} className="text-gold" />
                  {booking.roomType}
                </span>
              </div>
            </div>

            <div className="divider"></div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span className="price-label">Price Estimate</span>
                {booking.priceEUR ? (
                  <span className="price-val" style={{ fontSize: "1.2rem" }}>
                    €{formatNumber(booking.priceEUR)} <span style={{ fontSize: "0.75rem", color: "var(--clr-grey)" }}>/night</span>
                  </span>
                ) : (
                  <span className="price-val" style={{ fontSize: "1.2rem" }}>
                    ₹{formatNumber(booking.priceINR)} <span style={{ fontSize: "0.75rem", color: "var(--clr-grey)" }}>/night</span>
                  </span>
                )}
              </div>
              
              <button 
                className="cancel-booking-btn"
                onClick={() => onCancelBooking(booking.id)}
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <Trash2 size={14} />
                Cancel Request
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
