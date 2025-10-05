import React, { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";

interface Product {
  id: number;
  name: string;
  sku: string;
  purchasePrice: number;
}

interface Supplier {
  id: number;
  name: string;
}

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

interface EditPOModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseOrder: {
    id: number;
    poNumber: string;
    supplierId: number;
    orderDate: string;
    expectedDate: string | null;
    notes: string | null;
    items: PurchaseOrderItem[];
  };
  suppliers: Supplier[];
  products: Product[];
  onUpdate: (
    poId: number,
    data: {
      supplierId: number;
      orderDate: string;
      expectedDate?: string;
      notes?: string;
      items: Array<{ productId: number; quantity: number; unitPrice: number }>;
    }
  ) => Promise<void>;
}

const EditPOModal: React.FC<EditPOModalProps> = ({ isOpen, onClose, purchaseOrder, suppliers, products, onUpdate }) => {
  const [formData, setFormData] = useState({
    supplierId: purchaseOrder.supplierId.toString(),
    orderDate: purchaseOrder.orderDate.split("T")[0],
    expectedDate: purchaseOrder.expectedDate ? purchaseOrder.expectedDate.split("T")[0] : "",
    notes: purchaseOrder.notes || "",
  });

  const [poItems, setPOItems] = useState<Array<{ productId: number; quantity: number; unitPrice: number }>>(
    purchaseOrder.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitCost,
    }))
  );

  const [currentItem, setCurrentItem] = useState({
    productId: "",
    quantity: "1",
    unitPrice: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        supplierId: purchaseOrder.supplierId.toString(),
        orderDate: purchaseOrder.orderDate.split("T")[0],
        expectedDate: purchaseOrder.expectedDate ? purchaseOrder.expectedDate.split("T")[0] : "",
        notes: purchaseOrder.notes || "",
      });
      setPOItems(
        purchaseOrder.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitCost,
        }))
      );
    }
  }, [isOpen, purchaseOrder]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    if (!currentItem.productId || !currentItem.quantity || !currentItem.unitPrice) {
      alert("Please fill all item fields");
      return;
    }

    const product = products.find((p) => p.id === parseInt(currentItem.productId));
    if (!product) return;

    setPOItems([
      ...poItems,
      {
        productId: parseInt(currentItem.productId),
        quantity: parseFloat(currentItem.quantity),
        unitPrice: parseFloat(currentItem.unitPrice),
      },
    ]);

    setCurrentItem({ productId: "", quantity: "1", unitPrice: "" });
  };

  const handleRemoveItem = (index: number) => {
    setPOItems(poItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (poItems.length === 0) {
      alert("Please add at least one item");
      return;
    }

    setLoading(true);
    try {
      await onUpdate(purchaseOrder.id, {
        supplierId: parseInt(formData.supplierId),
        orderDate: formData.orderDate,
        expectedDate: formData.expectedDate || undefined,
        notes: formData.notes || undefined,
        items: poItems,
      });
      onClose();
    } catch (error) {
      console.error("Error updating purchase order:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return poItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Purchase Order</h2>
            <p className="text-sm text-gray-500 mt-1">PO: {purchaseOrder.poNumber}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Supplier *</label>
                <select
                  value={formData.supplierId}
                  onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order Date *</label>
                <input
                  type="date"
                  value={formData.orderDate}
                  onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expected Date</label>
                <input
                  type="date"
                  value={formData.expectedDate}
                  onChange={(e) => setFormData({ ...formData, expectedDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Optional notes about this purchase order"
              />
            </div>

            {/* Add Item Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-5">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Product</label>
                    <select
                      value={currentItem.productId}
                      onChange={(e) => {
                        const product = products.find((p) => p.id === parseInt(e.target.value));
                        setCurrentItem({
                          ...currentItem,
                          productId: e.target.value,
                          unitPrice: product ? product.purchasePrice.toString() : "",
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} ({product.sku})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={currentItem.quantity}
                      onChange={(e) => setCurrentItem({ ...currentItem, quantity: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div className="col-span-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Unit Price</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={currentItem.unitPrice}
                      onChange={(e) => setCurrentItem({ ...currentItem, unitPrice: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div className="col-span-1 flex items-end">
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-5 h-5 mx-auto" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Items List */}
              {poItems.length > 0 && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {poItems.map((item, index) => {
                        const product = products.find((p) => p.id === item.productId);
                        return (
                          <tr key={index}>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {product?.name || "Unknown"} ({product?.sku || "N/A"})
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-gray-900">{item.quantity}</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-900">${item.unitPrice.toFixed(2)}</td>
                            <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                              ${(item.quantity * item.unitPrice).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-sm text-right">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(index)}
                                className="text-red-600 hover:text-red-800 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      <tr className="bg-gray-50">
                        <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                          Total Amount:
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                          ${calculateTotal().toFixed(2)}
                        </td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || poItems.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {loading ? "Updating..." : "Update Purchase Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPOModal;
