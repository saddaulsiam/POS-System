import React from "react";

interface GeneralSettingsTabProps {
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
  settings: any;
  saving: boolean;
  handleTextFieldChangeString: (field: string, e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const GeneralSettingsTab: React.FC<GeneralSettingsTabProps> = ({
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
  settings,
  saving,
  handleTextFieldChangeString,
}) => (
  <div className="bg-white rounded-lg shadow">
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900">⚙️ General Settings</h2>
      <p className="text-sm text-gray-600 mt-1">Update your profile and store information</p>
    </div>
    <form className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Profile fields */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={savingProfile}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
      </div>
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={savingProfile}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
      </div>
      <div className="md:col-span-2 flex gap-4">
        <button
          type="button"
          onClick={handleProfileSave}
          disabled={savingProfile}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Save Profile
        </button>
        {profileMsg && <span className="text-sm text-gray-600 pt-2">{profileMsg}</span>}
      </div>
      <div>
        <label htmlFor="currentPin" className="block text-sm font-medium text-gray-700 mb-2">
          Current PIN
        </label>
        <input
          type="password"
          id="currentPin"
          value={currentPin}
          onChange={(e) => setCurrentPin(e.target.value)}
          disabled={pinSaving}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
      </div>
      <div>
        <label htmlFor="newPin" className="block text-sm font-medium text-gray-700 mb-2">
          New PIN
        </label>
        <input
          type="password"
          id="newPin"
          value={newPin}
          onChange={(e) => setNewPin(e.target.value)}
          disabled={pinSaving}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
      </div>
      <div className="md:col-span-2 flex gap-4">
        <button
          type="button"
          onClick={handlePinChange}
          disabled={pinSaving}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Change PIN
        </button>
        {pinMsg && <span className="text-sm text-gray-600 pt-2">{pinMsg}</span>}
      </div>
      {/* Store fields */}
      <div>
        <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-2">
          Store Name
        </label>
        <input
          type="text"
          id="storeName"
          defaultValue={settings.storeName}
          onBlur={(e) => handleTextFieldChangeString("storeName", e)}
          disabled={saving}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
      </div>
      <div>
        <label htmlFor="storePhone" className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          type="text"
          id="storePhone"
          defaultValue={settings.storePhone}
          onBlur={(e) => handleTextFieldChangeString("storePhone", e)}
          disabled={saving}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
      </div>
      <div>
        <label htmlFor="storeEmail" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="storeEmail"
          defaultValue={settings.storeEmail}
          onBlur={(e) => handleTextFieldChangeString("storeEmail", e)}
          disabled={saving}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
      </div>
      <div>
        <label htmlFor="taxId" className="block text-sm font-medium text-gray-700 mb-2">
          Tax ID (Optional)
        </label>
        <input
          type="text"
          id="taxId"
          defaultValue={settings.taxId || ""}
          onBlur={(e) => handleTextFieldChangeString("taxId", e)}
          disabled={saving}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
      </div>
      <div className="md:col-span-2">
        <label htmlFor="storeAddress" className="block text-sm font-medium text-gray-700 mb-2">
          Store Address
        </label>
        <textarea
          id="storeAddress"
          rows={2}
          defaultValue={settings.storeAddress}
          onBlur={(e) => handleTextFieldChangeString("storeAddress", e)}
          disabled={saving}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
      </div>
    </form>
  </div>
);

export default GeneralSettingsTab;
