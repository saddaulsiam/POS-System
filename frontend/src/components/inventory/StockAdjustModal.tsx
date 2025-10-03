import React, { useState } from "react";
import { Product } from "../../types";

type AllowedMovementType = "PURCHASE" | "ADJUSTMENT" | "RETURN" | "DAMAGED" | "EXPIRED";

const movementTypes: { label: string; value: AllowedMovementType }[] = [
  { label: "Purchase", value: "PURCHASE" },
  { label: "Adjustment", value: "ADJUSTMENT" },
  { label: "Return", value: "RETURN" },
  { label: "Damaged", value: "DAMAGED" },
  { label: "Expired", value: "EXPIRED" },
];

interface StockAdjustModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onSubmit: (data: { quantity: number; movementType: AllowedMovementType; reason: string }) => Promise<void>;
}

export const StockAdjustModal: React.FC<StockAdjustModalProps> = ({ isOpen, product, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<{
    quantity: number;
    movementType: AllowedMovementType;
    reason: string;
  }>({
    quantity: 0,
    movementType: "ADJUSTMENT",
    reason: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === "quantity") {
        return { ...prev, quantity: Number(value) };
      } else if (name === "movementType") {
        return { ...prev, movementType: value as AllowedMovementType };
      } else {
        return { ...prev, [name]: value };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    // Reset form
    setFormData({ quantity: 0, movementType: "ADJUSTMENT", reason: "" });
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">Adjust Stock for {product.name}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Movement Type</label>
            <select
              name="movementType"
              value={formData.movementType}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              {movementTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Reason (optional)</label>
            <input
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
              Adjust
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
