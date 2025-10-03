import React, { useState, useEffect } from "react";
import { salesAPI, customersAPI, employeesAPI } from "../services/api";
import { Sale, Customer, Employee } from "../types";
import toast from "react-hot-toast";
import { SalesFilters } from "../components/sales/SalesFilters";
import { SalesTable } from "../components/sales/SalesTable";
import { SaleDetailsModal } from "../components/sales/SaleDetailsModal";
import { Pagination } from "../components/sales/Pagination";
import { getCustomerName, getEmployeeName } from "../utils/salesUtils";

const SalesPage: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Filters
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<number | "">("");
  const [selectedEmployee, setSelectedEmployee] = useState<number | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadSales();
  }, [currentPage, dateFrom, dateTo, selectedCustomer, selectedEmployee]);

  useEffect(() => {
    loadCustomers();
    loadEmployees();
  }, []);

  const loadSales = async () => {
    setIsLoading(true);
    try {
      const response = await salesAPI.getAll({
        page: currentPage,
        limit: 20,
        startDate: dateFrom || undefined,
        endDate: dateTo || undefined,
        customerId: selectedCustomer || undefined,
        employeeId: selectedEmployee || undefined,
      });
      const { data = [], pagination } = response || {};
      setSales(data);
      setTotalPages(pagination?.totalPages || 1);
    } catch (error: any) {
      console.error("Error loading sales:", error);
      toast.error(error?.response?.data?.error || "Failed to load sales");
      setSales([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCustomers = async () => {
    try {
      const response = await customersAPI.getAll({ limit: 100 });
      setCustomers(response.data || []);
    } catch (error) {
      console.error("Error loading customers:", error);
    }
  };

  const loadEmployees = async () => {
    try {
      const data = await employeesAPI.getAll();
      setEmployees(data || []);
    } catch (error) {
      console.error("Error loading employees:", error);
    }
  };

  const handleViewDetails = async (sale: Sale) => {
    try {
      const detailedSale = await salesAPI.getById(sale.id);
      setSelectedSale(detailedSale);
      setShowDetails(true);
    } catch (error) {
      console.error("Error loading sale details:", error);
      toast.error("Failed to load sale details");
    }
  };

  const handleRefund = async (sale: Sale) => {
    if (!confirm(`Are you sure you want to process a refund for sale #${sale.receiptId}?`)) {
      return;
    }

    try {
      const refundData = {
        items: (sale.saleItems ?? []).map((item) => ({
          saleItemId: item.id,
          quantity: item.quantity,
        })),
        reason: "Customer return",
      };
      await salesAPI.processRefund(sale.id, refundData);
      toast.success("Refund processed successfully");
      loadSales();
    } catch (error: any) {
      console.error("Error processing refund:", error);
      toast.error(error?.response?.data?.error || "Failed to process refund");
    }
  };

  const clearFilters = () => {
    setDateFrom("");
    setDateTo("");
    setSelectedCustomer("");
    setSelectedEmployee("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Sales History</h1>

        {/* Filters */}
        <SalesFilters
          dateFrom={dateFrom}
          dateTo={dateTo}
          selectedCustomer={selectedCustomer}
          selectedEmployee={selectedEmployee}
          customers={customers}
          employees={employees}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
          onCustomerChange={setSelectedCustomer}
          onEmployeeChange={setSelectedEmployee}
          onClearFilters={clearFilters}
        />

        {/* Sales Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <SalesTable
            sales={sales}
            isLoading={isLoading}
            onViewDetails={handleViewDetails}
            onRefund={handleRefund}
            getCustomerName={(customerId) => getCustomerName(customerId, customers)}
            getEmployeeName={(employeeId) => getEmployeeName(employeeId, employees)}
          />

          {/* Pagination */}
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>

      {/* Sale Details Modal */}
      <SaleDetailsModal
        sale={selectedSale}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        getCustomerName={(customerId) => getCustomerName(customerId, customers)}
        getEmployeeName={(employeeId) => getEmployeeName(employeeId, employees)}
      />
    </div>
  );
};

export default SalesPage;
