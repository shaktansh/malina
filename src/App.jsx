import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import BottomNavbar from "./components/BottomNavbar";
import PropertyCard from "./components/PropertyCard";
import PropertyDetail from "./components/PropertyDetail";
import ChatAssistant from "./components/ChatAssistant";
import BookingsList from "./components/BookingsList";
import VillaDetailPage from "./components/VillaDetailPage";
import { properties } from "./data/properties";
import { baliVillas } from "./data/baliVillas";
import { italyVillas } from "./data/italyVillas";
import { coonoorVillas } from "./data/coonoorVillas";
import { MessageSquare, MapPin, Compass, Search, Star } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [favorites, setFavorites] = useState([]);
  const [bookings, setBookings] = useState([]);
  
  // Drawer/Modal States
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedVilla, setSelectedVilla] = useState(null);
  const [chatProperty, setChatProperty] = useState(null);
  const [showGeneralChat, setShowGeneralChat] = useState(false);
  const [mapHoveredPin, setMapHoveredPin] = useState(null);

  // Load from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("malina_favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    const savedBookings = localStorage.getItem("malina_bookings");
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
  }, []);

  // Save favorites to localStorage
  const handleToggleFavorite = (id) => {
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter(favId => favId !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem("malina_favorites", JSON.stringify(updated));
  };

  // Add booking request
  const handleAddBooking = (newBooking) => {
    const updated = [newBooking, ...bookings];
    setBookings(updated);
    localStorage.setItem("malina_bookings", JSON.stringify(updated));
  };

  // Cancel booking request
  const handleCancelBooking = (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking inquiry?")) {
      const updated = bookings.filter(b => b.id !== bookingId);
      setBookings(updated);
      localStorage.setItem("malina_bookings", JSON.stringify(updated));
    }
  };

  // Filter properties logic
  const getFilteredProperties = () => {
    return properties.filter(prop => {
      const matchesSearch = 
        prop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.amenities.some(amenity => amenity.toLowerCase().includes(searchQuery.toLowerCase())) ||
        prop.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = 
        categoryFilter === "All" || 
        prop.type === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  };

  const filteredProps = getFilteredProperties();
  const indiaProps = filteredProps.filter(p => p.category === "India Collection");
  const internationalProps = filteredProps.filter(p => p.category === "International Luxury");

  // Full-page villa detail view takes over the entire screen
  if (selectedVilla) {
    return (
      <VillaDetailPage
        villa={selectedVilla}
        onBack={() => setSelectedVilla(null)}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Header Section */}
      <Header 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        favoritesCount={favorites.length}
      />

      <main className="main-content">
        {/* VIEW 1: HOME VIEW */}
        {activeTab === "home" && (
          <>
            {/* Hero Banner */}
            <section className="hero">
              <h1>Featured Luxury<br />Villas & Resorts</h1>
              <p>An exclusive collection of the world's most prestigious escapes, handpicked for extraordinary travel experiences.</p>
            </section>

            {/* Category Filter Pills */}
            <div className="category-pills">
              <button 
                className={`pill-btn ${categoryFilter === "All" ? "active" : ""}`}
                onClick={() => setCategoryFilter("All")}
              >
                All Escapes
              </button>
              <button 
                className={`pill-btn ${categoryFilter === "Private Villas" ? "active" : ""}`}
                onClick={() => setCategoryFilter("Private Villas")}
              >
                Private Villas
              </button>
              <button 
                className={`pill-btn ${categoryFilter === "Wellness Retreats" ? "active" : ""}`}
                onClick={() => setCategoryFilter("Wellness Retreats")}
              >
                Wellness Retreats
              </button>
            </div>

            {/* Empty State for Filters */}
            {filteredProps.length === 0 && (
              <div className="empty-state" style={{ padding: "40px" }}>
                <h3>No Properties Match Your Search</h3>
                <p>Try searching for different destinations, properties, or filters.</p>
                <button className="browse-now-btn" onClick={() => { setSearchQuery(""); setCategoryFilter("All"); }}>
                  Reset Filters
                </button>
              </div>
            )}

            {/* Italy Collection Section */}
            <section className="section">
              <div className="section-header">
                <h2 className="section-title">Italy Collection</h2>
              </div>
              <div className="properties-grid">
                {italyVillas.map(villa => (
                  <div
                    key={villa.id}
                    className="property-card"
                    onClick={() => setSelectedVilla(villa)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="card-image-container">
                      <img src={villa.images[0].src} alt={villa.name} className="card-image" loading="lazy" />
                      <div className="card-badge-container">
                        {villa.tags.map((tag, i) => (
                          <span key={i} className="card-badge badge-luxury">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="card-content">
                      <div className="card-meta">
                        <span className="card-location">
                          <MapPin size={14} style={{ color: "var(--clr-gold)" }} /> {villa.location}
                        </span>
                      </div>
                      <h3 className="card-title">{villa.name}</h3>
                      <div className="card-amenities">
                        <span>Upto {villa.guests} Guests</span>
                        <span className="amenity-dot">•</span>
                        <span>{villa.bedrooms} Bedrooms</span>
                        <span className="amenity-dot">•</span>
                        <span>{villa.bathrooms} Bathrooms</span>
                      </div>
                      <div className="card-footer">
                        <div className="card-price-container">
                          <span className="price-label">Starting From</span>
                          <span className="price-val">€{villa.priceEUR.toLocaleString("en-IE")}</span>
                          <span className="price-sub">/night</span>
                        </div>
                        <button className="view-property-btn">View Details</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Bali Collection Section */}
            <section className="section">
              <div className="section-header">
                <h2 className="section-title">Bali Collection</h2>
              </div>
              <div className="properties-grid">
                {baliVillas.map(villa => (
                  <div
                    key={villa.id}
                    className="property-card"
                    onClick={() => setSelectedVilla(villa)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="card-image-container">
                      <img src={villa.images[0].src} alt={villa.name} className="card-image" loading="lazy" />
                      <div className="card-badge-container">
                        {villa.tags.map((tag, i) => (
                          <span key={i} className="card-badge badge-luxury">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="card-content">
                      <div className="card-meta">
                        <span className="card-location">
                          <MapPin size={14} style={{ color: "var(--clr-gold)" }} /> {villa.location}
                        </span>
                      </div>
                      <h3 className="card-title">{villa.name}</h3>
                      <div className="card-amenities">
                        <span>Upto {villa.guests} Guests</span>
                        <span className="amenity-dot">•</span>
                        <span>{villa.bedrooms} Bedrooms</span>
                        <span className="amenity-dot">•</span>
                        <span>{villa.bathrooms} Bathrooms</span>
                      </div>
                      <div className="card-footer">
                        <div className="card-price-container">
                          <span className="price-label">Starting From</span>
                          <span className="price-val">${villa.priceUSD.toLocaleString("en-US")}</span>
                          <span className="price-sub">/night</span>
                        </div>
                        <button className="view-property-btn">View Details</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Coonoor Collection Section */}
            <section className="section">
              <div className="section-header">
                <h2 className="section-title">Coonoor Collection</h2>
              </div>
              <div className="properties-grid">
                {coonoorVillas.map(villa => (
                  <div
                    key={villa.id}
                    className="property-card"
                    onClick={() => setSelectedVilla(villa)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="card-image-container">
                      <img src={villa.images[0].src} alt={villa.name} className="card-image" loading="lazy" />
                      <div className="card-badge-container">
                        {villa.tags.map((tag, i) => (
                          <span key={i} className="card-badge badge-luxury">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="card-content">
                      <div className="card-meta">
                        <span className="card-location">
                          <MapPin size={14} style={{ color: "var(--clr-gold)" }} /> {villa.location}
                        </span>
                      </div>
                      <h3 className="card-title">{villa.name}</h3>
                      <div className="card-amenities">
                        <span>Upto {villa.guests} Guests</span>
                        <span className="amenity-dot">•</span>
                        <span>{villa.bedrooms} Bedrooms</span>
                        <span className="amenity-dot">•</span>
                        <span>{villa.bathrooms} Bathrooms</span>
                      </div>
                      <div className="card-footer">
                        <div className="card-price-container">
                          <span className="price-label">Starting From</span>
                          <span className="price-val">₹{villa.priceINR.toLocaleString("en-IN")}</span>
                          <span className="price-sub">/night</span>
                        </div>
                        <button className="view-property-btn">View Details</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* India Collection Section */}
            {indiaProps.length > 0 && (
              <section className="section">
                <div className="section-header">
                  <h2 className="section-title">India Collection</h2>
                  <button className="view-all-btn" onClick={() => setActiveTab("explore")}>View All</button>
                </div>
                <div className="properties-grid">
                  {indiaProps.map(prop => (
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

            {/* International Luxury Section */}
            {internationalProps.length > 0 && (
              <section className="section">
                <div className="section-header">
                  <h2 className="section-title">International Luxury</h2>
                  <button className="view-all-btn" onClick={() => setActiveTab("explore")}>Explore All</button>
                </div>
                <div className="properties-grid">
                  {internationalProps.map(prop => (
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
          </>
        )}

        {/* VIEW 2: EXPLORE / MAP VIEW */}
        {activeTab === "explore" && (
          <section className="section">
            <div className="section-header" style={{ marginBottom: "8px" }}>
              <h2 className="section-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Compass size={28} className="text-gold" style={{ color: "var(--clr-gold)" }} />
                Explore The World of Malina
              </h2>
            </div>
            <p style={{ color: "var(--clr-grey-dark)", marginBottom: "32px" }}>
              Interact with our curated map pins to discover ultra-luxury hotel destinations around the globe.
            </p>

            {/* SVG Interactive Map Overlay */}
            <div style={{
              position: "relative",
              width: "100%",
              height: "380px",
              backgroundColor: "var(--clr-navy)",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              marginBottom: "32px",
              boxShadow: "var(--shadow-md)"
            }}>
              {/* Stylized background lines for world map feeling */}
              <svg 
                width="100%" 
                height="100%" 
                viewBox="0 0 1000 500" 
                style={{ opacity: 0.25 }}
              >
                {/* World contour simulation (simple horizontal/vertical grid) */}
                {[...Array(10)].map((_, i) => (
                  <line key={`x-${i}`} x1={i * 100} y1="0" x2={i * 100} y2="500" stroke="var(--clr-gold-light)" strokeWidth="0.5" strokeDasharray="5,5" />
                ))}
                {[...Array(6)].map((_, i) => (
                  <line key={`y-${i}`} x1="0" y1={i * 85 + 20} x2="1000" y2={i * 85 + 20} stroke="var(--clr-gold-light)" strokeWidth="0.5" strokeDasharray="5,5" />
                ))}
                
                {/* Simplified SVG Map paths of continents */}
                <path d="M150,120 Q200,90 280,100 Q320,130 300,180 Q250,220 200,200 Z" fill="#1b304c" />
                <path d="M480,120 Q560,80 620,100 Q650,150 580,220 Q540,250 490,200 Z" fill="#1b304c" />
                <path d="M600,200 Q640,160 700,210 Q740,280 680,320 Q640,320 600,260 Z" fill="#1b304c" />
                <path d="M220,240 Q280,260 300,320 Q320,380 250,420 Q200,360 210,300 Z" fill="#1b304c" />
                <path d="M500,280 Q560,280 580,340 Q550,420 510,400 Q480,350 480,300 Z" fill="#1b304c" />
              </svg>

              {/* Pulsing Coordinates */}
              {properties.map((prop) => {
                // Approximate relative map layout coordinates
                // 1. Monaco: x: 490, y: 155
                // 2. Venice: x: 505, y: 145
                // 3. Santorini: x: 525, y: 175
                // 4. Udaipur: x: 670, y: 220
                // 5. Goa: x: 675, y: 240
                // 6. Kovalam: x: 680, y: 260
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
                      position: "absolute",
                      left: `${(x / 1000) * 100}%`,
                      top: `${(y / 500) * 100}%`,
                      transform: "translate(-50%, -50%)",
                      cursor: "pointer",
                      zIndex: isHovered ? 10 : 5
                    }}
                    onMouseEnter={() => setMapHoveredPin(prop.id)}
                    onMouseLeave={() => setMapHoveredPin(null)}
                    onClick={() => setSelectedProperty(prop)}
                  >
                    {/* Ring Pulse Effect */}
                    <div style={{
                      position: "absolute",
                      width: isHovered ? "28px" : "18px",
                      height: isHovered ? "28px" : "18px",
                      borderRadius: "50%",
                      backgroundColor: "var(--clr-gold)",
                      opacity: 0.4,
                      animation: "pulse-ring 1.8s cubic-bezier(0.215, 0.610, 0.355, 1) infinite",
                      transform: "translate(-25%, -25%)",
                      transition: "width 0.2s, height 0.2s"
                    }}></div>
                    
                    {/* Center Core Dot */}
                    <div style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: isHovered ? "var(--clr-white)" : "var(--clr-gold)",
                      border: "2px solid var(--clr-navy)",
                      boxShadow: "0 0 10px rgba(197, 168, 128, 0.8)",
                      transition: "background-color 0.2s"
                    }}></div>

                    {/* Property Hover Label Card */}
                    {isHovered && (
                      <div style={{
                        position: "absolute",
                        bottom: "22px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "var(--clr-white)",
                        color: "var(--clr-navy)",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        boxShadow: "var(--shadow-md)",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "2px",
                        pointerEvents: "none",
                        animation: "fadeIn 0.2s ease"
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
                position: "absolute",
                bottom: "16px",
                left: "20px",
                color: "var(--clr-white)",
                fontSize: "0.85rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "rgba(11, 26, 48, 0.6)",
                padding: "8px 16px",
                borderRadius: "var(--radius-sm)"
              }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--clr-gold)", display: "inline-block" }}></span>
                <span>Select a location pin to explore bookings</span>
              </div>
            </div>

            {/* List of all Properties */}
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

        {/* VIEW 3: FAVORITES VIEW */}
        {activeTab === "favorites" && (
          <section className="section">
            <div className="section-header">
              <h2 className="section-title">My Saved Escapes</h2>
            </div>

            {favorites.length === 0 ? (
              <div className="empty-state">
                <MapPin size={48} className="text-gold" style={{ strokeWidth: 1.5, color: "var(--clr-gold)" }} />
                <h3>Your Favorites List is Empty</h3>
                <p>Browse our handpicked villas and tap the heart icon to save them to your personal shortlist.</p>
                <button className="browse-now-btn" onClick={() => setActiveTab("home")}>
                  Start Discovering
                </button>
              </div>
            ) : (
              <div className="properties-grid">
                {properties
                  .filter(prop => favorites.includes(prop.id))
                  .map(prop => (
                    <PropertyCard 
                      key={prop.id} 
                      property={prop} 
                      isFavorite={true}
                      onToggleFavorite={handleToggleFavorite}
                      onViewDetails={setSelectedProperty}
                      onOpenChat={setChatProperty}
                    />
                  ))
                }
              </div>
            )}
          </section>
        )}

        {/* VIEW 4: MY BOOKINGS VIEW */}
        {activeTab === "bookings" && (
          <BookingsList 
            bookings={bookings} 
            onCancelBooking={handleCancelBooking} 
            onBrowseClick={() => setActiveTab("home")}
          />
        )}
      </main>

      {/* Floating Concierge Chat Button */}
      <button 
        className="chat-float-btn"
        onClick={() => setShowGeneralChat(true)}
        style={{
          position: "fixed",
          bottom: "90px",
          right: "24px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          backgroundColor: "var(--clr-navy)",
          color: "var(--clr-white)",
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 45,
          cursor: "pointer",
          transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1) translateY(-2px)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1.0) translateY(0)"}
        aria-label="Contact Concierge"
      >
        <MessageSquare size={24} />
      </button>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Drawer Modals */}
      {selectedProperty && (
        <PropertyDetail 
          property={selectedProperty} 
          onClose={() => setSelectedProperty(null)}
          onAddBooking={handleAddBooking}
        />
      )}

      {chatProperty && (
        <ChatAssistant 
          property={chatProperty} 
          onClose={() => setChatProperty(null)}
          onAddBooking={handleAddBooking}
        />
      )}

      {showGeneralChat && (
        <ChatAssistant 
          property={null} 
          onClose={() => setShowGeneralChat(false)}
          onAddBooking={handleAddBooking}
        />
      )}

      {/* CSS Animation Keyframes for map pulse and float */}
      <style>{`
        @keyframes pulse-ring {
          0% { transform: translate(-25%, -25%) scale(0.35); opacity: 0.8; }
          80%, 100% { transform: translate(-25%, -25%) scale(1.2); opacity: 0; }
        }
        @media (min-width: 768px) {
          .chat-float-btn {
            bottom: 24px !important;
          }
        }
      `}</style>
    </div>
  );
}
