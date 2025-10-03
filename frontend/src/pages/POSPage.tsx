import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  productsAPI,
  customersAPI,
  salesAPI,
  categoriesAPI,
} from "../services/api";
import { Product, Customer, Category, CartItem } from "../types";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { POSBarcodeScanner } from "../components/pos/POSBarcodeScanner";
import { POSProductGrid } from "../components/pos/POSProductGrid";
import { POSCustomerSearch } from "../components/pos/POSCustomerSearch";
import { POSCart } from "../components/pos/POSCart";
import { POSPaymentModal } from "../components/pos/POSPaymentModal";
import {
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  calculateChange,
} from "../utils/posUtils";

const POSPage: React.FC = () => {
  const { user, logout } = useAuth();
  
  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Barcode state
  const [barcode, setBarcode] = useState("");
  
  // Customer state
  const [customerPhone, setCustomerPhone] = useState("");
  const [customer, setCustomer] = useState<Customer | null>(null);
  
  // Products and categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  
  // Payment state
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

  const handleCategoryClick = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    loadProducts(categoryId || undefined);
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

  const handlePayment = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    setShowPaymentModal(true);
  };

  const handleClearCart = () => {
    if (confirm("Clear the entire cart?")) {
      setCart([]);
    }
  };

  const processPayment = async () => {
    if (isProcessingPayment) return;

    setIsProcessingPayment(true);

    try {
      const total = calculateTotal(cart);
      const cashAmount =
        paymentMethod === "CASH" ? parseFloat(cashReceived) : total;

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

  // Calculate totals
  const subtotal = calculateSubtotal(cart);
  const tax = calculateTax(cart);
  const total = calculateTotal(cart);
  const changeAmount = calculateChange(parseFloat(cashReceived) || 0, total);

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
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              Fresh Mart
            </span>
            <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
              {user?.role}
            </span>
          </div>
          {/* Right: User Info and Actions */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700 hidden sm:inline">
              Welcome, {user?.name}
            </span>
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
          <POSBarcodeScanner
            barcode={barcode}
            onBarcodeChange={setBarcode}
            onSubmit={handleBarcodeSubmit}
          />

          {/* Quick Access Categories & Products Grid */}
          <POSProductGrid
            products={products}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryClick={handleCategoryClick}
            onProductClick={addToCart}
          />
        </div>

        {/* Right Panel - Shopping Cart */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          {/* Customer Info */}
          <POSCustomerSearch
            customerPhone={customerPhone}
            customer={customer}
            onPhoneChange={setCustomerPhone}
            onSearch={searchCustomer}
          />

          {/* Cart */}
          <POSCart
            cart={cart}
            onUpdateQuantity={updateCartItemQuantity}
            onRemoveItem={removeFromCart}
            onClearCart={handleClearCart}
            onProcessPayment={handlePayment}
            subtotal={subtotal}
            tax={tax}
            total={total}
          />
        </div>
      </div>

      {/* Payment Modal */}
      <POSPaymentModal
        isOpen={showPaymentModal}
        subtotal={subtotal}
        tax={tax}
        total={total}
        paymentMethod={paymentMethod}
        cashReceived={cashReceived}
        changeAmount={changeAmount}
        isProcessing={isProcessingPayment}
        onClose={() => setShowPaymentModal(false)}
        onPaymentMethodChange={setPaymentMethod}
        onCashReceivedChange={setCashReceived}
        onConfirm={processPayment}
      />
    </div>
  );
};

export default POSPage;
