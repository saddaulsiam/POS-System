import React, { useEffect, useState } from 'react';
import { Tag, Calendar, TrendingUp, X } from 'lucide-react';
import { loyaltyAPI } from '../../services/api';
import type { LoyaltyOffer, LoyaltyTier } from '../../types';

interface LoyaltyOffersListProps {
  customerTier?: LoyaltyTier;
}

const LoyaltyOffersList: React.FC<LoyaltyOffersListProps> = ({ customerTier }) => {
  const [offers, setOffers] = useState<LoyaltyOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<LoyaltyOffer | null>(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await loyaltyAPI.getAllOffers();
      // Only show active offers
      const activeOffers = (data || []).filter((offer: LoyaltyOffer) => offer.isActive);
      setOffers(activeOffers);
    } catch (err: any) {
      setError(err.message || 'Failed to load offers');
      console.error('Error fetching offers:', err);
    } finally {
      setLoading(false);
    }
  };

  const isOfferEligible = (offer: LoyaltyOffer) => {
    if (!offer.requiredTier) return true;
    if (!customerTier) return false;

    const tierOrder: LoyaltyTier[] = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'];
    const requiredIndex = tierOrder.indexOf(offer.requiredTier);
    const customerIndex = tierOrder.indexOf(customerTier);

    return customerIndex >= requiredIndex;
  };

  const isOfferActive = (offer: LoyaltyOffer) => {
    const now = new Date();
    const start = new Date(offer.startDate);
    const end = new Date(offer.endDate);
    return now >= start && now <= end;
  };

  const getDaysRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getOfferTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      PERCENTAGE: 'Percentage Discount',
      FIXED_AMOUNT: 'Fixed Discount',
      FREE_ITEM: 'Free Item',
    };
    return labels[type] || type;
  };

  const getOfferTypeBadge = (type: string) => {
    const badges: Record<string, string> = {
      PERCENTAGE: 'bg-purple-100 text-purple-800',
      FIXED_AMOUNT: 'bg-blue-100 text-blue-800',
      FREE_ITEM: 'bg-green-100 text-green-800',
    };
    return badges[type] || 'bg-gray-100 text-gray-800';
  };

  const formatDiscountValue = (offer: LoyaltyOffer) => {
    if (offer.offerType === 'PERCENTAGE') {
      return `${offer.discountValue}% OFF`;
    } else if (offer.offerType === 'FIXED_AMOUNT') {
      return `$${offer.discountValue.toFixed(2)} OFF`;
    }
    return offer.title;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading offers...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col items-center justify-center h-64 text-red-500">
          <p className="mb-4">{error}</p>
          <button
            onClick={fetchOffers}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
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
          <h2 className="text-xl font-bold text-gray-800">Active Offers & Promotions</h2>
          <Tag className="w-6 h-6 text-blue-500" />
        </div>

        {offers.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium mb-2">No active offers</p>
            <p className="text-gray-500 text-sm">
              Check back later for exciting promotions!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {offers.map((offer) => {
              const eligible = isOfferEligible(offer);
              const active = isOfferActive(offer);
              const daysRemaining = getDaysRemaining(offer.endDate);

              return (
                <div
                  key={offer.id}
                  className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                    eligible && active
                      ? 'border-blue-300 hover:border-blue-500 hover:shadow-lg cursor-pointer'
                      : 'border-gray-200 opacity-60'
                  }`}
                  onClick={() => eligible && active && setSelectedOffer(offer)}
                >
                  {/* Ribbon for urgency */}
                  {daysRemaining <= 3 && daysRemaining > 0 && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl">
                      {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left!
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-gray-800">{offer.title}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getOfferTypeBadge(offer.offerType)}`}>
                            {getOfferTypeLabel(offer.offerType)}
                          </span>
                        </div>

                        <div className="text-3xl font-extrabold text-blue-600 mb-2">
                          {formatDiscountValue(offer)}
                        </div>

                        {offer.description && (
                          <p className="text-sm text-gray-600 mb-3">{offer.description}</p>
                        )}

                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(offer.startDate).toLocaleDateString()} -{' '}
                              {new Date(offer.endDate).toLocaleDateString()}
                            </span>
                          </div>

                          {offer.minimumPurchase && (
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4" />
                              <span>Min. purchase: ${offer.minimumPurchase.toFixed(2)}</span>
                            </div>
                          )}

                          {offer.requiredTier && (
                            <div className="flex items-center gap-1">
                              <Tag className="w-4 h-4" />
                              <span>
                                Requires: {offer.requiredTier} tier
                                {!eligible && <span className="text-red-600 ml-1">(Not eligible)</span>}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {!active && (
                      <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded p-2 text-sm text-yellow-800">
                        This offer is not currently active
                      </div>
                    )}

                    {eligible && active && (
                      <div className="mt-3 text-sm text-green-600 font-medium">
                        ✓ You're eligible for this offer!
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Offer Details Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-800">{selectedOffer.title}</h3>
              <button
                onClick={() => setSelectedOffer(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-lg mb-4 text-white">
              <div className="text-4xl font-extrabold mb-2">
                {formatDiscountValue(selectedOffer)}
              </div>
              <p className="text-sm opacity-90">{selectedOffer.description}</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Calendar className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="font-medium">Valid Period</div>
                  <div className="text-gray-600">
                    {new Date(selectedOffer.startDate).toLocaleDateString()} -{' '}
                    {new Date(selectedOffer.endDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {selectedOffer.minimumPurchase && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="font-medium">Minimum Purchase</div>
                    <div className="text-gray-600">${selectedOffer.minimumPurchase.toFixed(2)}</div>
                  </div>
                </div>
              )}

              {selectedOffer.requiredTier && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Tag className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="font-medium">Required Tier</div>
                    <div className="text-gray-600">{selectedOffer.requiredTier} or higher</div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm text-blue-800">
                <strong>How to use:</strong> This offer will be automatically applied at checkout when you meet the requirements.
              </p>
            </div>

            <button
              onClick={() => setSelectedOffer(null)}
              className="mt-6 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoyaltyOffersList;
