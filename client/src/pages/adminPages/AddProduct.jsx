import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PackagePlus, UploadCloud, ArrowLeft, X, Plus } from "lucide-react";
import { batmanToast } from "@/utils/toast";
import api from "@/lib/api";
import { useStandardMutation } from "../../lib/useStandardMutation";
import { post } from "../../lib/http";
import imageCompression from "browser-image-compression";
import { QUERY_KEYS } from "../../constants/queryKeys";

const AddProduct = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const defaultFormData = {
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "Tactical Equipment",
    stock: "",
    inStock: true,
    tags: [],
    rating: { rate: 0, count: 0 },
  };
  const [formData, setFormData] = useState(defaultFormData);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const addProducts = (data) => post("/products/create", data);

  const { mutate, isPending } = useStandardMutation(addProducts, {
    successMsg: "Product added successfully!",
    errorMsg: "Failed to add product.",
    onSuccess: () => {
      // Invalidate and refetch products query
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.all });

      // Reset form data and images
      setFormData(defaultFormData);
      setImages([]);
      setImagePreviews([]);
      // Optionally navigate back
    },
  });

  // Helper functions for image compression
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return await convertToBase64(compressedFile);
    } catch (error) {
      console.error("Error compressing image:", error);
      throw error;
    }
  };

  // Update the handleChange function
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("rating.")) {
      const ratingField = name.split(".")[1];
      let newValue = value;

      if (ratingField === "rate") {
        // For rate rating
        if (value === "") {
          newValue = 0;
        } else {
          const numValue = parseFloat(value);
          newValue = !isNaN(numValue) ? Math.min(numValue, 5) : 0;
        }
      } else {
        // For rating count
        newValue = value === "" ? 0 : parseInt(value) || 0;
      }

      setFormData((prev) => ({
        ...prev,
        rating: {
          ...prev.rating,
          [ratingField]: newValue,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Update the handleImageChange function
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      try {
        // Show loading state while processing images
        setIsProcessing(true);

        const processedImages = await Promise.all(
          files.map(async (file) => {
            const base64String = await compressImage(file);
            return {
              original: file,
              preview: URL.createObjectURL(file),
              base64: base64String,
            };
          })
        );

        setImages((prev) => [...prev, ...processedImages]);
        setImagePreviews((prev) => [
          ...prev,
          ...processedImages.map((img) => img.preview),
        ]);
      } catch (error) {
        batmanToast.error("Error processing images");
        console.error("Error processing images:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Update the handleSubmit function
  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price) || 0,
        originalPrice: parseFloat(formData.originalPrice) || null,
        category: formData.category,
        description: formData.description,
        rating: {
          rate: parseFloat(formData.rating.rate) || 0,
          count: parseInt(formData.rating.count) || 0,
        },
        stock: parseInt(formData.stock) || 0,
        inStock: parseInt(formData.stock) > 0,
        // Update images to include base64 strings
        images: images.map((img, index) => ({
          url: img.base64,
          alt: `${formData.name}-${index + 1}`,
        })),
        tags: formData.tags,
      };

      // Validate required fields before submission
      if (!productData.name || !productData.price || !productData.description) {
        throw new Error("Please fill in all required fields");
      }

      if (images.length === 0) {
        throw new Error("Please add at least one product image");
      }

      // Send the data
      mutate(productData);
    } catch (error) {
      batmanToast.error(error.message);
      console.error("Form validation failed:", error);
    }
  };

  const handleTagClick = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const categories = [
    "Tactical Equipment",
    "WayneTech",
    "Gadgets",
    "Armor",
    "Vehicles",
    "Utility Belt",
  ];

  const predefinedTags = [
    "Tactical",
    "WayneTech",
    "Professional",
    "Military-Grade",
    "Prototype",
    "Advanced",
    "Stealth",
    "Combat",
    "Defense",
    "Surveillance",
  ];

  return (
    <div className="min-h-screen bg-gray-900/50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Container with max-width and center alignment */}
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <PackagePlus className="text-yellow-400 h-8 w-8" />
            Add New Product
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800/50 backdrop-blur-sm rounded-lg hover:bg-gray-700/50 transition-colors w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </button>
        </div>

        {/* Main Form Card */}
        <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-700/50 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name and Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300"
                >
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition placeholder-gray-500"
                  placeholder="e.g. Advanced Tactical Grappling Hook"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-300"
                >
                  Category
                </label>
                <select
                  name="category"
                  id="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description with character count */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-300"
                >
                  Description
                </label>
                <span className="text-xs text-gray-500">
                  {formData.description.length}/500 characters
                </span>
              </div>
              <textarea
                name="description"
                id="description"
                rows="4"
                maxLength={500}
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition placeholder-gray-500"
                placeholder="Military-grade specifications and key features..."
              />
            </div>

            {/* Price Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* Price Input with Currency Symbol */}
              <div className="space-y-2">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-300"
                >
                  Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="w-full pl-8 bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
                    placeholder="1285.75"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="originalPrice"
                  className="block text-sm font-medium text-gray-300"
                >
                  Original Price (Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    name="originalPrice"
                    id="originalPrice"
                    step="0.01"
                    min="0"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    className="w-full pl-8 bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
                    placeholder="1900.11"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium text-gray-300"
                >
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stock"
                  id="stock"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
                  placeholder="Enter quantity in stock"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-300"
              >
                Tags (comma-separated)
              </label>
              <div className="flex flex-wrap gap-2">
                {predefinedTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2
                    ${
                      formData.tags.includes(tag)
                        ? "bg-yellow-400 text-black shadow-md"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {formData.tags.includes(tag) && <X className="h-4 w-4" />}
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Upload with Preview */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-300">
                Product Images
              </label>
              <div className="mt-2 flex justify-center rounded-lg border-2 border-dashed border-gray-700 px-6 py-10 hover:border-yellow-400/50 transition-colors">
                <div className="text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-500" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-400">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-semibold text-yellow-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-yellow-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-yellow-300"
                    >
                      <span>Upload files</span>
                      <input
                        id="file-upload"
                        name="images"
                        type="file"
                        className="sr-only"
                        multiple
                        onChange={handleImageChange}
                        accept="image/*"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>

              {/* Image Preview Grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img
                        src={image.preview}
                        alt={`Preview ${index}`}
                        className="h-full w-full object-cover rounded-lg border border-gray-700"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Loading indicator for image processing */}
              {isProcessing && (
                <div className="flex items-center justify-center p-4 bg-gray-900/50 rounded-lg">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-yellow-400 border-t-transparent"></div>
                  <span className="ml-3 text-yellow-400">
                    Processing images...
                  </span>
                </div>
              )}
            </div>

            {/* Rating Section */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-300">
                Initial Rating (Optional)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="rating.rate"
                    className="block text-sm font-medium text-gray-400"
                  >
                    Average Rating (0-5)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="rating.rate"
                      id="rating.rate"
                      value={formData.rating.rate}
                      onChange={handleChange}
                      onKeyPress={(e) => {
                        // Allow only numbers and one decimal point
                        if (!/[\d.]/.test(e.key)) {
                          e.preventDefault();
                        }
                        if (e.key === "." && e.target.value.includes(".")) {
                          e.preventDefault();
                        }
                      }}
                      className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
                      placeholder="4.3"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                  {parseFloat(formData.rating.rate) > 5 && (
                    <p className="text-xs text-red-400 mt-1">
                      Rating cannot be higher than 5
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="rating.count"
                    className="block text-sm font-medium text-gray-400"
                  >
                    Number of Reviews
                  </label>
                  <input
                    type="text"
                    name="rating.count"
                    id="rating.count"
                    value={formData.rating.count}
                    onChange={handleChange}
                    onKeyPress={(e) => {
                      // Allow only numbers
                      if (!/\d/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
                    placeholder="297"
                  />
                </div>
              </div>

              {/* Rating Preview */}
              {(formData.rating.rate > 0 || formData.rating.count > 0) && (
                <div className="flex items-center gap-2 p-3 bg-gray-900/30 rounded-lg border border-gray-800">
                  <div className="flex items-center gap-1 text-yellow-400">
                    {[...Array(5)].map((_, index) => (
                      <svg
                        key={index}
                        className={`h-4 w-4 ${
                          index < Math.floor(formData.rating.rate || 0)
                            ? "text-yellow-400"
                            : index < (formData.rating.rate || 0)
                            ? "text-yellow-400/50"
                            : "text-gray-600"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-yellow-400 font-medium">
                    {(formData.rating.rate || 0).toFixed(1)}
                  </span>
                  <span className="text-gray-400 text-sm">
                    ({formData.rating.count || 0} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Submit Button with better mobile styling */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isPending}
                className="w-full sm:w-auto px-8 py-4 text-base font-bold text-black bg-yellow-400 rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    <span>PROCESSING...</span>
                  </>
                ) : (
                  <>
                    <PackagePlus className="h-6 w-6" />
                    Add Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
