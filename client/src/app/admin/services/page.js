"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { gql, useQuery, useMutation } from "@apollo/client";
import { FaEdit, FaTrash, FaPlus, FaEye } from "react-icons/fa";

const GET_ALL_SERVICES = gql`
  query GetAllServices {
    getAllServices {
      id
      name
      description
      price
      category
      isAvailable
    }
  }
`;

const CREATE_SERVICE = gql`
  mutation CreateService($input: ServiceInput!) {
    createService(input: $input) {
      id
      name
      description
      price
      category
      isAvailable
    }
  }
`;

const UPDATE_SERVICE = gql`
  mutation UpdateService($id: ID!, $input: ServiceInput!) {
    updateService(id: $id, input: $input) {
      id
      name
      description
      price
      category
      isAvailable
    }
  }
`;

const DELETE_SERVICE = gql`
  mutation DeleteService($id: ID!) {
    deleteService(id: $id)
  }
`;

export default function AdminServices() {
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Housekeeping",
    isAvailable: true,
  });

  const { data, loading, error, refetch } = useQuery(GET_ALL_SERVICES, {
    fetchPolicy: "network-only",
  });

  const [createService] = useMutation(CREATE_SERVICE);
  const [updateService] = useMutation(UPDATE_SERVICE);
  const [deleteService] = useMutation(DELETE_SERVICE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const input = {
        ...formData,
        price: parseFloat(formData.price),
      };

      if (editingService) {
        await updateService({
          variables: { id: editingService.id, input },
        });
      } else {
        await createService({
          variables: { input },
        });
      }

      setShowForm(false);
      setEditingService(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "Housekeeping",
        isAvailable: true,
      });
      refetch();
    } catch (error) {
      console.error("Error saving service:", error);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      category: service.category,
      isAvailable: service.isAvailable,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteService({ variables: { id } });
        refetch();
      } catch (error) {
        console.error("Error deleting service:", error);
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingService(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "Housekeeping",
      isAvailable: true,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-lg font-medium text-slate-700">
          Loading services...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-xl w-full bg-white rounded-xl shadow p-8 text-center">
          <h1 className="text-2xl font-bold mb-3 text-red-700">
            Error loading services
          </h1>
          <p className="text-slate-600 mb-6">Please try again later.</p>
          <Link
            href="/admin"
            className="inline-block rounded-full bg-blue-900 px-6 py-3 text-white hover:bg-blue-800"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const services = data?.getAllServices || [];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Services Management
            </h1>
            <p className="mt-2 text-slate-600">
              Manage hotel services, guest amenities, and event offerings.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowForm(true)}
              className="rounded-full bg-blue-900 px-5 py-3 text-white hover:bg-blue-800 flex items-center gap-2"
            >
              <FaPlus /> Add Service
            </button>
            <Link
              href="/admin"
              className="rounded-full border border-slate-300 px-5 py-3 text-slate-700 hover:bg-slate-50"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Services List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">
              All Services ({services.length})
            </h2>
          </div>

          <div className="divide-y divide-slate-200">
            {services.length > 0 ? (
              services.map((service) => (
                <div key={service.id} className="p-6 hover:bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {service.name}
                      </h3>
                      <p className="text-slate-600 mt-1">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                        <span>Category: {service.category}</span>
                        <span>Price: ${service.price?.toFixed(2)}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            service.isAvailable
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {service.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(service)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit service"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        title="Delete service"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <FaEye className="mx-auto text-4xl text-slate-400 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  No services yet
                </h3>
                <p className="text-slate-600 mb-4">
                  Get started by adding your first service.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-900 px-6 py-3 text-white hover:bg-blue-800"
                >
                  <FaPlus /> Add First Service
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Service Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-900">
                  {editingService ? "Edit Service" : "Add New Service"}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Service Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Housekeeping">Housekeeping</option>
                    <option value="Concierge">Concierge</option>
                    <option value="Wellness">Wellness</option>
                    <option value="Dining">Dining</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Other">Other</option>
                    <option value="Conferences">Conferences</option>
                    <option value="Weddings">Weddings</option>
                    <option value="Corporate Events">Corporate Events</option>
                    <option value="Restaurants">Restaurants</option>
                    <option value="Recreation">Recreation</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Spa">Spa</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    checked={formData.isAvailable}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isAvailable: e.target.checked,
                      })
                    }
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="isAvailable"
                    className="ml-2 text-sm text-slate-700"
                  >
                    Service is available
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 font-medium"
                  >
                    {editingService ? "Update Service" : "Create Service"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-lg hover:bg-slate-50 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
