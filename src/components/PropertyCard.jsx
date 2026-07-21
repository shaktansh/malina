import React from "react";
import { Star, MapPin, Heart, MessageSquare, MessageCircle } from "lucide-react";

export default function PropertyCard({ 
  property, 
  isFavorite, 
  onToggleFavorite, 
  onViewDetails, 
  onOpenChat 
}) {
  const {
    id,
    name,
    location,
    rating,
    tags = [],
    amenities = [],
    priceEUR,
    priceINR,
    currencySymbolEUR = "€",
    currencySymbolINR = "₹",
    image
  } = property;

  // Format currency helpers
  const formatNumber = (num) => {
    return num.toLocaleString("en-IN");
  };

  return (
    <div className="property-card">
      {/* Image Container with Badges */}
      <div className="card-image-container">
        <img 
          src={image} 
          alt={name} 
          className="card-image" 
          loading="lazy" 
        />
        
        {/* Badges */}
        {tags.length > 0 && (
          <div className="card-badge-container">
            {tags.map((tag, idx) => {
              const badgeClass = tag.toLowerCase().includes("couple") 
                ? "badge-couple" 
                : tag.toLowerCase().includes("canal") || tag.toLowerCase().includes("bestseller") || tag.toLowerCase().includes("best seller")
                ? "badge-canal"
                : "badge-luxury";
              return (
                <span key={idx} className={`card-badge ${badgeClass}`}>
                  {tag}
                </span>
              );
            })}
          </div>
        )}

        {/* Favorite Heart Button */}
        <button 
          className={`favorite-btn ${isFavorite ? "is-favorite" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(id);
          }}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart fill={isFavorite ? "var(--clr-danger)" : "none"} strokeWidth={2} size={20} />
        </button>
      </div>

      {/* Card Body */}
      <div className="card-content">
        <div className="card-meta">
          <span className="card-location">
            <MapPin size={14} className="text-gold" /> {location}
          </span>
          <div className="rating-stars">
            {[...Array(rating)].map((_, i) => (
              <Star key={i} size={14} fill="currentColor" stroke="none" />
            ))}
          </div>
        </div>

        <h3 className="card-title">{name}</h3>

        {/* Dot Separated Amenities */}
        <div className="card-amenities">
          {amenities.map((amenity, idx) => (
            <React.Fragment key={idx}>
              <span>{amenity}</span>
              {idx < amenities.length - 1 && <span className="amenity-dot">•</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Pricing & Footer Actions */}
        <div className="card-footer">
          <div className="card-price-container">
            <span className="price-label">Starting From</span>
            {priceEUR ? (
              <>
                <span className="price-val">{currencySymbolEUR}{formatNumber(priceEUR)}</span>
                <span className="price-sub">(~{currencySymbolINR}{formatNumber(priceINR)})/night</span>
              </>
            ) : (
              <>
                <span className="price-val">{currencySymbolINR}{formatNumber(priceINR)}</span>
                <span className="price-sub">/night</span>
              </>
            )}
          </div>

          <div className="card-actions">
            <button 
              className="view-property-btn"
              onClick={() => onViewDetails(property)}
            >
              View Property
            </button>
            <a 
              href="https://wa.me/919315572283"
              target="_blank"
              rel="noopener noreferrer"
              className="chat-shortcut-btn"
              aria-label={`Contact about ${name} on WhatsApp`}
              style={{ textDecoration: "none", display: "flex" }}
            >
              <MessageCircle size={18} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
