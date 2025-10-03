import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile, changePin } from "../services/api";

const ProfilePage: React.FC = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [saving, setSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  // PIN change state
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [pinMsg, setPinMsg] = useState("");
  const [pinSaving, setPinSaving] = useState(false);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setProfileMsg("");
    try {
      const updated = await updateProfile({ name, username });
      setUser && setUser(updated);
      setProfileMsg("Profile updated successfully.");
    } catch (err: any) {
      setProfileMsg(err?.response?.data?.error || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePinChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinSaving(true);
    setPinMsg("");
    try {
      await changePin({ currentPin, newPin });
      setPinMsg("PIN changed successfully.");
      setCurrentPin("");
      setNewPin("");
    } catch (err: any) {
      setPinMsg(err?.response?.data?.error || "Failed to change PIN");
    } finally {
      setPinSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>
      <form onSubmit={handleProfileSave} className="mb-8 bg-white rounded shadow p-4">
        <div className="mb-4">
          <label className="block mb-1 font-medium">Name</label>
          <input
            className="input input-bordered w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Username</label>
          <input
            className="input input-bordered w-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
        {profileMsg && <div className="mt-2 text-sm text-green-600">{profileMsg}</div>}
      </form>

      <h3 className="text-xl font-semibold mb-4">Change PIN</h3>
      <form onSubmit={handlePinChange} className="bg-white rounded shadow p-4">
        <div className="mb-4">
          <label className="block mb-1 font-medium">Current PIN</label>
          <input
            className="input input-bordered w-full"
            type="password"
            value={currentPin}
            onChange={(e) => setCurrentPin(e.target.value)}
            minLength={4}
            maxLength={6}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">New PIN</label>
          <input
            className="input input-bordered w-full"
            type="password"
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
            minLength={4}
            maxLength={6}
            required
          />
        </div>
        <button className="btn btn-secondary" type="submit" disabled={pinSaving}>
          {pinSaving ? "Changing..." : "Change PIN"}
        </button>
        {pinMsg && <div className="mt-2 text-sm text-green-600">{pinMsg}</div>}
      </form>
    </div>
  );
};

export default ProfilePage;
