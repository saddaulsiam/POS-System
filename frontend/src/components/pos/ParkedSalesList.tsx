import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { ParkedSale } from "../../types";
import { parkedSalesAPI } from "../../services";
import { Button } from "../common";
import { useSettings } from "../../context/SettingsContext";
import { formatCurrency } from "../../utils/currencyUtils";

interface ParkedSalesListProps {
  isOpen: boolean;
  onClose: () => void;
  onResume: (parkedSale: ParkedSale) => void;
}

export const ParkedSalesList: React.FC<ParkedSalesListProps> = ({ isOpen, onClose, onResume }) => {
  const [parkedSales, setParkedSales] = useState<ParkedSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const { settings } = useSettings();

  useEffect(() => {
    if (isOpen) {
      loadParkedSales();
    }
  }, [isOpen]);

  const loadParkedSales = async () => {
    try {
      setLoading(true);
      const data = await parkedSalesAPI.getAll();
      setParkedSales(data);
    } catch (error) {
      console.error("Error loading parked sales:", error);
      toast.error("Failed to load parked sales");
    } finally {
      setLoading(false);
    }
  };

  const handleResume = (parkedSale: ParkedSale) => {
    onResume(parkedSale);
    onClose();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this parked sale?")) {
      return;
    }

    try {
      setDeleting(id);
      await parkedSalesAPI.delete(id);
      toast.success("Parked sale deleted");
      loadParkedSales();
    } catch (error: any) {
      console.error("Error deleting parked sale:", error);
      toast.error(error.response?.data?.error || "Failed to delete parked sale");
    } finally {
      setDeleting(null);
    }
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();

    if (diff < 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return "< 1h";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl relative max-h-[90vh] overflow-y-auto">
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl" onClick={onClose}>
          ×
        </button>

        <h2 className="text-2xl font-bold mb-2 text-gray-800">Parked Sales</h2>
        <p className="text-sm text-gray-600 mb-6">Resume or manage your saved sales</p>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading parked sales...</span>
          </div>
        ) : parkedSales.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No parked sales</h3>
            <p className="mt-1 text-sm text-gray-500">Park a sale to resume it later</p>
          </div>
        ) : (
          <div className="space-y-4">
            {parkedSales.map((sale) => {
              const expired = isExpired(sale.expiresAt);
              const itemCount = sale.items?.length || 0;

              return (
                <div
                  key={sale.id}
                  className={`border rounded-lg p-4 ${
                    expired ? "border-orange-200 bg-orange-50" : "border-gray-200 bg-white hover:shadow-md"
                  } transition-shadow`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900">Sale #{sale.id}</span>
                        {sale.customer && <span className="text-sm text-gray-600">• {sale.customer.name}</span>}
                        {expired && (
                          <span className="px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-800 rounded-full">
                            Expired (Still Resumable)
                          </span>
                        )}
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-2">
                        <div>
                          <span className="text-gray-600">Items:</span>
                          <p className="font-semibold text-gray-900">{itemCount}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Total:</span>
                          <p className="font-semibold text-blue-600">{formatCurrency(sale.subtotal, settings)}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Parked:</span>
                          <p className="font-medium text-gray-900">{formatDate(sale.parkedAt)}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Expires in:</span>
                          <p className={`font-medium ${expired ? "text-orange-600" : "text-gray-900"}`}>
                            {getTimeRemaining(sale.expiresAt)}
                          </p>
                        </div>
                      </div>

                      {/* Notes */}
                      {sale.notes && (
                        <div className="mt-2 text-sm">
                          <span className="text-gray-600">Notes:</span>
                          <p className="text-gray-900 italic">{sale.notes}</p>
                        </div>
                      )}

                      {/* Employee */}
                      {sale.employee && (
                        <div className="mt-2 text-xs text-gray-500">Parked by: {sale.employee.name}</div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        variant={expired ? "secondary" : "primary"}
                        onClick={() => handleResume(sale)}
                        className="text-sm flex"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Resume
                      </Button>
                      <button
                        onClick={() => handleDelete(sale.id)}
                        disabled={deleting === sale.id}
                        className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded border border-red-300 disabled:opacity-50"
                      >
                        {deleting === sale.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
