import React, { useState, useEffect } from "react";
import { Input } from "../components/common/Input";
import { Gift, Trophy, Star, Plus, Edit2, Trash2, TrendingUp, Users, Award, Target } from "lucide-react";
import { loyaltyAPI } from "../services";
import toast from "react-hot-toast";

interface TierConfig {
  id?: number;
  tier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
  minimumPoints: number;
  pointsMultiplier: number;
  discountPercentage: number;
  birthdayBonus: number;
  description?: string;
}

interface LoyaltyOffer {
  id: number;
  title: string;
  description?: string;
  offerType: string;
  discountValue?: number;
  minimumPurchase?: number;
  requiredTier?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

interface LoyaltyStats {
  customersByTier: Record<string, number>;
  pointsIssued: number;
  pointsRedeemed: number;
  activeOffers: number;
  topCustomers: Array<{
    id: number;
    name: string;
    loyaltyPoints: number;
    loyaltyTier: string;
  }>;
}

const LoyaltyAdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "tiers" | "offers">("overview");
  const [stats, setStats] = useState<LoyaltyStats | null>(null);
  const [tiers, setTiers] = useState<TierConfig[]>([]);
  const [offers, setOffers] = useState<LoyaltyOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTierModal, setShowTierModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [editingTier, setEditingTier] = useState<TierConfig | null>(null);
  const [editingOffer, setEditingOffer] = useState<LoyaltyOffer | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      console.log("🔄 Fetching loyalty data...");

      // Fetch tier config and offers (public endpoints)
      const [tiersData, offersData] = await Promise.all([loyaltyAPI.getTierConfig(), loyaltyAPI.getAllOffers()]);

      console.log("✅ Tiers loaded:", tiersData?.length || 0);
      console.log("✅ Offers loaded:", offersData?.length || 0);

      setTiers(tiersData);
      setOffers(offersData);

      // Try to fetch statistics (requires auth)
      try {
        console.log("🔄 Fetching statistics...");
        const statsData = await loyaltyAPI.getStatistics();
        console.log("✅ Statistics loaded:", statsData);
        setStats(statsData);
      } catch (statsError: any) {
        console.error("❌ Statistics error:", statsError);
        console.error("Error details:", {
          status: statsError.response?.status,
          statusText: statsError.response?.statusText,
          data: statsError.response?.data,
          message: statsError.message,
        });

        // Initialize with empty stats if not authorized
        setStats({
          customersByTier: { BRONZE: 0, SILVER: 0, GOLD: 0, PLATINUM: 0 },
          pointsIssued: 0,
          pointsRedeemed: 0,
          activeOffers: offersData.filter((o: any) => o.isActive).length,
          topCustomers: [],
        });

        if (statsError.response?.status === 401 || statsError.response?.status === 403) {
          toast.error("You need admin/manager access to view statistics");
        } else {
          toast.error("Failed to load statistics");
        }
      }
    } catch (error: any) {
      console.error("❌ Failed to load loyalty data:", error);
      toast.error(error.response?.data?.error || error.message || "Failed to load loyalty data");
    } finally {
      setLoading(false);
      console.log("✅ Fetch complete");
    }
  };

  const handleSaveTier = async (tierData: TierConfig) => {
    try {
      await loyaltyAPI.updateTierConfig(tierData);
      toast.success("Tier configuration updated successfully");
      fetchAllData();
      setShowTierModal(false);
      setEditingTier(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to update tier");
    }
  };

  const handleSaveOffer = async (offerData: any) => {
    try {
      if (editingOffer) {
        await loyaltyAPI.updateOffer(editingOffer.id, offerData);
        toast.success("Offer updated successfully");
      } else {
        await loyaltyAPI.createOffer(offerData);
        toast.success("Offer created successfully");
      }
      fetchAllData();
      setShowOfferModal(false);
      setEditingOffer(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to save offer");
    }
  };

  const handleDeleteOffer = async (offerId: number) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;

    try {
      await loyaltyAPI.deleteOffer(offerId);
      toast.success("Offer deleted successfully");
      fetchAllData();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete offer");
    }
  };

  const getTierColor = (tier: string) => {
    const colors = {
      BRONZE: "bg-orange-100 text-orange-800 border-orange-300",
      SILVER: "bg-gray-100 text-gray-800 border-gray-300",
      GOLD: "bg-yellow-100 text-yellow-800 border-yellow-300",
      PLATINUM: "bg-purple-100 text-purple-800 border-purple-300",
    };
    return colors[tier as keyof typeof colors] || colors.BRONZE;
  };

  const getTierIcon = (tier: string) => {
    const icons = {
      BRONZE: "🥉",
      SILVER: "🥈",
      GOLD: "🥇",
      PLATINUM: "💎",
    };
    return icons[tier as keyof typeof icons] || "🏆";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading loyalty data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Gift className="text-blue-600" />
            Loyalty Program Management
          </h1>
          <p className="mt-2 text-gray-600">Manage tiers, offers, and track loyalty program performance</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`${
                activeTab === "overview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <TrendingUp size={18} />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("tiers")}
              className={`${
                activeTab === "tiers"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <Trophy size={18} />
              Tier Configuration
            </button>
            <button
              onClick={() => setActiveTab("offers")}
              className={`${
                activeTab === "offers"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <Star size={18} />
              Special Offers
            </button>
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && stats && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Points Issued</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pointsIssued.toLocaleString()}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <Award className="text-green-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Points Redeemed</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pointsRedeemed.toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Gift className="text-blue-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Offers</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeOffers}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Star className="text-purple-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Redemption Rate</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stats.pointsIssued > 0 ? ((stats.pointsRedeemed / stats.pointsIssued) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-full">
                    <Target className="text-orange-600" size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Customers by Tier */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users size={20} />
                Customers by Tier
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["BRONZE", "SILVER", "GOLD", "PLATINUM"].map((tier) => (
                  <div key={tier} className={`p-4 rounded-lg border-2 ${getTierColor(tier)}`}>
                    <div className="text-3xl mb-2">{getTierIcon(tier)}</div>
                    <p className="font-semibold">{tier}</p>
                    <p className="text-2xl font-bold">{stats.customersByTier[tier] || 0}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Customers */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Trophy size={20} />
                Top Loyalty Customers
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tier</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {stats.topCustomers.map((customer, index) => (
                      <tr key={customer.id}>
                        <td className="px-4 py-3">
                          <span className="text-lg font-bold text-gray-600">#{index + 1}</span>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">{customer.name}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getTierColor(
                              customer.loyaltyTier
                            )}`}
                          >
                            {getTierIcon(customer.loyaltyTier)} {customer.loyaltyTier}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-900">
                          {customer.loyaltyPoints.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tier Configuration Tab */}
        {activeTab === "tiers" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Tier Benefits Configuration</h3>
              </div>

              <div className="space-y-4">
                {tiers.map((tier) => (
                  <div key={tier.tier} className={`p-6 rounded-lg border-2 ${getTierColor(tier.tier)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-4xl">{getTierIcon(tier.tier)}</span>
                          <div>
                            <h4 className="text-xl font-bold">{tier.tier}</h4>
                            <p className="text-sm opacity-75">{tier.description}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div>
                            <p className="text-xs opacity-75 mb-1">Minimum Points</p>
                            <p className="font-bold">{tier.minimumPoints.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs opacity-75 mb-1">Points Multiplier</p>
                            <p className="font-bold">{tier.pointsMultiplier}x</p>
                          </div>
                          <div>
                            <p className="text-xs opacity-75 mb-1">Discount</p>
                            <p className="font-bold">{tier.discountPercentage}%</p>
                          </div>
                          <div>
                            <p className="text-xs opacity-75 mb-1">Birthday Bonus</p>
                            <p className="font-bold">{tier.birthdayBonus} pts</p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setEditingTier(tier);
                          setShowTierModal(true);
                        }}
                        className="ml-4 p-2 text-gray-600 hover:text-blue-600 hover:bg-white/50 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Offers Tab */}
        {activeTab === "offers" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Special Offers</h3>
                <button
                  onClick={() => {
                    setEditingOffer(null);
                    setShowOfferModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={18} />
                  Create Offer
                </button>
              </div>

              <div className="space-y-4">
                {offers.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Star size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No special offers created yet</p>
                    <p className="text-sm mt-2">Click "Create Offer" to add your first offer</p>
                  </div>
                ) : (
                  offers.map((offer) => (
                    <div
                      key={offer.id}
                      className="p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-2">
                            <Star className={offer.isActive ? "text-yellow-500" : "text-gray-400"} size={24} />
                            <div>
                              <h4 className="text-lg font-bold text-gray-900">{offer.title}</h4>
                              <p className="text-gray-600 text-sm mt-1">{offer.description}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-4 mt-4 text-sm">
                            <div>
                              <span className="text-gray-500">Type:</span>
                              <span className="ml-2 font-medium">{offer.offerType}</span>
                            </div>
                            {offer.discountValue && (
                              <div>
                                <span className="text-gray-500">Value:</span>
                                <span className="ml-2 font-medium">${offer.discountValue}</span>
                              </div>
                            )}
                            {offer.minimumPurchase && (
                              <div>
                                <span className="text-gray-500">Min. Purchase:</span>
                                <span className="ml-2 font-medium">${offer.minimumPurchase}</span>
                              </div>
                            )}
                            {offer.requiredTier && (
                              <div>
                                <span className="text-gray-500">Tier:</span>
                                <span
                                  className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${getTierColor(
                                    offer.requiredTier
                                  )}`}
                                >
                                  {offer.requiredTier}
                                </span>
                              </div>
                            )}
                            <div>
                              <span className="text-gray-500">Period:</span>
                              <span className="ml-2 font-medium">
                                {new Date(offer.startDate).toLocaleDateString()} -{" "}
                                {new Date(offer.endDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Status:</span>
                              <span
                                className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                                  offer.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {offer.isActive ? "Active" : "Inactive"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => {
                              setEditingOffer(offer);
                              setShowOfferModal(true);
                            }}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteOffer(offer.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tier Edit Modal */}
        {showTierModal && editingTier && (
          <TierEditModal tier={editingTier} onClose={() => setShowTierModal(false)} onSave={handleSaveTier} />
        )}

        {/* Offer Modal */}
        {showOfferModal && (
          <OfferModal offer={editingOffer} onClose={() => setShowOfferModal(false)} onSave={handleSaveOffer} />
        )}
      </div>
    </div>
  );
};

// Tier Edit Modal Component
const TierEditModal: React.FC<{
  tier: TierConfig;
  onClose: () => void;
  onSave: (tier: TierConfig) => void;
}> = ({ tier, onClose, onSave }) => {
  const [formData, setFormData] = useState(tier);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">Edit {tier.tier} Tier Configuration</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Points</label>
            <Input
              type="number"
              value={formData.minimumPoints}
              onChange={(e) => setFormData({ ...formData, minimumPoints: parseInt(e.target.value) })}
              min={0}
              required
              fullWidth
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Points Multiplier</label>
            <Input
              type="number"
              step={0.1}
              value={formData.pointsMultiplier}
              onChange={(e) => setFormData({ ...formData, pointsMultiplier: parseFloat(e.target.value) })}
              min={1.0}
              required
              fullWidth
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Discount Percentage</label>
            <Input
              type="number"
              value={formData.discountPercentage}
              onChange={(e) => setFormData({ ...formData, discountPercentage: parseFloat(e.target.value) })}
              min={0}
              max={100}
              required
              fullWidth
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Birthday Bonus (Points)</label>
            <Input
              type="number"
              value={formData.birthdayBonus}
              onChange={(e) => setFormData({ ...formData, birthdayBonus: parseInt(e.target.value) })}
              min={0}
              required
              fullWidth
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Offer Modal Component
const OfferModal: React.FC<{
  offer: LoyaltyOffer | null;
  onClose: () => void;
  onSave: (offer: any) => void;
}> = ({ offer, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: offer?.title || "",
    description: offer?.description || "",
    offerType: offer?.offerType || "DISCOUNT_PERCENTAGE",
    discountValue: offer?.discountValue || 0,
    minimumPurchase: offer?.minimumPurchase || 0,
    requiredTier: offer?.requiredTier || "BRONZE",
    startDate: offer?.startDate ? offer.startDate.split("T")[0] : new Date().toISOString().split("T")[0],
    endDate: offer?.endDate ? offer.endDate.split("T")[0] : new Date().toISOString().split("T")[0],
    isActive: offer?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">{offer ? "Edit" : "Create"} Special Offer</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Offer Title *</label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              fullWidth
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Offer Type *</label>
              <select
                value={formData.offerType}
                onChange={(e) => setFormData({ ...formData, offerType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="DISCOUNT_PERCENTAGE">Percentage Discount</option>
                <option value="DISCOUNT_FIXED">Fixed Amount Discount</option>
                <option value="BUY_X_GET_Y">Buy X Get Y</option>
                <option value="POINTS_MULTIPLIER">Points Multiplier</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount Value</label>
              <Input
                type="number"
                step={0.01}
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })}
                min={0}
                fullWidth
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Purchase</label>
              <Input
                type="number"
                step={0.01}
                value={formData.minimumPurchase}
                onChange={(e) => setFormData({ ...formData, minimumPurchase: parseFloat(e.target.value) })}
                min={0}
                fullWidth
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Required Tier</label>
              <select
                value={formData.requiredTier}
                onChange={(e) => setFormData({ ...formData, requiredTier: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="BRONZE">Bronze</option>
                <option value="SILVER">Silver</option>
                <option value="GOLD">Gold</option>
                <option value="PLATINUM">Platinum</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
                fullWidth
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
                fullWidth
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Active
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {offer ? "Update" : "Create"} Offer
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoyaltyAdminPage;
