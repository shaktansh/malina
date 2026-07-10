import React from "react";
import { Home, Building2, Compass, Heart, User } from "lucide-react";

export default function BottomNavbar({ activeTab, setActiveTab }) {
  return (
    <nav className="bottom-navbar">
      <button 
        className={`bottom-nav-item ${activeTab === "home" ? "active" : ""}`}
        onClick={() => setActiveTab("home")}
      >
        <Home />
        <span>Home</span>
      </button>

      <button 
        className={`bottom-nav-item ${activeTab === "explore" ? "active" : ""}`}
        onClick={() => setActiveTab("explore")}
      >
        <Compass />
        <span>Explore</span>
      </button>

      <button 
        className={`bottom-nav-item ${activeTab === "favorites" ? "active" : ""}`}
        onClick={() => setActiveTab("favorites")}
      >
        <Heart />
        <span>Favorites</span>
      </button>

      <button 
        className={`bottom-nav-item ${activeTab === "bookings" ? "active" : ""}`}
        onClick={() => setActiveTab("bookings")}
      >
        <User />
        <span>Profile</span>
      </button>
    </nav>
  );
}
