"use client";

import Link from "next/link";
import Image from "next/image";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { toast } from "react-toastify";

const CREATE_MEETING_EVENT = gql`
  mutation CreateMeetingEvent($input: MeetingEventInput!) {
    createMeetingEvent(input: $input) {
      id
      title
      type
      capacity
      price
      images
      isAvailable
    }
  }
`;

const initialForm = {
  title: "",
  description: "",
  type: "Conferences",
  capacity: "",
  price: "",
  images: [],
  isAvailable: true,
};

export default function AddMeetingEventPage() {
  const [formData, setFormData] = useState(initialForm);
  const [uploading, setUploading] = useState(false);

  const [createMeetingEvent, { loading }] = useMutation(CREATE_MEETING_EVENT, {
    onCompleted: () => {
      toast.success("Meeting/event added successfully");
      setFormData(initialForm);
    },
    onError: (error) => toast.error(error.message),
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    createMeetingEvent({
      variables: {
        input: {
          title: formData.title,
          description: formData.description,
          type: formData.type,
          capacity: formData.capacity ? parseInt(formData.capacity, 10) : null,
          price: parseFloat(formData.price),
          images: formData.images,
          isAvailable: formData.isAvailable,
        },
      },
    });
  };

  const uploadImageToCloudinary = async (file) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim();

    if (!cloudName || !uploadPreset) {
      toast.error("Cloudinary upload is not configured");
      return null;
    }

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", uploadPreset);
    uploadData.append("folder", "hotel-events");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: uploadData,
        },
      );
      const data = await response.json();

      if (!response.ok || !data.secure_url) {
        throw new Error(data.error?.message || "Upload failed");
      }

      return data.secure_url;
    } catch (error) {
      toast.error(error.message || "Failed to upload image");
      return null;
    }
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setUploading(true);
    const uploadedUrls = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max size is 5MB`);
        continue;
      }

      const url = await uploadImageToCloudinary(file);
      if (url) uploadedUrls.push(url);
    }

    if (uploadedUrls.length) {
      setFormData((current) => ({
        ...current,
        images: [...current.images, ...uploadedUrls],
      }));
      toast.success(`${uploadedUrls.length} image(s) uploaded`);
    }

    event.target.value = "";
    setUploading(false);
  };

  const removeImage = (indexToRemove) => {
    setFormData((current) => ({
      ...current,
      images: current.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Add Meeting/Event</h1>
            <p className="mt-2 text-slate-600">Create a conference, wedding, or corporate event package.</p>
          </div>
          <Link href="/admin" className="rounded-lg border border-slate-300 px-5 py-3 text-slate-700 hover:bg-white">
            Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Event Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Title *</span>
                <input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-900"
                  placeholder="Grand Ballroom Wedding"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Type *</span>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-900"
                >
                  <option value="Conferences">Conferences</option>
                  <option value="Weddings">Weddings</option>
                  <option value="Corporate Events">Corporate Events</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Capacity</span>
                <input
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-900"
                  placeholder="120"
                />
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
                  placeholder="2500"
                  required
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
                placeholder="Describe the venue, inclusions, and guest experience."
              />
            </label>

            <label className="mt-4 flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-blue-900"
              />
              <span className="text-sm font-medium text-slate-700">Available for booking</span>
            </label>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-semibold text-slate-900">Event Images</h2>
            <p className="mb-4 text-sm text-slate-600">
              Upload conference or event images for guests to preview.
            </p>

            <div className="rounded-lg border-2 border-dashed border-slate-300 p-6 text-center hover:border-blue-900">
              <input
                id="event-image-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
              <label htmlFor="event-image-upload" className="cursor-pointer">
                <span className="font-medium text-blue-900">
                  {uploading ? "Uploading..." : "Click to upload images"}
                </span>
                <span className="mt-1 block text-sm text-slate-500">
                  JPEG, PNG, or WebP. Max 5MB each.
                </span>
              </label>
            </div>

            {formData.images.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {formData.images.map((url, index) => (
                  <div key={url} className="group relative overflow-hidden rounded-lg">
                    <div className="relative h-32">
                      <Image
                        src={url}
                        alt={`Event image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 rounded-lg bg-blue-900 px-6 py-3 font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Event"}
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
