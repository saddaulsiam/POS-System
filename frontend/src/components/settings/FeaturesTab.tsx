import React from "react";

interface FeatureToggle {
  key: string;
  title: string;
  description: string;
  icon: string;
  detailedInfo: any;
}

interface FeaturesTabProps {
  featureToggles: FeatureToggle[];
  settings: any;
  saving: boolean;
  handleToggle: (key: string, value: boolean) => void;
  setSelectedFeature: (key: string) => void;
  setShowInfoModal: (show: boolean) => void;
}

const FeaturesTab: React.FC<FeaturesTabProps> = ({
  featureToggles,
  settings,
  saving,
  handleToggle,
  setSelectedFeature,
  setShowInfoModal,
}) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">🎯 POS Feature Controls</h2>
        <p className="text-sm text-gray-600 mt-1">Enable or disable core point of sale features</p>
      </div>
      <div className="divide-y divide-gray-200">
        {featureToggles.map((feature) => (
          <div key={feature.key} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-start space-x-4 flex-1">
              <div className="text-3xl">{feature.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                  <button
                    onClick={() => {
                      setSelectedFeature(feature.key);
                      setShowInfoModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="View detailed information"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle(feature.key, !settings[feature.key])}
              disabled={saving}
              className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                settings[feature.key] ? "bg-blue-600" : "bg-gray-200"
              }`}
              role="switch"
              aria-checked={!!settings[feature.key]}
            >
              <span
                className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings[feature.key] ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 mx-6 mb-6">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-blue-900">Quick Tip</h4>
            <p className="text-sm text-blue-700 mt-1">
              Changes take effect immediately. Click the <strong>ℹ️ info icon</strong> next to each feature for detailed
              explanations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesTab;
