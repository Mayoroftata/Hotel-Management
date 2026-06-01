"use client";

import Link from "next/link";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { toast } from "react-toastify";

const CREATE_RECREATION = gql`
  mutation CreateRecreationActivity($input: RecreationActivityInput!) {
    createRecreationActivity(input: $input) {
      id
      name
      category
      price
      duration
      maxCapacity
      isAvailable
    }
  }
`;

const initialForm = {
  name: "",
  description: "",
  category: "Recreation",
  price: "",
  duration: "",
  maxCapacity: "",
  isAvailable: true,
};

export default function AddRecreationPage() {
  const [formData, setFormData] = useState(initialForm);

  const [createRecreationActivity, { loading }] = useMutation(CREATE_RECREATION, {
    onCompleted: () => {
      toast.success("Recreation activity added successfully");
      setFormData(initialForm);
    },
    onError: (error) => toast.error(error.message),
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    createRecreationActivity({
      variables: {
        input: {
          name: formData.name,
          description: formData.description,
          category: formData.category,
          price: parseFloat(formData.price),
          duration: formData.duration,
          maxCapacity: formData.maxCapacity ? parseInt(formData.maxCapacity, 10) : null,
          isAvailable: formData.isAvailable,
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Add Recreation Activity</h1>
            <p className="mt-2 text-slate-600">Create a spa, fitness, sports, or leisure activity.</p>
          </div>
          <Link href="/admin" className="rounded-lg border border-slate-300 px-5 py-3 text-slate-700 hover:bg-white">
            Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Activity Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Name *</span>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-900"
                  placeholder="Signature Spa Session"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Category *</span>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-900"
                >
                  <option value="Recreation">Recreation</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Spa">Spa</option>
                  <option value="Sports">Sports</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Price *</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-900"
                  placeholder="75"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Duration</span>
                <input
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-900"
                  placeholder="60 minutes"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Max Capacity</span>
                <input
                  type="number"
                  min="1"
                  value={formData.maxCapacity}
                  onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-900"
                  placeholder="12"
                />
              </label>
            </div>

            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Description</span>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="5"
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-900"
                placeholder="Describe the activity, inclusions, and guest requirements."
              />
            </label>

            <label className="mt-4 flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-blue-900"
              />
              <span className="text-sm font-medium text-slate-700">Available to guests</span>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-blue-900 px-6 py-3 font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Activity"}
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="rounded-lg border border-slate-300 px-6 py-3 font-medium hover:bg-white"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
