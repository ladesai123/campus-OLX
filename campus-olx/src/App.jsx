import React, { useState, useEffect } from "react"
import { supabase } from "./supabaseClient"
import Auth from "./components/Auth"
import Dashboard from "./components/Dashboard"
import Profiles from "./Profiles";

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div>
      {session ? <Dashboard key={session.user.id} /> : <Auth />}
    </div>
  )
}

export default App
