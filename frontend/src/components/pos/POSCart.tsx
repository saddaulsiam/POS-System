import React from "react";
import { CartItem } from "../../types";
import { Button } from "../common";
import { useSettings } from "../../context/SettingsContext";

interface POSCartProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
  onProcessPayment: () => void;
  onSplitPayment?: () => void;
  onParkSale?: () => void;
  onViewParkedSales?: () => void;
  onRedeemPoints?: () => void;
  subtotal: number;
  tax: number;
  total: number;
  loyaltyDiscount?: number;
  customer?: any; // Customer with loyalty points
}

export const POSCart: React.FC<POSCartProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProcessPayment,
  onSplitPayment,
  onParkSale,
  onViewParkedSales,
  onRedeemPoints,
  subtotal,
  tax,
  total,
  loyaltyDiscount = 0,
  customer,
}) => {
  const { settings } = useSettings();

  return (
    <>
      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Cart ({cart.length} items)</h3>

          {cart.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6"
                />
              </svg>
              <p>Cart is empty</p>
              <p className="text-sm">Scan a product to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                    <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                    <p className="text-xs text-gray-500">Stock: {item.product.stockQuantity}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value) || 1;
                        onUpdateQuantity(item.product.id, newQuantity);
                      }}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                      min="1"
                      max={item.product.stockQuantity}
                    />
                    <div className="text-sm font-medium text-gray-900">${item.subtotal.toFixed(2)}</div>
                    <button onClick={() => onRemoveItem(item.product.id)} className="text-red-600 hover:text-red-800">
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cart Summary & Payment */}
      <div className="border-t border-gray-200 p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax:</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          {loyaltyDiscount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>🎁 Loyalty Discount:</span>
              <span>-${loyaltyDiscount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-medium text-lg border-t pt-2">
            <span>Total:</span>
            <span>${(total - loyaltyDiscount).toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-2">
          {/* Loyalty Points Button - Show if customer has points and setting enabled */}
          {settings?.enableLoyaltyPoints &&
            onRedeemPoints &&
            customer &&
            customer.loyaltyPoints > 0 &&
            loyaltyDiscount === 0 &&
            cart.length > 0 && (
              <Button variant="primary" fullWidth onClick={onRedeemPoints}>
                ⭐ Use Loyalty Points ({customer.loyaltyPoints} pts)
              </Button>
            )}
          <Button variant="success" fullWidth onClick={onProcessPayment} disabled={cart.length === 0}>
            💳 Process Payment
          </Button>
          {settings?.enableSplitPayment && onSplitPayment && (
            <Button variant="primary" fullWidth onClick={onSplitPayment} disabled={cart.length === 0}>
              🔀 Split Payment
            </Button>
          )}
          {settings?.enableParkSale && (
            <div className="grid grid-cols-2 gap-2">
              {onParkSale && (
                <Button variant="warning" onClick={onParkSale} disabled={cart.length === 0}>
                  🅿️ Park Sale
                </Button>
              )}
              {onViewParkedSales && (
                <Button variant="secondary" onClick={onViewParkedSales}>
                  📋 Parked
                </Button>
              )}
            </div>
          )}
          <Button variant="secondary" fullWidth onClick={onClearCart} disabled={cart.length === 0}>
            🗑️ Clear Cart
          </Button>
        </div>
      </div>
    </>
  );
};
