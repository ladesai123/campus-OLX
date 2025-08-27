import React from "react"
import { supabase } from "../supabaseClient"

export default function Dashboard() {
  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Welcome to Campus-OLX 🚀</h2>
      <p>You are logged in!</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}
