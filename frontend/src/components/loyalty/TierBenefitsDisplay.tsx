import React, { useEffect, useState } from "react";
import { Trophy, Award, Star, Zap, TrendingUp } from "lucide-react";
import { loyaltyAPI } from "../../services";
import type { LoyaltyTier, LoyaltyTierConfig } from "../../types";

interface TierBenefitsDisplayProps {
  currentTier?: LoyaltyTier;
  lifetimePoints?: number;
}

const TierBenefitsDisplay: React.FC<TierBenefitsDisplayProps> = ({ currentTier, lifetimePoints = 0 }) => {
  const [tierConfigs, setTierConfigs] = useState<LoyaltyTierConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTierConfigs();
  }, []);

  const fetchTierConfigs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await loyaltyAPI.getTierConfig();
      setTierConfigs(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load tier information");
      console.error("Error fetching tier configs:", err);
    } finally {
      setLoading(false);
    }
  };

  const getTierIcon = (tier: LoyaltyTier) => {
    const icons: Record<LoyaltyTier, any> = {
      BRONZE: Trophy,
      SILVER: Award,
      GOLD: Star,
      PLATINUM: Zap,
    };
    return icons[tier];
  };

  const getTierGradient = (tier: LoyaltyTier) => {
    const gradients: Record<LoyaltyTier, string> = {
      BRONZE: "from-orange-400 to-orange-600",
      SILVER: "from-gray-400 to-gray-600",
      GOLD: "from-yellow-400 to-yellow-600",
      PLATINUM: "from-purple-400 to-purple-600",
    };
    return gradients[tier];
  };

  const getTierBorder = (tier: LoyaltyTier) => {
    const borders: Record<LoyaltyTier, string> = {
      BRONZE: "border-orange-300",
      SILVER: "border-gray-300",
      GOLD: "border-yellow-300",
      PLATINUM: "border-purple-300",
    };
    return borders[tier];
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading tier information...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col items-center justify-center h-64 text-red-500">
          <p className="mb-4">{error}</p>
          <button onClick={fetchTierConfigs} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Loyalty Tier Benefits</h2>
          <TrendingUp className="w-6 h-6 text-blue-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tierConfigs.map((config) => {
            const Icon = getTierIcon(config.tier);
            const gradient = getTierGradient(config.tier);
            const border = getTierBorder(config.tier);
            const isCurrent = currentTier === config.tier;
            const isUnlocked = lifetimePoints >= config.minimumPoints;

            return (
              <div
                key={config.id}
                className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                  isCurrent ? `${border} ring-4 ring-blue-200` : isUnlocked ? `${border}` : "border-gray-200 opacity-60"
                }`}
              >
                {/* Current Badge */}
                {isCurrent && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl">
                    CURRENT
                  </div>
                )}

                {/* Header */}
                <div className={`bg-gradient-to-r ${gradient} p-4 text-white`}>
                  <Icon className="w-10 h-10 mb-2" />
                  <h3 className="text-xl font-bold mb-1">{config.tier}</h3>
                  <p className="text-sm opacity-90">{config.minimumPoints.toLocaleString()} points</p>
                </div>

                {/* Benefits */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div>
                      <span className="text-gray-600">Earn </span>
                      <span className="font-bold text-gray-800">{config.pointsMultiplier}x</span>
                      <span className="text-gray-600"> points on every purchase</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div>
                      <span className="text-gray-600">Get </span>
                      <span className="font-bold text-gray-800">{config.discountPercentage}%</span>
                      <span className="text-gray-600"> discount on all purchases</span>
                    </div>
                  </div>

                  {config.birthdayBonus > 0 && (
                    <div className="flex items-start gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <div>
                        <span className="text-gray-600">Receive </span>
                        <span className="font-bold text-gray-800">{config.birthdayBonus}</span>
                        <span className="text-gray-600"> bonus points on your birthday</span>
                      </div>
                    </div>
                  )}

                  {/* Progress indicator for locked tiers */}
                  {!isUnlocked && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="text-xs text-gray-500 mb-2">
                        {(config.minimumPoints - lifetimePoints).toLocaleString()} points to unlock
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`bg-gradient-to-r ${gradient} h-2 rounded-full transition-all`}
                          style={{
                            width: `${Math.min((lifetimePoints / config.minimumPoints) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Unlocked badge */}
                  {isUnlocked && !isCurrent && (
                    <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                      <span className="inline-block text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        ✓ Unlocked
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Banner */}
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-sm text-blue-800">
            <strong>How it works:</strong> Your tier is determined by your lifetime points. As you earn more points,
            you'll automatically advance to higher tiers with better benefits!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TierBenefitsDisplay;
