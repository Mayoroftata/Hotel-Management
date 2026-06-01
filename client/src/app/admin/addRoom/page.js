"use client";
import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { toast } from "react-toastify";
import Image from "next/image";
import { Cloudinary } from "@cloudinary/url-gen";

const CREATE_ROOM = gql`
  mutation CreateRoom($input: RoomInput!) {
    createRoom(input: $input) {
      id
      name
      category
      price
      number
      description
      images
      amenities
      isAvailable
    }
  }
`;

const AddRoom = () => {
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    category: "Standard",
    price: "",
    description: "",
    images: [],
    amenities: [],
    isAvailable: true,
  });

  const [imageUrls, setImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [currentImageInput, setCurrentImageInput] = useState("");

  const [createRoom, { loading }] = useMutation(CREATE_ROOM, {
    onCompleted: () => {
      toast.success("Room added successfully");
      setFormData({
        name: "",
        number: "",
        category: "Standard",
        price: "",
        description: "",
        images: [],
        amenities: [],
        isAvailable: true,
      });
      setImageUrls([]);
      setCurrentImageInput("");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "hotel-rooms");

    try {
      const response = await fetch(cloudinaryUrl, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
      return null;
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const uploadedUrls = [];

    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        continue;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        continue;
      }

      const url = await uploadImageToCloudinary(file);
      if (url) {
        uploadedUrls.push(url);
        setImageUrls(prev => [...prev, url]);
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, url]
        }));
      }
    }

    setUploading(false);
    if (uploadedUrls.length > 0) {
      toast.success(`${uploadedUrls.length} image(s) uploaded successfully`);
    }
  };

  const removeImage = (indexToRemove) => {
    setImageUrls(prev => prev.filter((_, index) => index !== indexToRemove));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const addAmenity = () => {
    if (currentImageInput.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, currentImageInput.trim()]
      }));
      setCurrentImageInput("");
    }
  };

  const removeAmenity = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.images.length === 0) {
      toast.error("Please upload at least one room image");
      return;
    }

    if (formData.amenities.length === 0) {
      toast.error("Please add at least one amenity");
      return;
    }

    createRoom({
      variables: {
        input: {
          name: formData.name,
          number: formData.number,
          category: formData.category,
          price: parseFloat(formData.price),
          description: formData.description,
          images: formData.images,
          amenities: formData.amenities,
          isAvailable: formData.isAvailable,
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Add New Room</h1>
          <p className="text-slate-600 mt-2">Create a new room for your hotel inventory</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Room Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Ocean View Suite"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Room Number *
                </label>
                <input
                  type="text"
                  placeholder="e.g., 101, A-202"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                >
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suites">Suites</option>
                  <option value="Presidential">Presidential</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Price per Night ($) *
                </label>
                <input
                  type="number"
                  placeholder="e.g., 199"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description *
              </label>
              <textarea
                placeholder="Describe the room, its features, and what makes it special..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="4"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                required
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Room Availability
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={formData.isAvailable === true}
                    onChange={() => setFormData({ ...formData, isAvailable: true })}
                    className="w-4 h-4 text-blue-900"
                  />
                  <span>Available</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={formData.isAvailable === false}
                    onChange={() => setFormData({ ...formData, isAvailable: false })}
                    className="w-4 h-4 text-blue-900"
                  />
                  <span>Not Available</span>
                </label>
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Room Images</h2>
            <p className="text-sm text-slate-600 mb-4">Upload up to 10 images (JPEG, PNG, WebP, max 5MB each)</p>
            
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-900 transition">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer inline-flex flex-col items-center"
              >
                <svg className="w-12 h-12 text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-blue-900 font-medium">Click to upload images</span>
                <span className="text-sm text-slate-500 mt-1">or drag and drop</span>
              </label>
            </div>

            {uploading && (
              <div className="mt-4 text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-900"></div>
                <p className="text-sm text-slate-600 mt-2">Uploading images...</p>
              </div>
            )}

            {imageUrls.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium text-slate-900 mb-3">Uploaded Images ({imageUrls.length})</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="relative h-32 rounded-lg overflow-hidden">
                        <Image
                          src={url}
                          alt={`Room image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Amenities Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Amenities</h2>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="e.g., WiFi, TV, Air Conditioning"
                value={currentImageInput}
                onChange={(e) => setCurrentImageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addAmenity()}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addAmenity}
                className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition"
              >
                Add
              </button>
            </div>

            {formData.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-sm"
                  >
                    {amenity}
                    <button
                      type="button"
                      onClick={() => removeAmenity(index)}
                      className="hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating Room...
                </span>
              ) : (
                "Create Room"
              )}
            </button>
            
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoom;