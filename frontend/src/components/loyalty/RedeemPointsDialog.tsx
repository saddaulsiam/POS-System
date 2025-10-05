import React, { useState } from "react";
import { Gift, AlertCircle, X } from "lucide-react";
import { loyaltyAPI } from "../../services/api";
import toast from "react-hot-toast";
import type { RewardType } from "../../types";
import { useSettings } from "../../context/SettingsContext";
import { formatCurrency } from "../../utils/currencyUtils";

interface RedeemPointsDialogProps {
  customerId: number;
  customerName: string;
  availablePoints: number;
  cartTotal: number;
  isOpen: boolean;
  onClose: () => void;
  onRedeemed: (discountAmount: number, pointsUsed: number) => void;
}

interface RedemptionOption {
  type: RewardType;
  label: string;
  description: string;
  pointsRequired: number;
  value: number;
  icon: string;
}

const RedeemPointsDialog: React.FC<RedeemPointsDialogProps> = ({
  customerId,
  customerName,
  availablePoints,
  cartTotal,
  isOpen,
  onClose,
  onRedeemed,
}) => {
  const [selectedOption, setSelectedOption] = useState<RedemptionOption | null>(null);
  const [customPoints, setCustomPoints] = useState<string>("");
  const [redeeming, setRedeeming] = useState(false);
  const { settings } = useSettings();

  if (!isOpen) return null;

  // Define redemption options (example: 100 points = $1)
  const pointsToMoneyRate = 100; // 100 points = $1

  const predefinedOptions: RedemptionOption[] = [
    {
      type: "DISCOUNT",
      label: "$5 Discount",
      description: "Get $5 off your purchase",
      pointsRequired: 500,
      value: 5,
      icon: "💵",
    },
    {
      type: "DISCOUNT",
      label: "$10 Discount",
      description: "Get $10 off your purchase",
      pointsRequired: 1000,
      value: 10,
      icon: "💰",
    },
    {
      type: "DISCOUNT",
      label: "$20 Discount",
      description: "Get $20 off your purchase",
      pointsRequired: 2000,
      value: 20,
      icon: "🎁",
    },
    {
      type: "STORE_CREDIT",
      label: "$50 Store Credit",
      description: "Convert to store credit for future use",
      pointsRequired: 5000,
      value: 50,
      icon: "🏪",
    },
  ];

  const calculateCustomDiscount = (points: number) => {
    return points / pointsToMoneyRate;
  };

  const handleRedeem = async () => {
    if (!selectedOption && !customPoints) {
      toast.error("Please select a redemption option");
      return;
    }

    const pointsToRedeem = selectedOption ? selectedOption.pointsRequired : parseInt(customPoints);
    const discountValue = selectedOption ? selectedOption.value : calculateCustomDiscount(pointsToRedeem);
    const rewardType = selectedOption ? selectedOption.type : "DISCOUNT";

    if (pointsToRedeem > availablePoints) {
      toast.error("Insufficient points");
      return;
    }

    if (rewardType === "DISCOUNT" && discountValue > cartTotal) {
      toast.error("Discount cannot exceed cart total");
      return;
    }

    try {
      setRedeeming(true);

      await loyaltyAPI.redeemPoints({
        customerId,
        points: pointsToRedeem,
        rewardType,
        rewardValue: discountValue,
        description: selectedOption
          ? selectedOption.label
          : `Custom redemption: ${pointsToRedeem} points for ${formatCurrency(discountValue, settings)}`,
      });

      toast.success(`Successfully redeemed ${pointsToRedeem} points!`);
      onRedeemed(discountValue, pointsToRedeem);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to redeem points");
      console.error("Error redeeming points:", err);
    } finally {
      setRedeeming(false);
    }
  };

  const customPointsValue = customPoints ? parseInt(customPoints) : 0;
  const customDiscount = calculateCustomDiscount(customPointsValue);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Gift className="w-7 h-7 text-blue-500" />
              Redeem Points
            </h2>
            <p className="text-sm text-gray-600 mt-1">{customerName}</p>
          </div>
          <button onClick={onClose} disabled={redeeming} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Points Summary */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="text-xs text-gray-600 mb-1">Available Points</div>
              <div className="text-2xl font-bold text-blue-600">{availablePoints.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">
                = {formatCurrency(calculateCustomDiscount(availablePoints), settings)} value
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="text-xs text-gray-600 mb-1">Cart Total</div>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(cartTotal, settings)}</div>
              <div className="text-xs text-gray-500 mt-1">Current purchase amount</div>
            </div>
          </div>
        </div>

        {/* Redemption Options */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Redemption Option</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {predefinedOptions.map((option) => {
              const canAfford = availablePoints >= option.pointsRequired;
              const isSelected = selectedOption?.pointsRequired === option.pointsRequired;

              return (
                <button
                  key={option.label}
                  onClick={() => {
                    setSelectedOption(option);
                    setCustomPoints("");
                  }}
                  disabled={!canAfford || redeeming}
                  className={`relative p-4 rounded-lg border-2 text-left transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : canAfford
                      ? "border-gray-200 hover:border-blue-300 bg-white"
                      : "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}

                  <div className="text-3xl mb-2">{option.icon}</div>
                  <div className="font-bold text-gray-800 mb-1">{option.label}</div>
                  <div className="text-sm text-gray-600 mb-2">{option.description}</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className={canAfford ? "text-blue-600 font-semibold" : "text-red-600 font-semibold"}>
                      {option.pointsRequired} points
                    </span>
                    {!canAfford && (
                      <span className="text-red-600">Need {option.pointsRequired - availablePoints} more</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom Redemption */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-md font-semibold text-gray-800 mb-3">Custom Redemption</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter points to redeem (100 points = $1)
              </label>
              <input
                type="number"
                min="100"
                step="100"
                max={availablePoints}
                value={customPoints}
                onChange={(e) => {
                  setCustomPoints(e.target.value);
                  setSelectedOption(null);
                }}
                disabled={redeeming}
                placeholder="e.g., 500"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {customPointsValue > 0 && (
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-gray-600">Discount Value:</span>
                  <span className="font-bold text-green-600 text-lg">{formatCurrency(customDiscount, settings)}</span>
                </div>
              )}
              {customPointsValue > availablePoints && (
                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>Insufficient points</span>
                </div>
              )}
              {customDiscount > cartTotal && cartTotal > 0 && (
                <div className="mt-2 flex items-center gap-2 text-yellow-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>Discount cannot exceed cart total</span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Redeemed points will be deducted from your balance and applied as a discount to
              this purchase. This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
          <button
            onClick={onClose}
            disabled={redeeming}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleRedeem}
            disabled={
              redeeming ||
              (!selectedOption && !customPoints) ||
              (customPointsValue > 0 && customPointsValue > availablePoints) ||
              (!!selectedOption && selectedOption.pointsRequired > availablePoints)
            }
            className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-semibold"
          >
            {redeeming ? "Redeeming..." : "Redeem Points"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RedeemPointsDialog;
