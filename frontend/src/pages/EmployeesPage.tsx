import React from "react";

const EmployeesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Employee Management</h1>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-600">Employee management interface coming soon...</p>
          <a href="/admin" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default EmployeesPage;
