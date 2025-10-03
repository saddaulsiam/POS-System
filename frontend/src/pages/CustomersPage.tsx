import React, { useState, useEffect } from "react";
import { customersAPI } from "../services/api";
import { Customer, CreateCustomerRequest, UpdateCustomerRequest } from "../types";
import toast from "react-hot-toast";
import { CustomerSearch } from "../components/customers/CustomerSearch";
import { CustomersTable } from "../components/customers/CustomersTable";
import { CustomerModal } from "../components/customers/CustomerModal";
import { Pagination } from "../components/sales/Pagination";
import { Button } from "../components/common";

interface CustomerFormData {
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
}

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadCustomers();
    // eslint-disable-next-line
  }, [currentPage, searchTerm]);

  const loadCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await customersAPI.getAll({
        page: currentPage,
        limit: 20,
        search: searchTerm || undefined,
      });
      setCustomers(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error: any) {
      if (error.response) {
        console.error("API error:", error.response.status, error.response.data);
        toast.error(error.response.data?.error || "Failed to load customers");
      } else {
        console.error("Error loading customers:", error);
        toast.error("Failed to load customers");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCustomer(null);
    setShowModal(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowModal(true);
  };

  const handleSubmit = async (formData: CustomerFormData) => {
    if (!formData.name.trim()) {
      toast.error("Customer name is required");
      return;
    }

    try {
      const customerData: CreateCustomerRequest | UpdateCustomerRequest = {
        name: formData.name.trim(),
        phoneNumber: formData.phoneNumber.trim() || undefined,
        email: formData.email.trim() || undefined,
        address: formData.address.trim() || undefined,
      };

      if (editingCustomer) {
        await customersAPI.update(editingCustomer.id, customerData);
        toast.success("Customer updated successfully");
      } else {
        await customersAPI.create(customerData as CreateCustomerRequest);
        toast.success("Customer created successfully");
      }

      setShowModal(false);
      loadCustomers();
    } catch (error: any) {
      console.error("Error saving customer:", error);
      toast.error(error.response?.data?.error || "Failed to save customer");
      throw error; // Re-throw to keep modal open
    }
  };

  const handleDelete = async (customer: Customer) => {
    if (!confirm(`Are you sure you want to delete "${customer.name}"?`)) {
      return;
    }

    try {
      await customersAPI.delete(customer.id);
      toast.success("Customer deleted successfully");
      loadCustomers();
    } catch (error: any) {
      console.error("Error deleting customer:", error);
      toast.error(error.response?.data?.error || "Failed to delete customer");
    }
  };

  const handleSearchClear = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
          <Button variant="primary" onClick={handleAdd}>
            Add Customer
          </Button>
        </div>

        {/* Search */}
        <CustomerSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} onClear={handleSearchClear} />

        {/* Customers Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <CustomersTable customers={customers} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} />

          {/* Pagination */}
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>

      {/* Customer Modal */}
      <CustomerModal
        isOpen={showModal}
        editingCustomer={editingCustomer}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CustomersPage;
