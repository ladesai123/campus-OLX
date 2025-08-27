// src/Profiles.jsx
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function Profiles() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    const { data, error } = await supabase.from("profiles").select("*");
    if (error) console.error(error);
    else setProfiles(data);
  }

  return (
    <div>
      <h2>Profiles</h2>
      <ul>
        {profiles.map((p) => (
          <li key={p.id}>{p.email} - {p.created_at}</li>
        ))}
      </ul>
    </div>
  );
}
