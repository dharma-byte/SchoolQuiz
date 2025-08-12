"use client";

import { useState } from "react";

export default function ChangePassword() {
  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNew] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/users/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    setLoading(false);
    if (res.ok) setMsg("Password changed successfully!");
    else setMsg("Failed to change password (check current password).");
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-3">Change Password</h2>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block mb-1 font-semibold">Current Password</label>
          <input className="input" type="password" value={currentPassword} onChange={e=>setCurrent(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1 font-semibold">New Password</label>
          <input className="input" type="password" value={newPassword} onChange={e=>setNew(e.target.value)} />
        </div>
        {msg && <p className="text-sm">{msg}</p>}
        <button className="btn btn-primary" disabled={loading}>{loading ? "Saving..." : "Update Password"}</button>
      </form>
    </div>
  );
}
