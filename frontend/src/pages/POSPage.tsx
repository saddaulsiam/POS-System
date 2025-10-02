import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { productsAPI, customersAPI, salesAPI, categoriesAPI } from "../services/api";
import { Product, Customer, Category, CartItem } from "../types";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const POSPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [barcode, setBarcode] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "CARD">("CASH");
  const [cashReceived, setCashReceived] = useState("");

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoriesAPI.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const loadProducts = async (categoryId?: number) => {
    try {
      const data = await productsAPI.getAll({
        categoryId,
        isActive: true,
        limit: 50,
      });
      setProducts(data.data || []);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategory(categoryId);
    loadProducts(categoryId);
  };

  const handleBarcodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcode.trim()) return;

    try {
      let product: Product;

      // Try to find by barcode first
      if (barcode.match(/^\d+$/)) {
        try {
          product = await productsAPI.getByBarcode(barcode);
        } catch {
          // If barcode not found, search by name
          const searchResults = await productsAPI.getAll({
            search: barcode,
            isActive: true,
            limit: 1,
          });
          if (searchResults.data && searchResults.data.length > 0) {
            product = searchResults.data[0];
          } else {
            toast.error("Product not found");
            return;
          }
        }
      } else {
        // Search by name
        const searchResults = await productsAPI.getAll({
          search: barcode,
          isActive: true,
          limit: 1,
        });
        if (searchResults.data && searchResults.data.length > 0) {
          product = searchResults.data[0];
        } else {
          toast.error("Product not found");
          return;
        }
      }

      addToCart(product);
      setBarcode("");
    } catch (error) {
      console.error("Error searching product:", error);
      toast.error("Error searching product");
    }
  };

  const addToCart = (product: Product) => {
    if (product.stockQuantity <= 0) {
      toast.error("Product is out of stock");
      return;
    }

    const existingItem = cart.find((item) => item.product.id === product.id);

    if (existingItem) {
      if (existingItem.quantity >= product.stockQuantity) {
        toast.error("Not enough stock available");
        return;
      }

      setCart(
        cart.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * item.price,
              }
            : item
        )
      );
    } else {
      const newItem: CartItem = {
        product,
        quantity: 1,
        price: product.sellingPrice,
        subtotal: product.sellingPrice,
      };
      setCart([...cart, newItem]);
    }

    toast.success(`${product.name} added to cart`);
  };

  const updateCartItemQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const item = cart.find((item) => item.product.id === productId);
    if (item && quantity > item.product.stockQuantity) {
      toast.error("Not enough stock available");
      return;
    }

    setCart(
      cart.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity,
              subtotal: quantity * item.price,
            }
          : item
      )
    );
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const searchCustomer = async () => {
    if (!customerPhone.trim()) {
      setCustomer(null);
      return;
    }

    try {
      const customerData = await customersAPI.getByPhone(customerPhone);
      setCustomer(customerData);
      toast.success(`Customer found: ${customerData.name}`);
    } catch (error) {
      setCustomer(null);
      toast.error("Customer not found");
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.subtotal, 0);
  };

  const calculateTax = () => {
    return cart.reduce((total, item) => {
      const itemTax = (item.subtotal * item.product.taxRate) / 100;
      return total + itemTax;
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handlePayment = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    setShowPaymentModal(true);
  };

  const processPayment = async () => {
    if (isProcessingPayment) return;

    setIsProcessingPayment(true);

    try {
      const total = calculateTotal();
      const cashAmount = paymentMethod === "CASH" ? parseFloat(cashReceived) : total;

      if (paymentMethod === "CASH" && cashAmount < total) {
        toast.error("Insufficient cash amount");
        setIsProcessingPayment(false);
        return;
      }

      const saleData = {
        customerId: customer?.id,
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount || 0,
        })),
        paymentMethod,
        cashReceived: paymentMethod === "CASH" ? cashAmount : undefined,
      };

      const sale = await salesAPI.create(saleData);

      toast.success(`Sale completed! Receipt ID: ${sale.receiptId}`);

      // Clear cart and reset form
      setCart([]);
      setCustomer(null);
      setCustomerPhone("");
      setShowPaymentModal(false);
      setCashReceived("");
      setPaymentMethod("CASH");

      // Reload products to update stock quantities
      loadProducts(selectedCategory || undefined);
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Failed to process payment");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const getChangeAmount = () => {
    if (paymentMethod !== "CASH") return 0;
    const cash = parseFloat(cashReceived) || 0;
    const total = calculateTotal();
    return Math.max(0, cash - total);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 flex items-center justify-between h-16">
          {/* Left: Store Logo and Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🛒</span>
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">Fresh Mart</span>
            <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">{user?.role}</span>
          </div>
          {/* Right: User Info and Actions */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700 hidden sm:inline">Welcome, {user?.name}</span>
            {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
              <Link
                to="/admin"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded transition-colors"
              >
                Admin Panel
              </Link>
            )}
            <button
              onClick={logout}
              className="text-sm text-red-600 hover:text-white hover:bg-red-600 font-medium px-3 py-1 rounded transition-colors border border-red-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Product Scanning & Categories */}
        <div className="flex-1 flex flex-col">
          {/* Barcode Scanner */}
          <div className="p-4 bg-white border-b border-gray-200">
            <form onSubmit={handleBarcodeSubmit} className="flex space-x-2">
              <input
                type="text"
                placeholder="Scan barcode or search product..."
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add
              </button>
            </form>
          </div>

          {/* Quick Access Categories */}
          <div className="flex-1 p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  loadProducts();
                }}
                className={`p-4 rounded-lg shadow hover:shadow-md transition-shadow border ${
                  selectedCategory === null ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
                }`}
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-blue-600 text-xl">🛒</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">All Products</p>
                </div>
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`p-4 rounded-lg shadow hover:shadow-md transition-shadow border ${
                    selectedCategory === category.id ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <span className="text-blue-600 text-xl">{category.icon || "📦"}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{category.name}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Products Grid */}
            {products.length > 0 && (
              <div className="mt-6">
                <h4 className="text-md font-medium text-gray-900 mb-3">
                  {selectedCategory ? categories.find((c) => c.id === selectedCategory)?.name : "All Products"}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => addToCart(product)}
                      disabled={product.stockQuantity <= 0}
                      className="p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-xs text-gray-500 truncate">{product.sku}</p>
                        <p className="text-sm font-semibold text-green-600">${product.sellingPrice.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">Stock: {product.stockQuantity}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Shopping Cart */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          {/* Customer Info */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Customer</h3>
            <div className="flex space-x-2 mb-2">
              <input
                type="tel"
                placeholder="Phone number (optional)"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={searchCustomer}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                Search
              </button>
            </div>
            {customer && (
              <div className="bg-green-50 border border-green-200 rounded-md p-2">
                <p className="text-sm font-medium text-green-800">{customer.name}</p>
                <p className="text-xs text-green-600">Points: {customer.loyaltyPoints}</p>
              </div>
            )}
          </div>

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
                            updateCartItemQuantity(item.product.id, newQuantity);
                          }}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                          min="1"
                          max={item.product.stockQuantity}
                        />
                        <div className="text-sm font-medium text-gray-900">${item.subtotal.toFixed(2)}</div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-600 hover:text-red-800"
                        >
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
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax:</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium text-lg border-t pt-2">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handlePayment}
                disabled={cart.length === 0}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Process Payment
              </button>
              <button
                disabled={cart.length === 0}
                onClick={() => {
                  if (confirm("Clear the entire cart?")) {
                    setCart([]);
                  }
                }}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Process Payment</h3>

            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax:</span>
                  <span>${calculateTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium text-lg border-t border-gray-200 pt-2 mt-2">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPaymentMethod("CASH")}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                      paymentMethod === "CASH"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Cash
                  </button>
                  <button
                    onClick={() => setPaymentMethod("CARD")}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                      paymentMethod === "CARD"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Card
                  </button>
                </div>
              </div>

              {paymentMethod === "CASH" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cash Received</label>
                  <input
                    type="number"
                    step="0.01"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    min={calculateTotal()}
                  />
                  {cashReceived && (
                    <div className="mt-2 text-sm">
                      <span className="text-gray-600">Change: </span>
                      <span className="font-medium">${getChangeAmount().toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={processPayment}
                  disabled={
                    isProcessingPayment || (paymentMethod === "CASH" && parseFloat(cashReceived) < calculateTotal())
                  }
                  className="flex-1 py-2 px-4 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessingPayment ? "Processing..." : "Complete Sale"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POSPage;
