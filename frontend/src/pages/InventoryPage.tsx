import React, { useEffect, useState } from "react";
import { reportsAPI, inventoryAPI } from "../services/api";
import { Product, InventoryReport, StockMovement } from "../types";
import toast from "react-hot-toast";

type AllowedMovementType = "PURCHASE" | "ADJUSTMENT" | "RETURN" | "DAMAGED" | "EXPIRED";
const movementTypes: { label: string; value: AllowedMovementType }[] = [
  { label: "Purchase", value: "PURCHASE" },
  { label: "Adjustment", value: "ADJUSTMENT" },
  { label: "Return", value: "RETURN" },
  { label: "Damaged", value: "DAMAGED" },
  { label: "Expired", value: "EXPIRED" },
];

const InventoryPage: React.FC = () => {
  const [report, setReport] = useState<InventoryReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustForm, setAdjustForm] = useState<{
    quantity: number;
    movementType: AllowedMovementType;
    reason: string;
  }>({
    quantity: 0,
    movementType: "ADJUSTMENT",
    reason: "",
  });
  const [history, setHistory] = useState<StockMovement[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    setIsLoading(true);
    try {
      const data = await reportsAPI.getInventory();
      setReport(data);
    } catch (e) {
      toast.error("Failed to load inventory");
    } finally {
      setIsLoading(false);
    }
  };

  const openAdjustModal = (product: Product) => {
    setSelectedProduct(product);
    setAdjustForm({ quantity: 0, movementType: "ADJUSTMENT", reason: "" });
    setShowAdjustModal(true);
  };

  const handleAdjustChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAdjustForm((prev) => {
      if (name === "quantity") {
        return { ...prev, quantity: Number(value) };
      } else if (name === "movementType") {
        return { ...prev, movementType: value as AllowedMovementType };
      } else {
        return { ...prev, [name]: value };
      }
    });
  };

  const submitAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    let { quantity, movementType, reason } = adjustForm;
    if (!quantity || quantity === 0) {
      toast.error("Quantity must not be zero");
      return;
    }
    // Auto-adjust sign based on movement type
    if (movementType === "PURCHASE" || movementType === "RETURN") {
      quantity = Math.abs(quantity);
    } else if (movementType === "DAMAGED" || movementType === "EXPIRED") {
      quantity = -Math.abs(quantity);
    }
    // ADJUSTMENT: use as entered (positive or negative)
    try {
      await inventoryAPI.updateStock(selectedProduct.id, { quantity, movementType, reason });
      toast.success("Stock adjusted successfully");
      setShowAdjustModal(false);
      loadInventory();
    } catch (e) {
      toast.error("Failed to adjust stock");
    }
  };

  const openHistoryModal = async (product: Product) => {
    setSelectedProduct(product);
    setShowHistoryModal(true);
    try {
      const res = await inventoryAPI.getStockMovements(product.id, { limit: 20 });
      setHistory(res.movements || []);
    } catch (e) {
      toast.error("Failed to load stock history");
    }
  };

  const filteredProducts =
    report?.products.filter(
      (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
    ) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>

        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <input
            type="text"
            placeholder="Search by name or SKU..."
            className="border rounded px-3 py-2 w-full md:w-80"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="text-sm text-gray-500">
            Total Products: <span className="font-semibold">{report?.totalProducts ?? 0}</span> | Low Stock:{" "}
            <span className="font-semibold text-yellow-600">{report?.lowStockCount ?? 0}</span> | Out of Stock:{" "}
            <span className="font-semibold text-red-600">{report?.outOfStockCount ?? 0}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <p className="text-gray-500">No products found</p>
          ) : (
            <table className="min-w-full rounded-lg overflow-hidden border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase w-16">Image</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase min-w-[120px]">
                    Name
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase min-w-[80px]">
                    SKU
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase min-w-[60px]">
                    Stock
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase min-w-[90px]">
                    Status
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase min-w-[120px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, idx) => {
                  let status = "In Stock";
                  let statusClass = "bg-green-100 text-green-800";
                  if (product.stockQuantity <= 0) {
                    status = "Out of Stock";
                    statusClass = "bg-red-100 text-red-800";
                  } else if (product.stockQuantity <= product.lowStockThreshold) {
                    status = "Low Stock";
                    statusClass = "bg-yellow-100 text-yellow-800";
                  }
                  return (
                    <tr
                      key={product.id}
                      className={`align-middle transition-colors ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50`}
                    >
                      <td className="px-3 py-2">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded border"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-12 h-12 flex items-center justify-center bg-gray-100 text-gray-400 rounded border">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2 font-medium text-gray-900 min-w-[120px]">{product.name}</td>
                      <td className="px-3 py-2 text-gray-600 min-w-[80px]">{product.sku}</td>
                      <td className="px-3 py-2 text-gray-900 min-w-[60px]">{product.stockQuantity}</td>
                      <td className="px-3 py-2 min-w-[90px]">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${statusClass}`}>{status}</span>
                      </td>
                      <td className="px-3 py-2 min-w-[120px]">
                        <div className="flex items-center justify-center gap-2 w-full">
                          <button
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs"
                            onClick={() => openAdjustModal(product)}
                          >
                            Adjust Stock
                          </button>
                          <button
                            className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 text-xs"
                            onClick={() => openHistoryModal(product)}
                          >
                            History
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Adjust Stock Modal */}
        {showAdjustModal && selectedProduct && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                onClick={() => setShowAdjustModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-xl font-semibold mb-4">Adjust Stock for {selectedProduct.name}</h2>
              <form onSubmit={submitAdjustment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Quantity</label>
                  <input
                    name="quantity"
                    type="number"
                    value={adjustForm.quantity}
                    onChange={handleAdjustChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Movement Type</label>
                  <select
                    name="movementType"
                    value={adjustForm.movementType}
                    onChange={handleAdjustChange}
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
                    value={adjustForm.reason}
                    onChange={handleAdjustChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    onClick={() => setShowAdjustModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
                    Adjust
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Stock History Modal */}
        {showHistoryModal && selectedProduct && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative max-h-[80vh] overflow-y-auto">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                onClick={() => setShowHistoryModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-xl font-semibold mb-4">Stock History for {selectedProduct.name}</h2>
              {history.length === 0 ? (
                <p className="text-gray-500">No stock movements found.</p>
              ) : (
                <div className="overflow-y-auto max-h-[60vh]">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {history.map((m) => (
                        <tr key={m.id}>
                          <td className="px-4 py-2 text-gray-900">{new Date(m.createdAt).toLocaleString()}</td>
                          <td className="px-4 py-2 text-gray-700">{m.movementType}</td>
                          <td className="px-4 py-2 text-gray-900">{m.quantity}</td>
                          <td className="px-4 py-2 text-gray-600">{m.reason || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
