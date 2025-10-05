import React, { useState } from "react";
import { X } from "lucide-react";

interface PurchaseOrderItem {
  id: number;
  productId: number;
  quantity: number;
  receivedQuantity: number;
  unitCost: number;
  totalCost: number;
  product: {
    id: number;
    name: string;
    sku: string;
  };
}

interface ReceiveItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseOrder: {
    id: number;
    poNumber: string;
    items: PurchaseOrderItem[];
  };
  onReceive: (poId: number, items: Array<{ itemId: number; receivedQuantity: number }>) => Promise<void>;
}

const ReceiveItemsModal: React.FC<ReceiveItemsModalProps> = ({ isOpen, onClose, purchaseOrder, onReceive }) => {
  const [receivedQuantities, setReceivedQuantities] = useState<Record<number, string>>(
    purchaseOrder.items.reduce((acc, item) => {
      const remaining = item.quantity - item.receivedQuantity;
      acc[item.id] = remaining > 0 ? remaining.toString() : "0";
      return acc;
    }, {} as Record<number, string>)
  );
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleQuantityChange = (itemId: number, value: string) => {
    // Allow empty string or valid numbers
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setReceivedQuantities((prev) => ({
        ...prev,
        [itemId]: value,
      }));
    }
  };

  const handleReceive = async () => {
    const items = Object.entries(receivedQuantities)
      .map(([itemId, quantity]) => ({
        itemId: parseInt(itemId),
        receivedQuantity: parseFloat(quantity) || 0,
      }))
      .filter((item) => item.receivedQuantity > 0);

    if (items.length === 0) {
      alert("Please enter at least one quantity to receive");
      return;
    }

    // Validate quantities
    for (const item of items) {
      const poItem = purchaseOrder.items.find((i) => i.id === item.itemId);
      if (poItem) {
        const newTotal = poItem.receivedQuantity + item.receivedQuantity;
        if (newTotal > poItem.quantity) {
          alert(
            `Cannot receive ${item.receivedQuantity} of ${poItem.product.name}. Maximum: ${
              poItem.quantity - poItem.receivedQuantity
            }`
          );
          return;
        }
      }
    }

    setLoading(true);
    try {
      await onReceive(purchaseOrder.id, items);
      onClose();
    } catch (error) {
      console.error("Error receiving items:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRemainingQuantity = (item: PurchaseOrderItem) => {
    return item.quantity - item.receivedQuantity;
  };

  const hasItemsToReceive = purchaseOrder.items.some((item) => item.receivedQuantity < item.quantity);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Receive Items</h2>
            <p className="text-sm text-gray-500 mt-1">PO: {purchaseOrder.poNumber}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {!hasItemsToReceive ? (
            <div className="text-center py-8">
              <p className="text-gray-500">All items have been fully received.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Enter the quantity received for each item. Stock levels will be updated
                  automatically.
                </p>
              </div>

              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ordered</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Previously Received
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Remaining</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Receive Now</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {purchaseOrder.items.map((item) => {
                    const remaining = getRemainingQuantity(item);
                    const isFullyReceived = remaining === 0;

                    return (
                      <tr key={item.id} className={isFullyReceived ? "bg-gray-50 opacity-50" : ""}>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">{item.product.name}</td>
                        <td className="px-4 py-4 text-sm text-gray-500">{item.product.sku}</td>
                        <td className="px-4 py-4 text-sm text-right text-gray-900">{item.quantity}</td>
                        <td className="px-4 py-4 text-sm text-right text-gray-600">{item.receivedQuantity}</td>
                        <td className="px-4 py-4 text-sm text-right font-medium text-gray-900">{remaining}</td>
                        <td className="px-4 py-4 text-sm text-right">
                          {isFullyReceived ? (
                            <span className="text-green-600 font-medium">Completed</span>
                          ) : (
                            <input
                              type="number"
                              min="0"
                              max={remaining}
                              step="0.01"
                              value={receivedQuantities[item.id] || ""}
                              onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                              className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                              placeholder="0"
                            />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          {hasItemsToReceive && (
            <button
              onClick={handleReceive}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {loading ? "Receiving..." : "Receive Items"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiveItemsModal;
