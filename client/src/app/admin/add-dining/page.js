"use client";

import Link from "next/link";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { toast } from "react-toastify";

const CREATE_DINING = gql`
  mutation CreateDining($input: DiningInput!) {
    createDining(input: $input) {
      id
      name
      cuisine
      priceRange
      openingHours
      isAvailable
    }
  }
`;

const initialForm = {
  name: "",
  description: "",
  cuisine: "",
  priceRange: "$$",
  openingHours: "",
  isAvailable: true,
};

export default function AddDiningPage() {
  const [formData, setFormData] = useState(initialForm);

  const [createDining, { loading }] = useMutation(CREATE_DINING, {
    onCompleted: () => {
      toast.success("Dining option added successfully");
      setFormData(initialForm);
    },
    onError: (error) => toast.error(error.message),
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    createDining({ variables: { input: formData } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Add Dining Option</h1>
            <p className="mt-2 text-slate-600">Create a restaurant, bar, lounge, or dining experience.</p>
          </div>
          <Link href="/admin" className="rounded-lg border border-slate-300 px-5 py-3 text-slate-700 hover:bg-white">
            Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Dining Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Name *</span>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-900"
                  placeholder="Skyline Restaurant"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Cuisine</span>
                <input
                  value={formData.cuisine}
                  onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-900"
                  placeholder="Continental"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Price Range</span>
                <select
                  value={formData.priceRange}
                  onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-900"
                >
                  <option value="$">$</option>
                  <option value="$$">$$</option>
                  <option value="$$$">$$$</option>
                  <option value="$$$$">$$$$</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Opening Hours</span>
                <input
                  value={formData.openingHours}
                  onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-900"
                  placeholder="7:00 AM - 10:00 PM"
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
                placeholder="Describe the menu, atmosphere, and dining experience."
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
              {loading ? "Creating..." : "Create Dining Option"}
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
