import React, { useState, useEffect } from "react";
import { Customer } from "../../types";
import { Button, Input, TextArea, Modal } from "../common";

interface CustomerFormData {
  name: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  address: string;
}

interface CustomerModalProps {
  isOpen: boolean;
  editingCustomer: Customer | null;
  onClose: () => void;
  onSubmit: (data: CustomerFormData) => Promise<void>;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({ isOpen, editingCustomer, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<CustomerFormData>({
    name: "",
    phoneNumber: "",
    email: "",
    dateOfBirth: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingCustomer) {
      // Convert ISO date to YYYY-MM-DD format for date input
      let dateOfBirth = "";
      if (editingCustomer.dateOfBirth) {
        const date = new Date(editingCustomer.dateOfBirth);
        dateOfBirth = date.toISOString().split("T")[0]; // Extract YYYY-MM-DD
      }

      setFormData({
        name: editingCustomer.name,
        phoneNumber: editingCustomer.phoneNumber || "",
        email: editingCustomer.email || "",
        dateOfBirth: dateOfBirth,
        address: editingCustomer.address || "",
      });
    } else {
      setFormData({
        name: "",
        phoneNumber: "",
        email: "",
        dateOfBirth: "",
        address: "",
      });
    }
  }, [editingCustomer, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingCustomer ? "Edit Customer" : "Add New Customer"} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Customer Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          fullWidth
        />

        <Input
          label="Phone Number"
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          fullWidth
        />

        <Input label="Email" type="email" name="email" value={formData.email} onChange={handleInputChange} fullWidth />

        <Input
          label="Date of Birth"
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleInputChange}
          fullWidth
        />

        <TextArea
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          rows={3}
          fullWidth
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : editingCustomer ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
