import React, { useEffect, useState } from "react";
import { Gift, Star, ShoppingBag, Sparkles, X } from "lucide-react";
import { loyaltyAPI } from "../../services/api";
import toast from "react-hot-toast";
import type { LoyaltyReward } from "../../types";

interface RewardsGalleryProps {
  customerId: number;
  customerPoints: number;
  onRewardRedeemed?: () => void;
}

const RewardsGallery: React.FC<RewardsGalleryProps> = ({ customerId, customerPoints, onRewardRedeemed }) => {
  const [rewards, setRewards] = useState<LoyaltyReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReward, setSelectedReward] = useState<LoyaltyReward | null>(null);
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    fetchRewards();
  }, [customerId]);

  const fetchRewards = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await loyaltyAPI.getRewards(customerId);
      setRewards(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load rewards");
      console.error("Error fetching rewards:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUseReward = async (reward: LoyaltyReward) => {
    if (redeeming) return;

    try {
      setRedeeming(true);
      await loyaltyAPI.useReward(reward.id);
      toast.success(`Reward "${reward.description}" activated successfully!`);
      setSelectedReward(null);
      fetchRewards();
      onRewardRedeemed?.();
    } catch (err: any) {
      toast.error(err.message || "Failed to use reward");
      console.error("Error using reward:", err);
    } finally {
      setRedeeming(false);
    }
  };

  const availableRewards = rewards.filter((r) => !r.redeemedAt);
  const usedRewards = rewards.filter((r) => r.redeemedAt);
  const expiredRewards = rewards.filter((r) => {
    if (!r.expiresAt) return false;
    return new Date(r.expiresAt) < new Date() && !r.redeemedAt;
  });

  const getRewardIcon = (type: string) => {
    const icons: Record<string, any> = {
      DISCOUNT: Star,
      FREE_PRODUCT: Gift,
      STORE_CREDIT: ShoppingBag,
      SPECIAL_OFFER: Sparkles,
    };
    const Icon = icons[type] || Gift;
    return Icon;
  };

  const getRewardColor = (type: string) => {
    const colors: Record<string, string> = {
      DISCOUNT: "from-yellow-400 to-orange-500",
      FREE_PRODUCT: "from-green-400 to-emerald-500",
      STORE_CREDIT: "from-blue-400 to-indigo-500",
      SPECIAL_OFFER: "from-purple-400 to-pink-500",
    };
    return colors[type] || "from-gray-400 to-gray-500";
  };

  const formatRewardValue = (reward: LoyaltyReward) => {
    if (reward.rewardType === "DISCOUNT") {
      return `${reward.rewardValue}% OFF`;
    } else if (reward.rewardType === "STORE_CREDIT") {
      return `$${reward.rewardValue.toFixed(2)} Credit`;
    }
    return reward.description;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading rewards...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col items-center justify-center h-64 text-red-500">
          <p className="mb-4">{error}</p>
          <button onClick={fetchRewards} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
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
          <h2 className="text-xl font-bold text-gray-800">Your Rewards</h2>
          <div className="text-sm text-gray-600">
            Available Points: <span className="font-bold text-blue-600">{customerPoints.toLocaleString()}</span>
          </div>
        </div>

        {/* Available Rewards */}
        {availableRewards.length > 0 ? (
          <>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Available to Use</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {availableRewards.map((reward) => {
                const Icon = getRewardIcon(reward.rewardType);
                const gradient = getRewardColor(reward.rewardType);

                return (
                  <div
                    key={reward.id}
                    className="relative overflow-hidden rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-all hover:shadow-lg"
                  >
                    {/* Gradient Header */}
                    <div className={`bg-gradient-to-r ${gradient} p-4 text-white`}>
                      <div className="flex items-center justify-between mb-2">
                        <Icon className="w-8 h-8" />
                        <span className="text-xs font-medium bg-white bg-opacity-20 px-2 py-1 rounded">
                          {reward.pointsCost} pts
                        </span>
                      </div>
                      <h4 className="text-lg font-bold">{formatRewardValue(reward)}</h4>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <p className="text-sm text-gray-600 mb-4">{reward.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          {reward.expiresAt && <span>Expires: {new Date(reward.expiresAt).toLocaleDateString()}</span>}
                        </div>
                        <button
                          onClick={() => setSelectedReward(reward)}
                          className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors"
                        >
                          Use Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg mb-8">
            <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium mb-2">No rewards available yet</p>
            <p className="text-gray-500 text-sm">Keep earning points to unlock exciting rewards!</p>
          </div>
        )}

        {/* Used Rewards */}
        {usedRewards.length > 0 && (
          <>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Used Rewards</h3>
            <div className="space-y-2 mb-6">
              {usedRewards.map((reward) => (
                <div
                  key={reward.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-200 rounded">
                      {React.createElement(getRewardIcon(reward.rewardType), {
                        className: "w-5 h-5 text-gray-600",
                      })}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700">{reward.description}</div>
                      <div className="text-xs text-gray-500">
                        Used: {reward.redeemedAt ? new Date(reward.redeemedAt).toLocaleDateString() : "-"}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">USED</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Expired Rewards */}
        {expiredRewards.length > 0 && (
          <>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Expired Rewards</h3>
            <div className="space-y-2">
              {expiredRewards.map((reward) => (
                <div
                  key={reward.id}
                  className="flex items-center justify-between p-3 bg-red-50 rounded border border-red-200 opacity-60"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-200 rounded">
                      {React.createElement(getRewardIcon(reward.rewardType), {
                        className: "w-5 h-5 text-red-600",
                      })}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700">{reward.description}</div>
                      <div className="text-xs text-red-600">
                        Expired: {reward.expiresAt ? new Date(reward.expiresAt).toLocaleDateString() : "-"}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-red-600 font-medium">EXPIRED</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {selectedReward && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Use Reward</h3>
              <button
                onClick={() => setSelectedReward(null)}
                className="text-gray-400 hover:text-gray-600"
                disabled={redeeming}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div
              className={`bg-gradient-to-r ${getRewardColor(selectedReward.rewardType)} p-6 rounded-lg mb-4 text-white`}
            >
              <div className="flex items-center gap-3 mb-3">
                {React.createElement(getRewardIcon(selectedReward.rewardType), {
                  className: "w-10 h-10",
                })}
                <div>
                  <div className="text-2xl font-bold">{formatRewardValue(selectedReward)}</div>
                  <div className="text-sm opacity-90">{selectedReward.pointsCost} points</div>
                </div>
              </div>
              <p className="text-sm opacity-90">{selectedReward.description}</p>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">
                Are you sure you want to use this reward? This action cannot be undone.
              </p>
              {selectedReward.expiresAt && (
                <p className="text-xs text-red-600">
                  Expires: {new Date(selectedReward.expiresAt).toLocaleDateString()}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedReward(null)}
                disabled={redeeming}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUseReward(selectedReward)}
                disabled={redeeming}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {redeeming ? "Using..." : "Confirm Use"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardsGallery;
