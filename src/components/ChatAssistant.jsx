import React, { useState, useEffect, useRef } from "react";
import { X, Send, User, MessageSquare } from "lucide-react";
import { properties } from "../data/properties";

export default function ChatAssistant({ property, onClose, onAddBooking }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize conversation
  useEffect(() => {
    const welcomeMsg = property 
      ? `Greetings! I am your Malina Concierge. I see you are interested in the exquisite **${property.name}** in ${property.location}. How can I assist you with your booking or query about this property today?`
      : "Welcome to Malina Holidays! I am your bespoke AI Travel Concierge. I can help you find the perfect luxury escape. Ask me about our collections in India, international properties, couples specials, or general inquiries.";
    
    setMessages([
      { id: 1, sender: "bot", text: welcomeMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
  }, [property]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (text) => {
    if (!text.trim()) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: Date.now(),
      sender: "user",
      text: text,
      time: userTime
    };

    setMessages(prev => [...prev, newMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate concierge thinking & typing
    setTimeout(() => {
      let botResponse = "";
      const lowerText = text.toLowerCase();

      if (lowerText.includes("paris") || (property?.id === "hotel-de-paris" && (lowerText.includes("amenit") || lowerText.includes("price") || lowerText.includes("detail")))) {
        botResponse = "**Hotel de Paris** in Monte-Carlo starts at €1,200/night. Highlights include Alain Ducasse's 3-Michelin-star dining, exclusive Beach Club access, and complimentary Bentley transfers within Monaco. Would you like to book a suite?";
      } else if (lowerText.includes("venice") || lowerText.includes("aman") || (property?.id === "aman-venice" && (lowerText.includes("amenit") || lowerText.includes("price") || lowerText.includes("detail")))) {
        botResponse = "**Aman Venice** is located right on the Grand Canal, starting at €1,500/night. It features private gardens and gilded ceilings. It features a private water taxi transfer and custom guided tours of Venice's hidden canals. Shall I help you reserve a Canal View Suite?";
      } else if (lowerText.includes("taj") || lowerText.includes("lake") || lowerText.includes("udaipur") || (property?.id === "taj-lake-palace" && (lowerText.includes("amenit") || lowerText.includes("price") || lowerText.includes("detail")))) {
        botResponse = "**Taj Lake Palace** in Udaipur float in the middle of Lake Pichola, starting at ₹65,000/night. Guests receive a historic royal welcome with rose petals and a sunset cruise on a 150-year-old royal barge. Would you like to check availability?";
      } else if (lowerText.includes("goa") || lowerText.includes("w goa") || (property?.id === "w-goa" && (lowerText.includes("amenit") || lowerText.includes("price") || lowerText.includes("detail")))) {
        botResponse = "**W Goa** in Vagator starts at ₹32,000/night. It features a vibrant pool scene, spa, beach access, and DJ events at the cliffside Rock Pool. Perfect for a vibrant beach vacation.";
      } else if (lowerText.includes("grace") || lowerText.includes("santorini") || (property?.id === "grace-hotel" && (lowerText.includes("amenit") || lowerText.includes("price") || lowerText.includes("detail")))) {
        botResponse = "**Grace Hotel** in Santorini, Greece starts at €850/night. Perched cliffside, it features a 5-course Champagne breakfast, sunset cruises, and a world-famous infinity pool overlooking the Aegean Sea Caldera.";
      } else if (lowerText.includes("leela") || lowerText.includes("kovalam") || lowerText.includes("kerala") || (property?.id === "the-leela-kovalam" && (lowerText.includes("amenit") || lowerText.includes("price") || lowerText.includes("detail")))) {
        botResponse = "**The Leela Kovalam** in Kerala starts at ₹35,000/night. Located cliffside, it offers private beach access, custom Ayurvedic wellness programs, and luxury houseboat tours. Let me know if you would like me to schedule an inquiry.";
      } else if (lowerText.includes("couple") || lowerText.includes("romance") || lowerText.includes("honeymoon")) {
        botResponse = "We have wonderful **Couple Specials**! I highly recommend **Aman Venice** (canal views and private gardens) or **W Goa** (vibrant atmosphere and cliffside sunset views). Both offer special couple packages. Which destination appeals more?";
      } else if (lowerText.includes("india") || lowerText.includes("domestic")) {
        botResponse = "Our **India Collection** includes three magnificent hotels:\n1. **Taj Lake Palace, Udaipur** (floating marble palace)\n2. **W Goa, Vagator** (vibrant beachfront)\n3. **The Leela Kovalam, Kerala** (cliffside beach resort)\nWould you like to learn more about one of these?";
      } else if (lowerText.includes("book") || lowerText.includes("reserve") || lowerText.includes("how to")) {
        botResponse = "To book your stay, simply select any property card and click the **View Property** button. Fill out the check-in/out dates, guest count, and click 'Submit Inquiry'. Alternatively, I can note down your dates here and create a booking request for you! What dates are you planning?";
      } else if (lowerText.includes("hello") || lowerText.includes("hi") || lowerText.includes("hey")) {
        botResponse = "Hello! How can I assist you with your luxury travel arrangements today?";
      } else {
        botResponse = "I would be delighted to arrange that for you. At Malina Holidays, we pride ourselves on bespoke luxury. If you'd like to book one of our properties, please select 'View Property' on the homepage to access the direct booking calendar, or tell me your preferred destination so I can make a suggestion! You can also reach us directly on WhatsApp at [wa.me/919315572283](https://wa.me/919315572283) or call +91 93155 72283.";
      }

      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: "bot",
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1200);
  };

  // Quick replies
  const quickReplies = property 
    ? ["What is the price?", "Tell me about the amenities", "How can I book this?"]
    : ["Show India Collection", "Show Couples Specials", "How do I book a stay?", "Show International Luxury"];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="chat-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Chat Header */}
        <div className="chat-header">
          <div className="chat-avatar">
            <MessageSquare size={22} />
          </div>
          <div className="chat-header-info">
            <h3>Malina Concierge</h3>
            <p>Online • Tailored Luxury Advisor</p>
          </div>
          <button 
            className="drawer-close-btn" 
            onClick={onClose}
            style={{ top: "18px", right: "20px", color: "var(--clr-white)", backgroundColor: "rgba(255,255,255,0.1)", boxShadow: "none" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-msg ${msg.sender}`}>
              <div style={{ whiteSpace: "pre-line" }}>{msg.text}</div>
              <span className="chat-time">{msg.time}</span>
            </div>
          ))}
          {isTyping && (
            <div className="chat-msg bot" style={{ padding: "12px 20px" }}>
              <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                <span className="typing-dot" style={{ width: "6px", height: "6px", backgroundColor: "var(--clr-grey)", borderRadius: "50%", display: "inline-block", animation: "bounce 1.4s infinite ease-in-out both" }}></span>
                <span className="typing-dot" style={{ width: "6px", height: "6px", backgroundColor: "var(--clr-grey)", borderRadius: "50%", display: "inline-block", animation: "bounce 1.4s infinite ease-in-out both 0.2s" }}></span>
                <span className="typing-dot" style={{ width: "6px", height: "6px", backgroundColor: "var(--clr-grey)", borderRadius: "50%", display: "inline-block", animation: "bounce 1.4s infinite ease-in-out both 0.4s" }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <div className="chat-quick-replies">
          {quickReplies.map((reply, idx) => (
            <button 
              key={idx} 
              className="quick-reply-btn"
              onClick={() => handleSendMessage(reply)}
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <div className="chat-input-area">
          <input 
            type="text" 
            placeholder="Type your bespoke request..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
            className="chat-input"
          />
          <button 
            className="chat-send-btn"
            onClick={() => handleSendMessage(inputValue)}
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Bounce keyframe inline style */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }
      `}</style>
    </div>
  );
}
