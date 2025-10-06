import React from "react";

interface ReceiptTabProps {
  settings: any;
  saving: boolean;
  handleToggle: (field: string, value: boolean) => void;
  handleTextFieldChange: (field: string, e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ReceiptTab: React.FC<ReceiptTabProps> = ({ settings, saving, handleToggle, handleTextFieldChange }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">🧾 Receipt Settings</h2>
        <p className="text-sm text-gray-600 mt-1">Configure receipt printing options</p>
      </div>
      <div className="p-6 space-y-6">
        {/* Receipt Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Auto-Print Receipt</h4>
              <p className="text-sm text-gray-500">Automatically print after sale</p>
            </div>
            <button
              onClick={() => handleToggle("printReceiptAuto", !settings.printReceiptAuto)}
              disabled={saving}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                settings.printReceiptAuto ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                  settings.printReceiptAuto ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          {/* Auto-Email Receipt option removed */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Auto-Print Thermal Receipt</h4>
              <p className="text-sm text-gray-500">Automatically print thermal receipt after sale</p>
            </div>
            <button
              onClick={() => handleToggle("autoPrintThermal", !settings.autoPrintThermal)}
              disabled={saving}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                settings.autoPrintThermal ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                  settings.autoPrintThermal ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-yellow-800">
            <strong>Which option should I enable?</strong>
            <br />
            <ul className="list-disc list-inside mt-1 mb-1">
              <li>
                <strong>Auto-Print Receipt</strong>: Enable if you use a regular (A4/Letter) printer for full-page
                receipts.
              </li>
              <li>
                <strong>Auto-Print Thermal Receipt</strong>: Enable if you use a thermal receipt printer (80mm/58mm) for
                narrow, text-based receipts.
              </li>
              <li>
                <strong>Both</strong>: Enable both only if you want both receipts to print automatically after each
                sale.
              </li>
            </ul>
            Most users only need to enable the one that matches their printer.
          </p>
        </div>
        {/* Receipt Footer */}
        <div>
          <label htmlFor="receiptFooter" className="block text-sm font-medium text-gray-700 mb-2">
            Receipt Footer Text
          </label>
          <textarea
            id="receiptFooter"
            rows={3}
            defaultValue={settings.receiptFooterText || ""}
            onBlur={(e) => handleTextFieldChange("receiptFooterText", e)}
            disabled={saving}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            placeholder="Thank you for shopping with us!"
          />
          <p className="text-sm text-gray-500 mt-1">Displayed at the bottom of printed receipts</p>
        </div>
        {/* Return Policy */}
        <div>
          <label htmlFor="returnPolicy" className="block text-sm font-medium text-gray-700 mb-2">
            Return Policy Text (Optional)
          </label>
          <textarea
            id="returnPolicy"
            rows={3}
            defaultValue={settings.returnPolicy || ""}
            onBlur={(e) => handleTextFieldChange("returnPolicy", e)}
            disabled={saving}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            placeholder="Returns accepted within 30 days with receipt"
          />
          <p className="text-sm text-gray-500 mt-1">Return policy displayed on receipts</p>
        </div>
      </div>
    </div>
  );
};

export default ReceiptTab;
