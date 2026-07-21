import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import BottomNavbar from "./components/BottomNavbar";
import PropertyCard from "./components/PropertyCard";
import PropertyDetail from "./components/PropertyDetail";
import ChatAssistant from "./components/ChatAssistant";
import BookingsList from "./components/BookingsList";
import VillaDetailPage from "./components/VillaDetailPage";
import { properties } from "./data/properties";
import { goaVillas } from "./data/goaVillas";
import {
  MessageSquare, MapPin, Compass, Star,
  ChevronLeft, ChevronRight, Sparkles,
  Shield, Heart, Waves, UtensilsCrossed, PawPrint, TrendingUp, ArrowRight
} from "lucide-react";

// ====== Goa Hero Banners (rotating) ======
const GOA_BANNERS = [
  {
    script: "Goa",
    headline: "Effortlessly",
    subline: "Where the sea meets the soul — discover handpicked villas in Goa's most serene corners",
    tag: "Heaven Experience",
    image: "/images/WhatsApp_Image_2026-07-13_at_7.19.03_PM.jpeg",
  },
  {
    script: "Bliss",
    headline: "Discover the Beaches",
    subline: "Wake up to the sound of waves in your private pool villa, steps from Goa's golden shores",
    tag: "Beach Life",
    image: "/images/WhatsApp_Image_2026-07-13_at_7.18.44_PM.jpeg",
  },
  {
    script: "Welcome",
    headline: "Pet-Friendly Stays",
    subline: "Your furry family is welcome here — luxury villas that love pets as much as you do",
    tag: "Pet Friendly",
    image: "/images/WhatsApp_Image_2026-07-13_at_7.18.25_PM.jpeg",
  },
  {
    script: "Restore",
    headline: "Wellness Retreats",
    subline: "Yoga, Ayurveda, and serene gardens — restore body and soul in Goa's finest wellness villas",
    tag: "Wellness & Yoga",
    image: "/images/WhatsApp_Image_2026-07-13_at_7.18.00_PM.jpeg",
  },
  {
    script: "Heritage",
    headline: "Portuguese Charm",
    subline: "Step into living history — restored colonial mansions with every modern luxury inside",
    tag: "Heritage Stays",
    image: "/images/WhatsApp_Image_2026-07-13_at_7.19.03_PM.jpeg",
  },
];

// ====== Stats Bar ======
const STATS = [
  { icon: Heart, value: "2 Lakh+", label: "Delighted Guests", color: "#e85d75" },
  { icon: Star, value: "4.9/5", label: "Customer Rating", color: "#c5a880" },
  { icon: Shield, value: "97%", label: "Satisfaction", color: "#3b9e6e" },
];

// ====== Explore Destinations ======
const DESTINATIONS = [
  {
    name: "North Goa",
    image: "https://d3oo9u3p09egds.cloudfront.net/filters:format(webp)/rental_property/monforte-vaddo-d/1.webp",
    desc: "Vibrant beaches, nightlife & luxury villas",
    target: "goa",
  },
  {
    name: "South Goa",
    image: "https://d3oo9u3p09egds.cloudfront.net/filters:format(webp)/rental_property/villa-brisa/Brisa_SS_isprava-9.webp",
    desc: "Serene shores, palm fringes & peaceful stays",
    target: "goa",
  },
  {
    name: "Coonoor",
    image: "https://d3oo9u3p09egds.cloudfront.net/filters:format(webp)/rental_property/amani-villas-12a/DJI_0094-Edit.webp",
    desc: "Misty hills, tea gardens & colonial charm",
    target: "coonoor",
  },
];

// ====== Collections For You ======
const COLLECTIONS = [
  { name: "Luma Villas", image: "/images/WhatsApp_Image_2026-07-13_at_7.18.00_PM.jpeg", target: "goa" },
  { name: "Infinity Pool", image: "/images/WhatsApp_Image_2026--07-13_at_7.19.03_PM.jpeg", target: "goa" },
  { name: "1 Bedroom", image: "/images/WhatsApp_Image_2026-07-13_at_7.18.25_PM.jpeg", target: "goa" },
  { name: "Pet-friendly", image: "/images/WhatsApp_Image_2026-07-13_at_7.18.44_PM.jpeg", target: "goa" },
  { name: "Wellness", image: "/images/WhatsApp_Image_2026-07-13_at_7.18.00_PM.jpeg", target: "goa" },
  { name: "Off-beat", image: "/images/WhatsApp_Image_2026-07-13_at_7.19.03_PM.jpeg", target: "coonoor" },
  { name: "Senior Friendly", image: "/images/WhatsApp_Image_2026-07-13_at_7.18.25_PM.jpeg", target: "goa" },
  { name: "Event-friendly", image: "/images/WhatsApp_Image_2026-07-13_at_7.18.44_PM.jpeg", target: "goa" },
];

// ====== Trending Villas (first 8) ======
const TRENDING_VILLAS = goaVillas.slice(0, 8);

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [favorites, setFavorites] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [bannerTransition, setBannerTransition] = useState(false);
  const bannerTimer = useRef(null);
  const trendingScrollRef = useRef(null);
  const navigate = useNavigate();
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedVilla, setSelectedVilla] = useState(null);
  const [chatProperty, setChatProperty] = useState(null);
  const [showGeneralChat, setShowGeneralChat] = useState(false);
  const [mapHoveredPin, setMapHoveredPin] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) advanceBanner(1);
      else advanceBanner(-1);
    }
  };

  useEffect(() => {
    const savedFavorites = localStorage.getItem("malina_favorites");
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    const savedBookings = localStorage.getItem("malina_bookings");
    if (savedBookings) setBookings(JSON.parse(savedBookings));
  }, []);

  useEffect(() => {
    bannerTimer.current = setInterval(() => advanceBanner(1), 5500);
    return () => clearInterval(bannerTimer.current);
  }, [bannerIndex]);

  const advanceBanner = (dir) => {
    setBannerTransition(true);
    setTimeout(() => {
      setBannerIndex(prev => (prev + dir + GOA_BANNERS.length) % GOA_BANNERS.length);
      setBannerTransition(false);
    }, 400);
    clearInterval(bannerTimer.current);
  };

  const goToBanner = (i) => {
    clearInterval(bannerTimer.current);
    setBannerTransition(true);
    setTimeout(() => { setBannerIndex(i); setBannerTransition(false); }, 400);
  };

  const scrollToCollection = (id) => {
    if (id === "goa") {
      navigate("/goa");
      return;
    }
    const el = document.getElementById(`collection-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollTrending = (dir) => {
    if (trendingScrollRef.current) {
      const scrollAmount = 320;
      trendingScrollRef.current.scrollBy({ left: dir * scrollAmount, behavior: "smooth" });
      setTimeout(() => {
        const el = trendingScrollRef.current;
        setCanScrollLeft(el.scrollLeft > 10);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
      }, 350);
    }
  };

  const handleToggleFavorite = (id) => {
    const updated = favorites.includes(id)
      ? favorites.filter(fid => fid !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem("malina_favorites", JSON.stringify(updated));
  };

  const handleAddBooking = (newBooking) => {
    const updated = [newBooking, ...bookings];
    setBookings(updated);
    localStorage.setItem("malina_bookings", JSON.stringify(updated));
  };

  const handleCancelBooking = (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking inquiry?")) {
      const updated = bookings.filter(b => b.id !== bookingId);
      setBookings(updated);
      localStorage.setItem("malina_bookings", JSON.stringify(updated));
    }
  };

  const getFilteredProperties = () => {
    return properties.filter(prop => {
      const matchesSearch =
        prop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.amenities.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
        prop.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = categoryFilter === "All" || prop.type === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  };

  const filteredProps = getFilteredProperties();
  const indiaProps = filteredProps.filter(p => p.category === "India Collection");
  const internationalProps = filteredProps.filter(p => p.category === "International Luxury");
  const currentBanner = GOA_BANNERS[bannerIndex];

  if (selectedVilla) {
    return <VillaDetailPage villa={selectedVilla} onBack={() => setSelectedVilla(null)} />;
  }

  const TrendingCard = ({ villa }) => (
    <div
      className="trending-slide"
      onClick={() => setSelectedVilla(villa)}
      style={{ cursor: "pointer", minWidth: "280px", width: "280px" }}
    >
      <div className="trending-slide-image" style={{
        position: "relative", borderRadius: "12px", overflow: "hidden",
        height: "220px", flexShrink: 0
      }}>
        <img
          src={villa.images[0].src}
          alt={villa.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          loading="lazy"
        />
        <div className="trending-slide-badge" style={{
          position: "absolute", top: "12px", left: "12px",
          backgroundColor: "rgba(197,168,128,0.9)", padding: "4px 10px",
          borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700, color: "#fff",
          letterSpacing: "0.5px"
        }}>
          {villa.tags[0] || "LUXURY"}
        </div>
        {villa.rating > 0 && (
          <div className="trending-slide-rating" style={{
            position: "absolute", top: "12px", right: "12px",
            backgroundColor: "rgba(0,0,0,0.6)", padding: "4px 8px",
            borderRadius: "6px", fontSize: "0.75rem", color: "#fff",
            display: "flex", alignItems: "center", gap: "4px"
          }}>
            <Star size={10} fill="#c5a880" stroke="none" />
            <span>{villa.rating}</span>
          </div>
        )}
      </div>
      <div className="trending-slide-info" style={{ padding: "10px 2px" }}>
        <div style={{ fontSize: "0.75rem", color: "var(--clr-gold)", fontWeight: 600 }}>
          <MapPin size={10} style={{ display: "inline", marginRight: "2px" }} />
          {villa.location}
        </div>
        <h4 style={{ fontSize: "0.95rem", margin: "4px 0 2px", fontWeight: 700, color: "var(--clr-navy)" }}>
          {villa.name}
        </h4>
        <span style={{ fontSize: "0.8rem", color: "var(--clr-grey-dark)" }}>
          {villa.bedrooms} BR &bull; Upto {villa.guests} Guests
        </span>
        <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--clr-navy)" }}>
            ₹{villa.priceINR?.toLocaleString("en-IN")}
          </span>
          <span style={{ fontSize: "0.75rem", color: "var(--clr-grey)" }}>/night</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app-container">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        favoritesCount={favorites.length}
      />

      <main className="main-content" style={{ padding: 0 }}>
        {activeTab === "home" && (
          <>
            {/* ===== HERO CAROUSEL ===== */}
            <section
              className="goa-hero"
              style={{ backgroundImage: `url(${currentBanner.image})` }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className={`goa-hero-overlay ${bannerTransition ? "fading" : ""}`} />
              <div className={`goa-hero-content ${bannerTransition ? "fading" : ""}`}>
                <span className="goa-hero-tag">{currentBanner.tag}</span>
                <h1 className="goa-hero-headline">
                  <span className="goa-hero-script">{currentBanner.script}</span>
                  <span className="goa-hero-bold">{currentBanner.headline}</span>
                </h1>
                <p className="goa-hero-subline">{currentBanner.subline}</p>
                <button className="goa-hero-cta" onClick={() => scrollToCollection("goa")}>
                  Explore Goa Villas
                </button>
              </div>
              <button className="goa-hero-arrow goa-hero-arrow-left" onClick={() => advanceBanner(-1)} aria-label="Previous">
                <ChevronLeft size={24} />
              </button>
              <button className="goa-hero-arrow goa-hero-arrow-right" onClick={() => advanceBanner(1)} aria-label="Next">
                <ChevronRight size={24} />
              </button>
              <div className="goa-hero-dots">
                {GOA_BANNERS.map((_, i) => (
                  <button
                    key={i}
                    className={`goa-hero-dot ${i === bannerIndex ? "active" : ""}`}
                    onClick={() => goToBanner(i)}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </section>

            {/* ===== STATS BAR ===== */}
            <div className="hp-stats-bar">
              {STATS.map((s, i) => (
                <div key={i} className="hp-stat-item">
                  <s.icon size={28} strokeWidth={1.5} style={{ color: s.color }} />
                  <div className="hp-stat-text">
                    <span className="hp-stat-value">{s.value}</span>
                    <span className="hp-stat-label">{s.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* ===== EXPLORE DESTINATIONS ===== */}
            <section className="hp-explore-section">
              <div className="hp-explore-inner">
                <h2 className="hp-explore-title">Explore Malina</h2>
                <p className="hp-explore-subtitle">Curated escapes across India's finest destinations</p>
                <div className="hp-destination-grid">
                  {DESTINATIONS.map(dest => (
                    <div
                      key={dest.name}
                      className="hp-destination-card"
                      onClick={() => scrollToCollection(dest.target)}
                    >
                      <div className="hp-destination-image">
                        <img src={dest.image} alt={dest.name} loading="lazy" />
                        <div className="hp-destination-overlay" />
                      </div>
                      <div className="hp-destination-content">
                        <h3>{dest.name}</h3>
                        <p>{dest.desc}</p>
                        <span className="hp-destination-link">
                          Explore <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ===== COLLECTIONS FOR YOU (Gallery grid) ===== */}
            <section className="hp-collections-section">
              <div className="hp-collections-inner">
                <div className="hp-section-heading">
                  <span className="hp-heading-line" />
                  <span className="hp-heading-diamond" />
                  <h2>Collections For You</h2>
                  <span className="hp-heading-diamond" />
                  <span className="hp-heading-line" />
                </div>
                <div className="hp-collections-gallery">
                  {COLLECTIONS.map((col, i) => (
                    <div
                      key={i}
                      className="hp-collection-tile"
                      onClick={() => scrollToCollection(col.target)}
                    >
                      <img src={col.image} alt={col.name} loading="lazy" />
                      <div className="hp-collection-tile-overlay">
                        <span>{col.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ===== TRENDING THIS SEASON ===== */}
            <section className="hp-trending-section">
              <div className="hp-trending-header">
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <TrendingUp size={22} style={{ color: "var(--clr-gold)" }} />
                    <h2 className="section-title" style={{ margin: 0 }}>Trending This Season</h2>
                  </div>
                  <p style={{ color: "var(--clr-grey-dark)", fontSize: "0.85rem", marginTop: "4px" }}>
                    Most booked luxury villas in Goa right now
                  </p>
                </div>
                <button className="view-all-btn" onClick={() => navigate("/goa")}>
                  View All <ArrowRight size={14} />
                </button>
              </div>
              <div className="trending-carousel-wrapper">
                {canScrollLeft && (
                  <button className="trending-scroll-btn trending-scroll-left" onClick={() => scrollTrending(-1)}>
                    <ChevronLeft size={20} />
                  </button>
                )}
                <div className="trending-carousel" ref={trendingScrollRef}
                  onScroll={() => {
                    const el = trendingScrollRef.current;
                    if (el) {
                      setCanScrollLeft(el.scrollLeft > 10);
                      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
                    }
                  }}
                >
                  {TRENDING_VILLAS.map(villa => (
                    <TrendingCard key={villa.id} villa={villa} />
                  ))}
                </div>
                {canScrollRight && (
                  <button className="trending-scroll-btn trending-scroll-right" onClick={() => scrollTrending(1)}>
                    <ChevronRight size={20} />
                  </button>
                )}
              </div>
            </section>

            {/* ===== QUICK LINKS / FOOTER ===== */}
            <section className="hp-quicklinks-section">
              <div className="hp-quicklinks-inner">
                <div className="hp-quicklinks-col">
                  <h4>Destinations</h4>
                  <a onClick={() => navigate("/goa")}>North Goa</a>
                  <a onClick={() => navigate("/goa")}>South Goa</a>
                  <a onClick={() => scrollToCollection("coonoor")}>Coonoor</a>
                </div>
                <div className="hp-quicklinks-col">
                  <h4>Collections</h4>
                  <a onClick={() => navigate("/goa")}>Luma Villas</a>
                  <a onClick={() => navigate("/goa")}>Wellness Retreats</a>
                  <a onClick={() => navigate("/goa")}>Pet-Friendly</a>
                  <a onClick={() => navigate("/goa")}>Event-Friendly</a>
                </div>
                <div className="hp-quicklinks-col">
                  <h4>Support</h4>
                  <a href="tel:+919315572283">+91 93155 72283</a>
                  <a href="mailto:concierge@malinaholidays.com">Email Concierge</a>
                  <a href="https://wa.me/919315572283" target="_blank" rel="noopener noreferrer">WhatsApp</a>
                  <a onClick={() => setShowGeneralChat(true)}>Live Chat</a>
                </div>
                <div className="hp-quicklinks-col">
                  <h4>Malina Holidays</h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--clr-grey-dark)", lineHeight: 1.6 }}>
                    Curating exceptional villa experiences across India's most beautiful destinations since 2018.
                  </p>
                </div>
              </div>
              <div className="hp-quicklinks-bottom">
                <p>&copy; 2026 Malina Holidays. All rights reserved.</p>
              </div>
            </section>
          </>
        )}

        {/* ===== EXPLORE / MAP VIEW ===== */}
        {activeTab === "explore" && (
          <section className="section" style={{ padding: "0 20px" }}>
            <div className="section-header" style={{ marginBottom: "8px" }}>
              <h2 className="section-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Compass size={28} style={{ color: "var(--clr-gold)" }} />
                Explore The World of Malina
              </h2>
            </div>
            <p style={{ color: "var(--clr-grey-dark)", marginBottom: "32px" }}>
              Interact with our curated map pins to discover ultra-luxury hotel destinations around the globe.
            </p>
            <div style={{
              position: "relative", width: "100%", height: "380px",
              backgroundColor: "var(--clr-navy)", borderRadius: "var(--radius-lg)",
              overflow: "hidden", marginBottom: "32px", boxShadow: "var(--shadow-md)"
            }}>
              <svg width="100%" height="100%" viewBox="0 0 1000 500" style={{ opacity: 0.25 }}>
                {[...Array(10)].map((_, i) => (
                  <line key={`x-${i}`} x1={i * 100} y1="0" x2={i * 100} y2="500" stroke="var(--clr-gold-light)" strokeWidth="0.5" strokeDasharray="5,5" />
                ))}
                {[...Array(6)].map((_, i) => (
                  <line key={`y-${i}`} x1="0" y1={i * 85 + 20} x2="1000" y2={i * 85 + 20} stroke="var(--clr-gold-light)" strokeWidth="0.5" strokeDasharray="5,5" />
                ))}
                <path d="M150,120 Q200,90 280,100 Q320,130 300,180 Q250,220 200,200 Z" fill="#1b304c" />
                <path d="M480,120 Q560,80 620,100 Q650,150 580,220 Q540,250 490,200 Z" fill="#1b304c" />
                <path d="M600,200 Q640,160 700,210 Q740,280 680,320 Q640,320 600,260 Z" fill="#1b304c" />
                <path d="M220,240 Q280,260 300,320 Q320,380 250,420 Q200,360 210,300 Z" fill="#1b304c" />
                <path d="M500,280 Q560,280 580,340 Q550,420 510,400 Q480,350 480,300 Z" fill="#1b304c" />
              </svg>
              {properties.map((prop) => {
                let x = 500, y = 250;
                if (prop.id === "hotel-de-paris") { x = 485; y = 145; }
                else if (prop.id === "aman-venice") { x = 502; y = 135; }
                else if (prop.id === "grace-hotel") { x = 522; y = 168; }
                else if (prop.id === "taj-lake-palace") { x = 650; y = 210; }
                else if (prop.id === "w-goa") { x = 658; y = 232; }
                else if (prop.id === "the-leela-kovalam") { x = 665; y = 255; }
                const isHovered = mapHoveredPin === prop.id;
                return (
                  <div
                    key={prop.id}
                    style={{
                      position: "absolute", left: `${(x / 1000) * 100}%`, top: `${(y / 500) * 100}%`,
                      transform: "translate(-50%, -50%)", cursor: "pointer", zIndex: isHovered ? 10 : 5
                    }}
                    onMouseEnter={() => setMapHoveredPin(prop.id)}
                    onMouseLeave={() => setMapHoveredPin(null)}
                    onClick={() => setSelectedProperty(prop)}
                  >
                    <div style={{
                      position: "absolute", width: isHovered ? "28px" : "18px", height: isHovered ? "28px" : "18px",
                      borderRadius: "50%", backgroundColor: "var(--clr-gold)", opacity: 0.4,
                      animation: "pulse-ring 1.8s cubic-bezier(0.215, 0.610, 0.355, 1) infinite",
                      transform: "translate(-25%, -25%)", transition: "width 0.2s, height 0.2s"
                    }} />
                    <div style={{
                      width: "12px", height: "12px", borderRadius: "50%",
                      backgroundColor: isHovered ? "var(--clr-white)" : "var(--clr-gold)",
                      border: "2px solid var(--clr-navy)", boxShadow: "0 0 10px rgba(197,168,128,0.8)",
                      transition: "background-color 0.2s"
                    }} />
                    {isHovered && (
                      <div style={{
                        position: "absolute", bottom: "22px", left: "50%", transform: "translateX(-50%)",
                        backgroundColor: "var(--clr-white)", color: "var(--clr-navy)", padding: "8px 12px",
                        borderRadius: "8px", boxShadow: "var(--shadow-md)", fontSize: "0.85rem",
                        fontWeight: "600", whiteSpace: "nowrap", display: "flex", flexDirection: "column",
                        alignItems: "center", gap: "2px", pointerEvents: "none", animation: "fadeIn 0.2s ease"
                      }}>
                        <span style={{ fontSize: "0.9rem", color: "var(--clr-navy)" }}>{prop.name}</span>
                        <span style={{ fontSize: "0.75rem", color: "var(--clr-gold-dark)", display: "flex", alignItems: "center", gap: "2px" }}>
                          <MapPin size={10} /> {prop.location}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
              <div style={{
                position: "absolute", bottom: "16px", left: "20px", color: "var(--clr-white)",
                fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "8px",
                backgroundColor: "rgba(11,26,48,0.6)", padding: "8px 16px", borderRadius: "var(--radius-sm)"
              }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--clr-gold)", display: "inline-block" }} />
                <span>Select a location pin to explore bookings</span>
              </div>
            </div>
            <div className="section-header">
              <h2 className="section-title">All Destinations ({properties.length})</h2>
            </div>
            <div className="properties-grid">
              {properties.map(prop => (
                <PropertyCard
                  key={prop.id}
                  property={prop}
                  isFavorite={favorites.includes(prop.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onViewDetails={setSelectedProperty}
                  onOpenChat={setChatProperty}
                />
              ))}
            </div>
          </section>
        )}

        {/* ===== FAVORITES ===== */}
        {activeTab === "favorites" && (
          <section className="section" style={{ padding: "0 20px" }}>
            <div className="section-header">
              <h2 className="section-title">My Saved Escapes</h2>
            </div>
            {favorites.length === 0 ? (
              <div className="empty-state">
                <MapPin size={48} style={{ strokeWidth: 1.5, color: "var(--clr-gold)" }} />
                <h3>Your Favorites List is Empty</h3>
                <p>Browse our handpicked villas and tap the heart icon to save them to your personal shortlist.</p>
                <button className="browse-now-btn" onClick={() => setActiveTab("home")}>Start Discovering</button>
              </div>
            ) : (
              <div className="properties-grid">
                {properties.filter(prop => favorites.includes(prop.id)).map(prop => (
                  <PropertyCard
                    key={prop.id}
                    property={prop}
                    isFavorite={true}
                    onToggleFavorite={handleToggleFavorite}
                    onViewDetails={setSelectedProperty}
                    onOpenChat={setChatProperty}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ===== BOOKINGS ===== */}
        {activeTab === "bookings" && (
          <BookingsList
            bookings={bookings}
            onCancelBooking={handleCancelBooking}
            onBrowseClick={() => setActiveTab("home")}
          />
        )}
      </main>

      <button
        className="chat-float-btn"
        onClick={() => setShowGeneralChat(true)}
        style={{
          position: "fixed", bottom: "90px", right: "24px",
          width: "56px", height: "56px", borderRadius: "50%",
          backgroundColor: "var(--clr-navy)", color: "var(--clr-white)",
          boxShadow: "var(--shadow-lg)", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 45, cursor: "pointer",
          transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1) translateY(-2px)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1.0) translateY(0)"}
        aria-label="Contact Concierge"
      >
        <MessageSquare size={24} />
      </button>

      <BottomNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {selectedProperty && (
        <PropertyDetail property={selectedProperty} onClose={() => setSelectedProperty(null)} onAddBooking={handleAddBooking} />
      )}
      {chatProperty && (
        <ChatAssistant property={chatProperty} onClose={() => setChatProperty(null)} onAddBooking={handleAddBooking} />
      )}
      {showGeneralChat && (
        <ChatAssistant property={null} onClose={() => setShowGeneralChat(false)} onAddBooking={handleAddBooking} />
      )}

      <style>{`
        @keyframes pulse-ring {
          0% { transform: translate(-25%,-25%) scale(0.35); opacity: 0.8; }
          80%, 100% { transform: translate(-25%,-25%) scale(1.2); opacity: 0; }
        }
        @media (min-width: 768px) {
          .chat-float-btn { bottom: 24px !important; }
        }
        /* ===== Section Containers ===== */
        .hp-explore-section,
        .hp-collections-section {
          padding: 48px 20px;
        }
        .hp-explore-inner,
        .hp-collections-inner {
          max-width: 1200px;
          margin: 0 auto;
        }
        @media (min-width: 1200px) {
          .hp-explore-section,
          .hp-collections-section {
            padding: 60px 0;
          }
        }
        @media (max-width: 600px) {
          .hp-explore-section,
          .hp-collections-section {
            padding: 32px 16px;
          }
        }
        /* ===== Destination Cards ===== */
        .hp-destination-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 20px;
        }
        .hp-destination-card {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }
        .hp-destination-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.12);
        }
        .hp-destination-image {
          position: relative;
          height: 220px;
          overflow: hidden;
        }
        .hp-destination-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .hp-destination-card:hover .hp-destination-image img {
          transform: scale(1.05);
        }
        .hp-destination-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(11,26,48,0.8) 0%, transparent 60%);
        }
        .hp-destination-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 20px;
          color: #fff;
          z-index: 2;
        }
        .hp-destination-content h3 {
          font-size: 1.2rem;
          font-weight: 700;
          margin: 0 0 4px;
        }
        .hp-destination-content p {
          font-size: 0.8rem;
          opacity: 0.85;
          margin: 0 0 8px;
        }
        .hp-destination-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--clr-gold);
        }
        @media (max-width: 600px) {
          .hp-destination-grid { grid-template-columns: 1fr; }
          .hp-destination-image { height: 180px; }
        }
        /* ===== Collections Gallery (mobile grid) ===== */
        .hp-collections-gallery {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-top: 20px;
        }
        .hp-collection-tile {
          position: relative;
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          aspect-ratio: 1;
          transition: transform 0.3s ease;
        }
        .hp-collection-tile:hover {
          transform: scale(1.03);
        }
        .hp-collection-tile img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .hp-collection-tile-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(11,26,48,0.75), transparent 50%);
          display: flex;
          align-items: flex-end;
          padding: 12px;
        }
        .hp-collection-tile-overlay span {
          color: #fff;
          font-weight: 700;
          font-size: 0.8rem;
          text-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }
        @media (max-width: 600px) {
          .hp-collections-gallery { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .hp-collection-tile { aspect-ratio: 4/3; border-radius: 10px; }
          .hp-collection-tile-overlay span { font-size: 0.75rem; }
        }
        /* ===== Trending Carousel ===== */
        .hp-trending-section {
          padding: 40px 20px;
          background-color: var(--clr-cream);
        }
        .hp-trending-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          max-width: 1200px;
          margin: 0 auto 20px;
        }
        .trending-carousel-wrapper {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
        }
        .trending-carousel {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          padding: 8px 4px;
          scrollbar-width: none;
        }
        .trending-carousel::-webkit-scrollbar { display: none; }
        .trending-slide {
          scroll-snap-align: start;
          flex-shrink: 0;
        }
        .trending-scroll-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--clr-white);
          border: 1px solid var(--clr-light-grey);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
          transition: all 0.2s ease;
        }
        .trending-scroll-btn:hover { background: var(--clr-gold); color: #fff; border-color: var(--clr-gold); }
        .trending-scroll-left { left: -12px; }
        .trending-scroll-right { right: -12px; }
        @media (max-width: 600px) {
          .trending-scroll-btn { display: none !important; }
          .hp-trending-section { padding: 24px 16px; }
        }
        /* ===== Quick Links ===== */
        .hp-quicklinks-section {
          background: var(--clr-navy);
          color: var(--clr-white);
          padding: 48px 20px 24px;
        }
        .hp-quicklinks-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
        }
        .hp-quicklinks-col h4 {
          color: var(--clr-gold);
          font-size: 1rem;
          margin: 0 0 16px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .hp-quicklinks-col a {
          display: block;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          font-size: 0.9rem;
          padding: 4px 0;
          cursor: pointer;
          transition: color 0.2s;
        }
        .hp-quicklinks-col a:hover { color: var(--clr-gold); }
        .hp-quicklinks-bottom {
          max-width: 1200px;
          margin: 32px auto 0;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.1);
          text-align: center;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.4);
        }
        @media (max-width: 600px) {
          .hp-quicklinks-inner { grid-template-columns: repeat(2, 1fr); gap: 24px; }
        }
      `}</style>
    </div>
  );
}