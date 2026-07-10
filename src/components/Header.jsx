import React, { useState } from "react";
import { Search, Menu, X, Heart, Calendar, Home as HomeIcon } from "lucide-react";

export default function Header({ 
  searchQuery, 
  setSearchQuery, 
  activeTab, 
  setActiveTab,
  favoritesCount
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo" onClick={() => handleNavClick("home")} style={{ cursor: "pointer" }}>
          Malina <span className="logo-sub">Holidays</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <button 
            className={`nav-link ${activeTab === "home" ? "active" : ""}`}
            onClick={() => handleNavClick("home")}
          >
            Home
          </button>
          <button 
            className={`nav-link ${activeTab === "favorites" ? "active" : ""}`}
            onClick={() => handleNavClick("favorites")}
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            Favorites
            {favoritesCount > 0 && (
              <span style={{
                background: "var(--clr-gold)",
                color: "var(--clr-navy)",
                fontSize: "0.75rem",
                fontWeight: "700",
                padding: "2px 6px",
                borderRadius: "10px",
                lineHeight: "1"
              }}>
                {favoritesCount}
              </span>
            )}
          </button>
          <button 
            className={`nav-link ${activeTab === "bookings" ? "active" : ""}`}
            onClick={() => handleNavClick("bookings")}
          >
            Bookings
          </button>
        </nav>

        {/* Right Icons: Search & Menu */}
        <div className="header-right">
          {/* Header Search Input */}
          <div className="header-search-bar">
            <Search size={16} className="text-grey" />
            <input 
              type="text" 
              placeholder="Search properties..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="header-search-input"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} style={{ display: "flex", color: "var(--clr-grey)" }}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Menu Button (Mobile) */}
          <button 
            className="header-icon-btn" 
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: "flex" }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Slide-out Menu */}
        {menuOpen && (
          <>
            <div className="sidebar-overlay" onClick={() => setMenuOpen(false)}></div>
            <div className="sidebar-menu">
              <button className="sidebar-close" onClick={() => setMenuOpen(false)}>
                <X size={24} />
              </button>
              <div className="sidebar-links">
                <button 
                  className={`sidebar-link ${activeTab === "home" ? "active" : ""}`}
                  onClick={() => handleNavClick("home")}
                  style={{ textAlign: "left" }}
                >
                  Home
                </button>
                <button 
                  className={`sidebar-link ${activeTab === "favorites" ? "active" : ""}`}
                  onClick={() => handleNavClick("favorites")}
                  style={{ textAlign: "left", display: "flex", alignItems: "center", gap: "10px" }}
                >
                  Favorites 
                  {favoritesCount > 0 && (
                    <span style={{
                      background: "var(--clr-gold)",
                      color: "var(--clr-navy)",
                      fontSize: "0.85rem",
                      fontWeight: "700",
                      padding: "2px 8px",
                      borderRadius: "10px"
                    }}>
                      {favoritesCount}
                    </span>
                  )}
                </button>
                <button 
                  className={`sidebar-link ${activeTab === "bookings" ? "active" : ""}`}
                  onClick={() => handleNavClick("bookings")}
                  style={{ textAlign: "left" }}
                >
                  My Bookings
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
