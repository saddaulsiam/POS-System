import { useCallback } from "react";
import toast from "react-hot-toast";
import type { Product, ParkedSale, CartItem } from "../types";
import { customersAPI, parkedSalesAPI, productsAPI, productVariantsAPI } from "../services";
import { formatCurrency } from "../utils/currencyUtils";

interface UsePOSHandlersArgs {
  salesAPI?: any;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  customer: any;
  setCustomer: (customer: any) => void;
  setCustomerPhone: (phone: string) => void;
  setCustomerNotFound: (notFound: boolean) => void;
  setShowCreateCustomerModal: (open: boolean) => void;
  setShowParkSaleDialog: (open: boolean) => void;
  setShowSplitPaymentModal: (open: boolean) => void;
  setLoyaltyDiscount: (amount: number) => void;
  loyaltyDiscount: number;
  settings: any;
  selectedCategory: number | null;
  loadProducts: (categoryId?: number) => void;
  addVariantToCart: (variant: any, product: Product) => void;
  addToCart: (product: Product) => void;
  setShowVariantSelector: (open: boolean) => void;
  setSelectedProductForVariant: (product: Product | null) => void;
  setBarcode?: (barcode: string) => void;
  customerPhone?: string;
  setShowRedeemPointsDialog?: (open: boolean) => void;
}

export function usePOSHandlers(args: UsePOSHandlersArgs) {
  const { addToCart, addVariantToCart } = args;
  // Handler: Barcode submit (matches POSBarcodeScanner prop signature)
  const handleBarcodeSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!args.cart || !args.setCart) return;
      const barcode = (e.target as any).barcode?.value || "";
      if (!barcode.trim()) return;
      try {
        if (barcode.match(/^\d+$/)) {
          try {
            const variant = await productVariantsAPI.lookup(barcode);
            if (variant && variant.productId) {
              const product = await productsAPI.getById(variant.productId);
              addVariantToCart(variant, product);
              args.setBarcode && args.setBarcode("");
              return;
            }
          } catch (variantError: any) {
            // Only show error if it's a server error (not 404)
            if (
              typeof variantError === "object" &&
              variantError &&
              "response" in variantError &&
              (variantError as any).response?.status >= 500
            ) {
              toast.error("Error looking up variant");
            }
            // If 404, fall through to product lookup
          }
        }
        // Try product lookup if variant not found or not a number barcode
        let product;
        try {
          product = await productsAPI.getByBarcode(barcode);
        } catch {
          const searchResults = await productsAPI.getAll({ search: barcode, isActive: true, limit: 1 });
          if (searchResults.data && searchResults.data.length > 0) {
            product = searchResults.data[0];
          } else {
            toast.error("Product not found");
            return;
          }
        }
        // If product has variants, show variant selector modal
        if (product.hasVariants && args.setShowVariantSelector && args.setSelectedProductForVariant) {
          args.setSelectedProductForVariant(product);
          args.setShowVariantSelector(true);
        } else {
          addToCart(product);
        }
        args.setBarcode && args.setBarcode("");
      } catch (error) {
        console.error("Error searching product:", error);
        toast.error("Error searching product");
      }
    },
    [addToCart, addVariantToCart]
  );

  // Handler: Add to cart (matches POSProductGrid prop signature)
  const handleAddToCart = useCallback(
    (product: Product) => {
      if (product.hasVariants && args.setShowVariantSelector && args.setSelectedProductForVariant) {
        args.setSelectedProductForVariant(product);
        args.setShowVariantSelector(true);
        return;
      }
      addToCart(product);
    },
    [addToCart]
  );

  // Handler: Customer form submit (matches CustomerModal prop signature)
  const handleCustomerFormSubmit = useCallback(async (formData: any) => {
    try {
      const customerData = {
        name: formData.name.trim(),
        phoneNumber: formData.phoneNumber.trim() || (args.customerPhone?.trim?.() ?? ""),
        email: formData.email.trim() || undefined,
        dateOfBirth: formData.dateOfBirth.trim() || undefined,
        address: formData.address.trim() || undefined,
      };
      const newCustomer = await customersAPI.create(customerData);
      args.setCustomer(newCustomer);
      args.setCustomerPhone(newCustomer.phoneNumber || "");
      args.setCustomerNotFound(false);
      args.setShowCreateCustomerModal(false);
      toast.success(`Customer created: ${newCustomer.name}`);
    } catch (error) {
      console.error("Error creating customer:", error);
      if (typeof error === "object" && error && "response" in error) {
        toast.error((error as any).response?.data?.error || "Failed to create customer");
      } else {
        toast.error("Failed to create customer");
      }
      throw error;
    }
  }, []);

  // Handler: Confirm park sale (matches ParkSaleDialog prop signature)
  const confirmParkSale = useCallback(async (notes: string) => {
    try {
      const subtotal = args.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const tax = args.cart.reduce(
        (sum, item) => sum + ((item.product.taxRate || 0) * item.price * item.quantity) / 100,
        0
      );
      const parkData = {
        customerId: args.customer?.id,
        items: args.cart.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          productSku: item.product.sku,
          productBarcode: item.product.barcode,
          productVariantId: item.variant?.id,
          productVariantName: item.variant?.name,
          productVariantSku: item.variant?.sku,
          quantity: item.quantity,
          price: item.price,
          taxRate: item.product.taxRate || 0,
          categoryId: item.product.categoryId,
        })),
        subtotal,
        taxAmount: tax,
        discountAmount: 0,
        notes,
      };
      await parkedSalesAPI.create(parkData);
      toast.success("Sale parked successfully");
      args.setCart([]);
      args.setCustomer(null);
      args.setCustomerPhone("");
      args.setShowParkSaleDialog(false);
      args.setLoyaltyDiscount(0);
    } catch (error) {
      console.error("Error parking sale:", error);
      if (typeof error === "object" && error && "response" in error) {
        toast.error((error as any).response?.data?.error || "Failed to park sale");
      } else {
        toast.error("Failed to park sale");
      }
    }
  }, []);

  // Handler: Resume parked sale (matches ParkedSalesList prop signature)
  const handleResumeParkedSale = useCallback((parkedSale: ParkedSale) => {
    try {
      const parkedItems = parkedSale.items as any[];
      const cartItems = parkedItems.map((item) => ({
        product: {
          id: item.productId,
          name: item.productName || "Product",
          sku: item.productSku || "",
          barcode: item.productBarcode || "",
          description: "",
          categoryId: item.categoryId || 0,
          supplierId: undefined,
          costPrice: item.price,
          purchasePrice: item.price,
          sellingPrice: item.price,
          stockQuantity: 999,
          reorderLevel: 0,
          lowStockThreshold: 0,
          taxRate: item.taxRate || 0,
          isActive: true,
          isWeighted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isDeleted: false,
        },
        quantity: item.quantity,
        price: item.price,
        subtotal: item.quantity * item.price,
      }));
      args.setCart(cartItems);
      if (parkedSale.customer) {
        args.setCustomer(parkedSale.customer);
        args.setCustomerPhone(parkedSale.customer.phoneNumber || "");
      }
      toast.success("Parked sale resumed");
    } catch (error) {
      console.error("Error resuming parked sale:", error);
      toast.error("Failed to resume parked sale");
    }
  }, []);

  // Handler: Points redeemed (matches RedeemPointsDialog prop signature)
  const handlePointsRedeemed = useCallback((discountAmount: number, points: number) => {
    args.setLoyaltyDiscount(discountAmount);
    args.setShowRedeemPointsDialog && args.setShowRedeemPointsDialog(false);
    toast.success(`Applied ${formatCurrency(discountAmount, args.settings)} loyalty discount using ${points} points!`);
  }, []);

  // Handler: Confirm split payment (matches SplitPaymentDialog prop signature)
  const handleConfirmSplitPayment = useCallback(async (splits: any[]) => {
    // You may want to add isProcessingPayment logic here if needed
    try {
      const saleData = {
        customerId: args.customer?.id,
        items: args.cart.map((item) => ({
          productId: item.product.id,
          productVariantId: item.variant?.id,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount || 0,
        })),
        paymentMethod: "MIXED" as any,
        paymentSplits: splits.map((split) => ({
          paymentMethod: split.method,
          amount: split.amount,
        })),
        loyaltyDiscount: args.loyaltyDiscount || 0,
      };

      // You may want to use salesAPI and receiptsAPI from args if needed
      try {
        // @ts-ignore: salesAPI should be available in your context or pass as arg
        const sale = await (args.salesAPI || (window as any).salesAPI).create(saleData);
        toast.success(`Sale completed! Receipt ID: ${sale.receiptId || sale.id || ""}`);
        args.setCart([]);
        args.setCustomer(null);
        args.setCustomerPhone("");
        args.setShowSplitPaymentModal(false);
        args.setLoyaltyDiscount(0);
        args.loadProducts(args.selectedCategory || undefined);
      } catch (error: any) {
        let errorMessage = "Failed to process payment";
        if (error?.response?.data?.errors && error.response.data.errors.length > 0) {
          const firstError = error.response.data.errors[0];
          errorMessage = firstError.msg || errorMessage;
        } else if (error?.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error?.message) {
          errorMessage = error.message;
        }
        toast.error(errorMessage);
      }
      // You may want to use salesAPI and receiptsAPI from args if needed
      toast.success(`Sale completed!`);
      args.setCart([]);
      args.setCustomer(null);
      args.setCustomerPhone("");
      args.setShowSplitPaymentModal(false);
      args.setLoyaltyDiscount(0);
      args.loadProducts(args.selectedCategory || undefined);
    } catch (error) {
      toast.error("Failed to process payment");
    }
  }, []);

  return {
    handleBarcodeSubmit,
    handleAddToCart,
    handleCustomerFormSubmit,
    confirmParkSale,
    handleResumeParkedSale,
    handlePointsRedeemed,
    handleConfirmSplitPayment,
  };
}
