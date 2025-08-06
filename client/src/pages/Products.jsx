// ProductsPage.jsx
import { useState, useMemo } from "react";
import {
  Search,
  Shield,
  Star,
  Eye,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const productsData = [
  {
    _id: 1,
    name: "Batman Tactical Cowl",
    price: 599,
    category: "armor",
    rating: 5,
    image: "/images/cowl.jpg",
  },
  {
    _id: 2,
    name: "Utility Belt Pro",
    price: 299,
    category: "gear",
    rating: 5,
    image: "/images/belt.jpg",
  },
  {
    _id: 3,
    name: "Grappling Hook",
    price: 899,
    category: "gadgets",
    rating: 4,
    image: "/images/hook.jpg",
  },
  {
    _id: 4,
    name: "Batmobile Remote",
    price: 199,
    category: "vehicles",
    rating: 4,
    image: "/images/remote.jpg",
  },
  {
    _id: 5,
    name: "Night Vision Goggles",
    price: 449,
    category: "gear",
    rating: 5,
    image: "/images/goggles.jpg",
  },
  {
    _id: 6,
    name: "Smoke Pellets",
    price: 89,
    category: "gadgets",
    rating: 4,
    image: "/images/pellets.jpg",
  },
  {
    _id: 7,
    name: "Kevlar Cape",
    price: 799,
    category: "armor",
    rating: 5,
    image: "/images/cape.jpg",
  },
  {
    _id: 8,
    name: "Batarang Set",
    price: 149,
    category: "weapons",
    rating: 4,
    image: "/images/batarang.jpg",
  },
  {
    _id: 9,
    name: "Wayne Tech Tablet",
    price: 1299,
    category: "tech",
    rating: 5,
    image: "/images/tablet.jpg",
  },
];

const categories = [
  { value: "all", label: "All", icon: "🪷" },
  { value: "armor", label: "Armor", icon: "🛡️" },
  { value: "gadgets", label: "Gadgets", icon: "⚡" },
  { value: "weapons", label: "Weapons", icon: "⚔️" },
  { value: "vehicles", label: "Vehicles", icon: "🚗" },
  { value: "tech", label: "Tech", icon: "💻" },
];

const sortOptions = [
  { value: "default", label: "Default" },
  { value: "price_low", label: "Price Low to High" },
  { value: "price_high", label: "Price High to Low" },
  { value: "rating", label: "Rating High to Low" },
];

const useFilteredProducts = (products, filters) =>
  useMemo(() => {
    let result = [...products];

    if (filters.search)
      result = result.filter((p) =>
        p.name.toLowerCase().includes(filters.search.toLowerCase())
      );

    if (filters.category !== "all")
      result = result.filter((p) => p.category === filters.category);

    if (filters.minPrice)
      result = result.filter((p) => p.price >= parseFloat(filters.minPrice));
    if (filters.maxPrice)
      result = result.filter((p) => p.price <= parseFloat(filters.maxPrice));

    switch (filters.sort) {
      case "price_low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [products, filters]);

export default function Products() {
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    sort: "default",
    minPrice: "",
    maxPrice: "",
  });
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredProducts = useFilteredProducts(productsData, filters);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            <span className="text-yellow-400">BATMAN'S</span>{" "}
            <span className="text-purple-400">ARSENAL</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            <Shield className="inline-block w-4 h-4 mr-1" />
            {filteredProducts.length} items found
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search..."
            value={filters.search}
            onChange={(e) =>
              setFilters((f) => ({ ...f, search: e.target.value }))
            }
            className="bg-gray-800 text-white px-4 py-2 rounded-md"
          />
          <select
            value={filters.sort}
            onChange={(e) =>
              setFilters((f) => ({ ...f, sort: e.target.value }))
            }
            className="bg-gray-800 text-white px-4 py-2 rounded-md"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters((f) => ({ ...f, category: e.target.value }))
            }
            className="bg-gray-800 text-white px-4 py-2 rounded-md"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {paginatedProducts.map((product) => (
          <div
            key={product._id}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 group hover:scale-105 transition-transform cursor-pointer"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <div className="text-lg font-bold mb-2 group-hover:text-yellow-400 transition">
              {product.name}
            </div>
            <div className="text-sm text-gray-500 mb-2">
              {product.category.toUpperCase()}
            </div>
            <div className="text-2xl font-black text-yellow-400">
              ${product.price}
            </div>
            <div className="flex gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < product.rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-700"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/products/${product._id}`);
              }}
              className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-2 bg-purple-600 text-white rounded-md font-bold hover:bg-purple-700 transition"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center mt-20 text-gray-500">
          <Eye className="mx-auto w-10 h-10 mb-4" />
          No matching products found.
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-10 gap-4 items-center">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="bg-gray-800 px-4 py-2 rounded text-white disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded text-sm font-mono ${
                currentPage === i + 1
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-700 text-white hover:bg-yellow-500 hover:text-black"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="bg-gray-800 px-4 py-2 rounded text-white disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
