import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Product } from "../types";
import { productsAPI } from "../services/api";
import { BackButton } from "../components/common";
import { ProductVariantList } from "../components/products";
import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currencyUtils";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();

  useEffect(() => {
    if (id) {
      loadProduct(parseInt(id));
    }
  }, [id]);

  const loadProduct = async (productId: number) => {
    try {
      setLoading(true);
      const data = await productsAPI.getById(productId);
      setProduct(data);
    } catch (error) {
      console.error("Error loading product:", error);
      toast.error("Failed to load product details");
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="mt-4 text-xl font-semibold text-gray-900">Product not found</p>
          <p className="mt-2 text-sm text-gray-600">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <div className="mt-6 flex justify-center">
            <BackButton to="/products" label="Back to Products" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <BackButton to="/products" label="Back to Products" className="mb-4" />

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <p className="mt-2 text-sm text-gray-600">
                SKU: <span className="font-semibold">{product.sku}</span>
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                product.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
              }`}
            >
              {product.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Product Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Category:</span>
                <p className="font-semibold text-gray-900">{product.category?.name || "N/A"}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Supplier:</span>
                <p className="font-semibold text-gray-900">{product.supplier?.name || "N/A"}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Barcode:</span>
                <p className="font-mono text-sm text-gray-900">{product.barcode}</p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Pricing</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Purchase Price:</span>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(product.purchasePrice, settings)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Selling Price:</span>
                <p className="text-xl font-bold text-blue-600">{formatCurrency(product.sellingPrice, settings)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Profit Margin:</span>
                <p className="font-semibold text-green-600">
                  {(((product.sellingPrice - product.purchasePrice) / product.sellingPrice) * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Inventory</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Current Stock:</span>
                <p
                  className={`text-xl font-bold ${
                    product.stockQuantity > product.lowStockThreshold
                      ? "text-green-600"
                      : product.stockQuantity > 0
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {product.stockQuantity} {product.unit || "units"}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Low Stock Alert:</span>
                <p className="font-semibold text-gray-900">
                  {product.lowStockThreshold} {product.unit || "units"}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Type:</span>
                <p className="font-semibold text-gray-900">{product.isWeighted ? "Weighted" : "Regular"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Variants Section */}
        <ProductVariantList product={product} />

        {/* Additional Info */}
        {product.description && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
            <p className="text-gray-700">{product.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
