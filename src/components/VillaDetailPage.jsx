import React, { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Star, Users, BedDouble, Bath, Save as Waves, Coffee, Wifi, Check, ChevronLeft, ChevronRight, Phone, Mail, MessageCircle, Shield, Calendar, X } from "lucide-react";

export default function VillaDetailPage({ villa, onBack }) {
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.body.style.overflow = "";
  }, []);

  const handlePrev = () => setActiveImage((p) => (p === 0 ? villa.images.length - 1 : p - 1));
  const handleNext = () => setActiveImage((p) => (p === villa.images.length - 1 ? 0 : p + 1));

  const formatPrice = (num) => num?.toLocaleString("en-IN") ?? "";

  const renderStars = (rating) => {
    if (!rating) return null;
    const full = Math.floor(rating);
    return (
      <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            fill={i < full ? "var(--clr-gold)" : "none"}
            stroke="var(--clr-gold)"
          />
        ))}
        <span style={{ marginLeft: "4px", fontWeight: 600, fontSize: "0.9rem" }}>{rating}</span>
        {villa.reviewCount > 0 && (
          <span style={{ color: "var(--clr-grey)", fontSize: "0.85rem" }}>
            ({villa.reviewCount} review{villa.reviewCount !== 1 ? "s" : ""})
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="villa-page">
      {/* Sticky top bar */}
      <div className="villa-page-topbar">
        <button className="villa-back-btn" onClick={onBack} aria-label="Go back">
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <span className="villa-page-breadcrumb">
          Malina Holidays &rsaquo; {villa.type === "Bali Villas" ? "Bali Collection" : villa.type === "Italy Villas" ? "Italy Collection" : villa.type === "Coonoor Villas" ? "Coonoor Collection" : villa.type === "Goa Villas" ? "Goa Collection" : "India Collection"} &rsaquo; {villa.name}
        </span>
      </div>

      {/* Hero Image Gallery */}
      <section className="villa-gallery">
        <div className="villa-gallery-main" onClick={() => setLightboxOpen(true)}>
          <img
            src={villa.images[activeImage].src}
            alt={villa.images[activeImage].caption}
            className="villa-gallery-hero"
          />
          <div className="villa-gallery-caption">{villa.images[activeImage].caption}</div>
          <button className="villa-gallery-nav villa-gallery-prev" onClick={(e) => { e.stopPropagation(); handlePrev(); }}>
            <ChevronLeft size={22} />
          </button>
          <button className="villa-gallery-nav villa-gallery-next" onClick={(e) => { e.stopPropagation(); handleNext(); }}>
            <ChevronRight size={22} />
          </button>
          <div className="villa-gallery-count">{activeImage + 1} / {villa.images.length}</div>
        </div>

        {/* Thumbnails */}
        <div className="villa-gallery-thumbs">
          {villa.images.map((img, idx) => (
            <button
              key={idx}
              className={`villa-thumb ${idx === activeImage ? "active" : ""}`}
              onClick={() => setActiveImage(idx)}
            >
              <img src={img.src} alt={img.caption} />
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="villa-lightbox" onClick={() => setLightboxOpen(false)}>
          <button className="villa-lightbox-close" onClick={() => setLightboxOpen(false)}>
            <X size={24} />
          </button>
          <button className="villa-lightbox-nav villa-lightbox-prev" onClick={(e) => { e.stopPropagation(); handlePrev(); }}>
            <ChevronLeft size={28} />
          </button>
          <img
            src={villa.images[activeImage].src}
            alt={villa.images[activeImage].caption}
            className="villa-lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="villa-lightbox-caption">{villa.images[activeImage].caption}</p>
          <button className="villa-lightbox-nav villa-lightbox-next" onClick={(e) => { e.stopPropagation(); handleNext(); }}>
            <ChevronRight size={28} />
          </button>
        </div>
      )}

      {/* Content */}
      <div className="villa-page-body">
        {/* Title Block */}
        <div className="villa-title-block">
          <div className="villa-tags-row">
            {villa.tags.map((tag, i) => (
              <span key={i} className="villa-tag">{tag}</span>
            ))}
            {villa.seniorFriendly && (
              <span className="villa-tag villa-tag-special">Senior Citizen Friendly</span>
            )}
          </div>
          <h1 className="villa-name">{villa.name}</h1>
          <div className="villa-location-row">
            <MapPin size={16} style={{ color: "var(--clr-gold)", flexShrink: 0 }} />
            <span>{villa.fullAddress || villa.location}</span>
          </div>
          {villa.rating && renderStars(villa.rating)}
        </div>

        {/* Quick Stats */}
        <div className="villa-stats-bar">
          <div className="villa-stat">
            <Users size={20} />
            <div>
              <span className="villa-stat-val">Upto {villa.guests}</span>
              <span className="villa-stat-lbl">Guests</span>
            </div>
          </div>
          <div className="villa-stat-divider" />
          <div className="villa-stat">
            <BedDouble size={20} />
            <div>
              <span className="villa-stat-val">{villa.bedrooms}</span>
              <span className="villa-stat-lbl">Bedrooms</span>
            </div>
          </div>
          <div className="villa-stat-divider" />
          <div className="villa-stat">
            <Bath size={20} />
            <div>
              <span className="villa-stat-val">{villa.bathrooms}</span>
              <span className="villa-stat-lbl">Bathrooms</span>
            </div>
          </div>
          <div className="villa-stat-divider" />
          <div className="villa-stat">
            <Waves size={20} />
            <div>
              <span className="villa-stat-val">{villa.pools}</span>
              <span className="villa-stat-lbl">Pool</span>
            </div>
          </div>
        </div>

        {/* Inclusions strip */}
        <div className="villa-inclusions">
          <span className="villa-inclusion-item"><Coffee size={14} /> Complimentary Breakfast</span>
          <span className="villa-inclusion-item"><Wifi size={14} /> Unlimited WiFi</span>
          <span className="villa-inclusion-item"><Waves size={14} /> Private Pool</span>
          <span className="villa-inclusion-item"><Calendar size={14} /> Check In {villa.checkIn} &bull; Check Out {villa.checkOut}</span>
        </div>

        <div className="villa-divider" />

        {/* Description */}
        <section className="villa-section">
          <h2 className="villa-section-title">About the Villa</h2>
          {villa.description.split("\n\n").map((para, i) => (
            <p key={i} className="villa-desc-para">{para}</p>
          ))}
        </section>

        <div className="villa-divider" />

        {/* Bedroom Details */}
        <section className="villa-section">
          <h2 className="villa-section-title">Bedroom Details</h2>
          <div className="villa-bedrooms-grid">
            {villa.bedrooms_detail.map((bed, idx) => (
              <div key={idx} className="villa-bedroom-card">
                <div className="villa-bedroom-num">Room {idx + 1}</div>
                <BedDouble size={28} style={{ color: "var(--clr-gold)", margin: "8px 0" }} />
                <div className="villa-bedroom-type">{bed.type}</div>
                <div className="villa-bedroom-floor">{bed.floor}</div>
                {bed.ensuite && (
                  <div className="villa-bedroom-ensuite">
                    <Check size={12} /> Ensuite Bathroom
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="villa-divider" />

        {/* Amenities */}
        <section className="villa-section">
          <h2 className="villa-section-title">Amenities</h2>
          <div className="villa-amenities-grid">
            {villa.amenities.map((item, idx) => (
              <div key={idx} className="villa-amenity-item">
                <Check size={14} style={{ color: "var(--clr-gold)", flexShrink: 0 }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {villa.experiences && villa.experiences.length > 0 && (
          <>
            <div className="villa-divider" />
            <section className="villa-section">
              <h2 className="villa-section-title">In-Villa Experiences</h2>
              <div className="villa-experiences-list">
                {villa.experiences.map((exp, idx) => (
                  <span key={idx} className="villa-experience-tag">{exp}</span>
                ))}
              </div>
            </section>
          </>
        )}

        <div className="villa-divider" />

        {/* House Rules */}
        <section className="villa-section">
          <h2 className="villa-section-title">House Rules</h2>
          <ul className="villa-rules-list">
            {villa.houseRules.map((rule, idx) => (
              <li key={idx} className="villa-rule-item">
                <Shield size={14} style={{ color: "var(--clr-gold)", flexShrink: 0, marginTop: "2px" }} />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="villa-divider" />

        {/* Cancellation Policy */}
        <section className="villa-section">
          <h2 className="villa-section-title">Cancellation Policy</h2>
          <ul className="villa-rules-list">
            {villa.cancellationPolicy.map((policy, idx) => (
              <li key={idx} className="villa-rule-item">
                <Check size={14} style={{ color: "var(--clr-gold)", flexShrink: 0, marginTop: "2px" }} />
                <span>{policy}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Reviews */}
        {villa.reviews && villa.reviews.length > 0 && (
          <>
            <div className="villa-divider" />
            <section className="villa-section">
              <h2 className="villa-section-title">Guest Reviews</h2>
              {villa.rating && (
                <div className="villa-rating-summary">
                  {renderStars(villa.rating)}
                </div>
              )}
              <div className="villa-reviews-grid">
                {villa.reviews.map((review, idx) => (
                  <div key={idx} className="villa-review-card">
                    <div className="villa-review-header">
                      <div className="villa-review-avatar">{review.initials}</div>
                      <div>
                        <div className="villa-review-name">{review.name}</div>
                        <div className="villa-review-date">Stayed in {review.month}</div>
                      </div>
                      <div className="villa-review-stars">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} size={12} fill="var(--clr-gold)" stroke="none" />
                        ))}
                      </div>
                    </div>
                    <p className="villa-review-text">{review.text}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        <div className="villa-divider" />

        {/* Pricing & Contact */}
        <section className="villa-section villa-contact-section">
          <div className="villa-price-block">
            <span className="villa-price-label">Starting From</span>
            <span className="villa-price-val">{villa.currency === "USD" ? `${formatPrice(villa.priceUSD)}` : villa.currency === "EUR" ? `€${formatPrice(villa.priceEUR)}` : `₹${formatPrice(villa.priceINR)}`}</span>
            <span className="villa-price-sub">per night, excluding taxes</span>
          </div>

          <div className="villa-contact-block">
            <h2 className="villa-section-title" style={{ marginBottom: "20px" }}>Contact Malina Holidays</h2>
            <p className="villa-contact-desc">
              Interested in booking {villa.name}? Our luxury travel advisors are on hand to craft your perfect escape.
            </p>
            <div className="villa-contact-methods">
              <a href="tel:+918430600600" className="villa-contact-btn villa-contact-primary">
                <Phone size={18} />
                <span>+91 84306 00600</span>
              </a>
              <a href="mailto:concierge@malinaholidays.com" className="villa-contact-btn villa-contact-secondary">
                <Mail size={18} />
                <span>Email Concierge</span>
              </a>
              <a
                href="https://wa.me/918430600600"
                target="_blank"
                rel="noopener noreferrer"
                className="villa-contact-btn villa-contact-whatsapp"
              >
                <MessageCircle size={18} />
                <span>WhatsApp</span>
              </a>
            </div>
            <div className="villa-contact-address">
              <MapPin size={14} style={{ color: "var(--clr-gold)", flexShrink: 0 }} />
              <span>42A, Impression House, G D Ambekar Marg, Kohinoor Mill, Wadala, Mumbai, Maharashtra – 400031</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
