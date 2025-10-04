import React, { useState, useEffect } from "react";
import { customersAPI } from "../services/api";
import { Customer, CreateCustomerRequest, UpdateCustomerRequest } from "../types";
import toast from "react-hot-toast";
import { CustomerSearch } from "../components/customers/CustomerSearch";
import { CustomersTable } from "../components/customers/CustomersTable";
import { CustomerModal } from "../components/customers/CustomerModal";
import { Pagination } from "../components/sales/Pagination";
import { Button, BackButton } from "../components/common";
import { LoyaltyDashboard, PointsHistoryTable, RewardsGallery } from "../components/loyalty";

interface CustomerFormData {
  name: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
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
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "loyalty">("overview");

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
    setViewingCustomer(null); // Close detail view when editing
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
        dateOfBirth: formData.dateOfBirth.trim() || undefined,
        address: formData.address.trim() || undefined,
      };

      let updatedCustomerId: number | null = null;

      if (editingCustomer) {
        await customersAPI.update(editingCustomer.id, customerData);
        toast.success("Customer updated successfully");
        updatedCustomerId = editingCustomer.id;
      } else {
        const newCustomer = await customersAPI.create(customerData as CreateCustomerRequest);
        toast.success("Customer created successfully");
        updatedCustomerId = newCustomer.id;
      }

      setShowModal(false);
      await loadCustomers();

      // If we were editing from detail view, reload and return to detail view
      if (updatedCustomerId) {
        const updated = await customersAPI.getById(updatedCustomerId);
        setViewingCustomer(updated);
      }
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

  const handleViewDetails = (customer: Customer) => {
    setViewingCustomer(customer);
    setActiveTab("overview");
  };

  const handleCloseDetails = () => {
    setViewingCustomer(null);
    setActiveTab("overview");
  };

  // If viewing customer details, show detail view
  if (viewingCustomer) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Back Button */}
          <div className="mb-6">
            <BackButton onClick={handleCloseDetails} label="Back to Customers" className="mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">{viewingCustomer.name}</h1>
            <p className="text-gray-600 mt-1">{viewingCustomer.email || viewingCustomer.phoneNumber}</p>
          </div>

          {/* Tabs */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`py-4 px-6 text-sm font-medium border-b-2 ${
                    activeTab === "overview"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("loyalty")}
                  className={`py-4 px-6 text-sm font-medium border-b-2 ${
                    activeTab === "loyalty"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  🎁 Loyalty Program
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Customer Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h3>
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-xs text-gray-500">Phone</dt>
                          <dd className="text-sm font-medium text-gray-900">{viewingCustomer.phoneNumber || "N/A"}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-gray-500">Email</dt>
                          <dd className="text-sm font-medium text-gray-900">{viewingCustomer.email || "N/A"}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-gray-500">Date of Birth</dt>
                          <dd className="text-sm font-medium text-gray-900">
                            {viewingCustomer.dateOfBirth
                              ? new Date(viewingCustomer.dateOfBirth).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : "N/A"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs text-gray-500">Address</dt>
                          <dd className="text-sm font-medium text-gray-900">{viewingCustomer.address || "N/A"}</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 mb-3">Account Information</h3>
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-xs text-gray-500">Customer ID</dt>
                          <dd className="text-sm font-medium text-gray-900">#{viewingCustomer.id}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-gray-500">Loyalty Points</dt>
                          <dd className="text-lg font-medium text-blue-600">{viewingCustomer.loyaltyPoints || 0}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-gray-500">Member Since</dt>
                          <dd className="text-sm font-medium text-gray-900">
                            {new Date(viewingCustomer.createdAt).toLocaleDateString()}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs text-gray-500">Status</dt>
                          <dd className="text-sm font-medium">
                            <span
                              className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                viewingCustomer.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {viewingCustomer.isActive ? "Active" : "Inactive"}
                            </span>
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-3">
                    <Button variant="primary" onClick={() => handleEdit(viewingCustomer)}>
                      Edit Customer
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setActiveTab("loyalty")}
                      className="border-blue-500 text-blue-600 hover:bg-blue-50"
                    >
                      View Loyalty Details
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === "loyalty" && (
                <div className="space-y-6">
                  {/* Loyalty Dashboard */}
                  <LoyaltyDashboard
                    customer={viewingCustomer}
                    onRefresh={() => {
                      loadCustomers();
                      // Refresh the viewing customer
                      const updated = customers.find((c) => c.id === viewingCustomer.id);
                      if (updated) setViewingCustomer(updated);
                    }}
                  />

                  {/* Points History */}
                  <PointsHistoryTable customerId={viewingCustomer.id} />

                  {/* Rewards Gallery */}
                  <RewardsGallery
                    customerId={viewingCustomer.id}
                    customerPoints={viewingCustomer.loyaltyPoints || 0}
                    onRewardRedeemed={() => {
                      loadCustomers();
                      const updated = customers.find((c) => c.id === viewingCustomer.id);
                      if (updated) setViewingCustomer(updated);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        <CustomerSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        {/* Customers Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <CustomersTable
            customers={customers}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDetails={handleViewDetails}
          />

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
