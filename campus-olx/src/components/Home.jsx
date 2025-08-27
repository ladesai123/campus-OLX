import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h1 style={{ fontSize: "48px", fontWeight: "bold" }}>
        Save Money. <span style={{ color: "#2563eb" }}>Save the Planet.</span>
      </h1>
      <p style={{ marginTop: "20px", fontSize: "18px", color: "#555" }}>
        The official marketplace for our university. Get great deals on used
        items from students you trust, or give your old gear a new life.
      </p>
      <button
        onClick={() => navigate("/auth")}
        style={{
          marginTop: "30px",
          padding: "12px 24px",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Join with your University ID
      </button>
    </div>
  );
}
