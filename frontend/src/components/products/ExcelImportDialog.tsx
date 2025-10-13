import React, { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { productsAPI } from "../../services";
import { Button } from "../common";

interface ExcelImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ImportResult {
  message: string;
  imported: number;
  duplicates: number;
  invalid: number;
  invalidDetails?: Array<{
    row: number;
    data: any;
    errors: string[];
  }>;
}

export const ExcelImportDialog: React.FC<ExcelImportDialogProps> = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error("Please select a valid Excel file (.xlsx or .xls)");
        return;
      }

      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      setFile(selectedFile);
      setImportResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Please select a file to import");
      return;
    }

    setIsImporting(true);
    setImportResult(null);

    try {
      const result = await productsAPI.importExcel(file);
      setImportResult(result);

      if (result.imported > 0) {
        toast.success(`Successfully imported ${result.imported} product${result.imported !== 1 ? "s" : ""}`);
        onSuccess();
      }

      if (result.duplicates > 0) {
        toast.error(`${result.duplicates} duplicate SKU${result.duplicates !== 1 ? "s" : ""} skipped`);
      }

      if (result.invalid > 0) {
        toast.error(`${result.invalid} invalid row${result.invalid !== 1 ? "s" : ""}`);
      }
    } catch (error: any) {
      console.error("Import error:", error);
      toast.error(error.response?.data?.error || "Failed to import Excel file");
    } finally {
      setIsImporting(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const blob = await productsAPI.downloadExcelTemplate();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "product_import_template.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Template downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download template");
    }
  };

  const handleReset = () => {
    setFile(null);
    setImportResult(null);
    setShowErrors(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl" onClick={handleClose}>
          ×
        </button>

        <h2 className="text-2xl font-bold mb-2 text-gray-800">Import Products from Excel</h2>
        <p className="text-sm text-gray-600 mb-6">Upload an Excel file to bulk import products into your system</p>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            How to import products:
          </h3>
          <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
            <li>Download the Excel template below</li>
            <li>Fill in your product information</li>
            <li>Save the file and upload it here</li>
            <li>Review the import results</li>
          </ol>
        </div>

        {/* Download Template */}
        <div className="mb-6">
          <Button variant="secondary" onClick={handleDownloadTemplate} className="w-full">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download Excel Template
          </Button>
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Excel File</label>
          <div className="flex items-center space-x-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {file && (
              <button onClick={handleReset} className="text-gray-500 hover:text-gray-700" title="Clear selection">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {file && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: <span className="font-semibold">{file.name}</span> ({(file.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>

        {/* Import Result */}
        {importResult && (
          <div className="mb-6 space-y-3">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Import Results</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{importResult.imported}</div>
                  <div className="text-xs text-gray-600">Imported</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{importResult.duplicates}</div>
                  <div className="text-xs text-gray-600">Duplicates</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{importResult.invalid}</div>
                  <div className="text-xs text-gray-600">Invalid</div>
                </div>
              </div>
            </div>

            {/* Error Details */}
            {importResult.invalidDetails && importResult.invalidDetails.length > 0 && (
              <div>
                <button
                  onClick={() => setShowErrors(!showErrors)}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <svg
                    className={`w-4 h-4 mr-1 transition-transform ${showErrors ? "transform rotate-90" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  {showErrors ? "Hide" : "Show"} error details ({importResult.invalidDetails.length} rows)
                </button>

                {showErrors && (
                  <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-4 max-h-60 overflow-y-auto">
                    {importResult.invalidDetails.map((detail, index) => (
                      <div key={index} className="mb-3 pb-3 border-b border-red-100 last:border-0 last:pb-0 last:mb-0">
                        <div className="font-semibold text-red-900 text-sm">Row {detail.row}:</div>
                        <ul className="mt-1 text-xs text-red-700 list-disc list-inside">
                          {detail.errors.map((error, i) => (
                            <li key={i}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={handleClose}>
            {importResult ? "Close" : "Cancel"}
          </Button>
          {!importResult && (
            <Button variant="primary" onClick={handleImport} disabled={!file || isImporting}>
              {isImporting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Importing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  Import Products
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
