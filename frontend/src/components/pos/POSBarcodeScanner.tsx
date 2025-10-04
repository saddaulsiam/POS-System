import React, { useState, useEffect, useRef } from "react";
import { Button } from "../common";
import { Product } from "../../types";
import { productsAPI } from "../../services/api";

interface POSBarcodeScannerProps {
  barcode: string;
  onBarcodeChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onProductSelect?: (product: Product) => void;
}

export const POSBarcodeScanner: React.FC<POSBarcodeScannerProps> = ({
  barcode,
  onBarcodeChange,
  onSubmit,
  onProductSelect,
}) => {
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions when user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (barcode.trim().length >= 2) {
        try {
          const response = await productsAPI.getAll({
            search: barcode,
            isActive: true,
            limit: 5,
          });
          setSuggestions(response.data || []);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
      setSelectedIndex(-1);
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [barcode]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          e.preventDefault();
          handleSelectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        break;
    }
  };

  const handleSelectSuggestion = (product: Product) => {
    if (onProductSelect) {
      onProductSelect(product);
      onBarcodeChange("");
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
      inputRef.current?.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onBarcodeChange(e.target.value);
  };

  return (
    <div className="p-4 bg-white border-b border-gray-200">
      <form onSubmit={onSubmit} className="flex space-x-2">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={barcode}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Scan barcode or search product..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoComplete="off"
          />

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto"
            >
              {suggestions.map((product, index) => (
                <div
                  key={product.id}
                  onClick={() => handleSelectSuggestion(product)}
                  className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-blue-50 transition-colors ${
                    index === selectedIndex ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-xs text-gray-500">SKU: {product.sku}</span>
                        {product.barcode && <span className="text-xs text-gray-500">Barcode: {product.barcode}</span>}
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            product.stockQuantity > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          Stock: {product.stockQuantity}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-lg font-bold text-green-600">${product.sellingPrice.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Button type="submit" variant="primary">
          Add
        </Button>
      </form>
    </div>
  );
};
