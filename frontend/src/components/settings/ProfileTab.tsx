import React from "react";
import { Button, Input } from "../common";

interface ProfileTabProps {
  user: any;
  name: string;
  setName: (v: string) => void;
  username: string;
  setUsername: (v: string) => void;
  savingProfile: boolean;
  profileMsg: string;
  handleProfileSave: (e: React.FormEvent) => void;
  currentPin: string;
  setCurrentPin: (v: string) => void;
  newPin: string;
  setNewPin: (v: string) => void;
  pinMsg: string;
  pinSaving: boolean;
  handlePinChange: (e: React.FormEvent) => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({
  user,
  name,
  setName,
  username,
  setUsername,
  savingProfile,
  profileMsg,
  handleProfileSave,
  currentPin,
  setCurrentPin,
  newPin,
  setNewPin,
  pinMsg,
  pinSaving,
  handlePinChange,
}) => (
  <div className="bg-white rounded-lg shadow">
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900">🙍 Profile</h2>
      <p className="text-sm text-gray-600 mt-1">Configure system alerts and notification preferences</p>
    </div>
    <form className="space-y-6 w-full p-6">
      {/* Profile Info Section */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-2">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div>
              <Input
                label="Full Name"
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={savingProfile}
                fullWidth
                error={name === "" ? "Name is required" : undefined}
              />
            </div>
            <div>
              <Input
                label="Username"
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={savingProfile}
                fullWidth
                error={username === "" ? "Username is required" : undefined}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-4 items-center mt-2 justify-end">
          <Button onClick={handleProfileSave} disabled={savingProfile}>
            Save Profile
          </Button>
          {profileMsg && <span className="text-sm text-gray-600 pt-2">{profileMsg}</span>}
        </div>
      </div>
      {/* PIN Section */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Change PIN</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div>
              <Input
                label="Current PIN"
                type="password"
                id="currentPin"
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value)}
                disabled={pinSaving}
                fullWidth
                error={currentPin === "" && pinMsg ? "Current PIN is required" : undefined}
              />
            </div>
            <div>
              <Input
                label="New PIN"
                type="password"
                id="newPin"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                disabled={pinSaving}
                fullWidth
                error={newPin === "" && pinMsg ? "New PIN is required" : undefined}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-4 items-center mt-2 justify-end">
          <Button onClick={handlePinChange} disabled={pinSaving}>
            Change PIN
          </Button>
          {pinMsg && <span className="text-sm text-gray-600 pt-2">{pinMsg}</span>}
        </div>
      </div>
    </form>
  </div>
);

export default ProfileTab;
