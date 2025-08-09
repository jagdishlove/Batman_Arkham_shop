// ProductsPage.jsx
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Shield, Search, XCircle } from "lucide-react";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useStandardQuery } from "../lib/useStandardQuery";
import { get } from "../lib/http";
import ProductCard from "../components/UI/ProductCard";

const ITEMS_PER_PAGE = 12;

const Products = () => {
  const getProduct = () => get("/products");
  // Data fetch
  const {
    data: productsData,
    isLoading,
    error,
  } = useStandardQuery(QUERY_KEYS.PRODUCTS.all, getProduct, {
    errorMsg: "Failed to fetch products",
  });

  // Raw products array (normalized)
  const rawProducts = productsData?.products || [];

  // Filters + pagination state
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    sort: "default",
    minPrice: "",
    maxPrice: "",
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Categories derived from data
  const categories = useMemo(
    () => [
      "all",
      ...Array.from(
        new Set(rawProducts.map((p) => p.category).filter(Boolean))
      ),
    ],
    [rawProducts]
  );

  // Update filters helper
  const updateFilters = useCallback((partial) => {
    setFilters((prev) => ({ ...prev, ...partial }));
    setCurrentPage(1); // reset page on any filter change
  }, []);

  // Filtering + sorting
  const filteredProducts = useMemo(() => {
    if (!rawProducts.length) return [];

    const searchLower = filters.search.trim().toLowerCase();

    let result = rawProducts.filter((p) => {
      const nameMatch =
        !searchLower || p.name?.toLowerCase().includes(searchLower);
      const categoryMatch =
        filters.category === "all" || p.category === filters.category;
      const price = Number(p.price) || 0;
      return nameMatch && categoryMatch;
    });

    switch (filters.sort) {
      case "price_low":
        result = result.slice().sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price_high":
        result = result.slice().sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "name_asc":
        result = result
          .slice()
          .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "name_desc":
        result = result
          .slice()
          .sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        break;
      default:
        break;
    }

    return result;
  }, [rawProducts, filters]);

  // Ensure current page valid if filtered list shrinks
  useEffect(() => {
    const totalPages = Math.max(
      1,
      Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
    );
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [filteredProducts, currentPage]);

  // Paginated slice
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  );

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent" />
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-4">
        <Shield className="h-16 w-16 text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">
          Failed to Load Arsenal
        </h2>
        <p className="text-gray-400 mb-4">
          {error.message || "The Batcomputer encountered an error."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-yellow-400/10 text-yellow-400 rounded-full hover:bg-yellow-400/20 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state check
  if (!rawProducts?.length) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-4">
        <Shield className="h-16 w-16 text-yellow-400/50 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">
          Arsenal Currently Empty
        </h2>
        <p className="text-gray-400 max-w-md">
          Check back later for new equipment and gadgets
        </p>
      </div>
    );
  }

  // Main UI
  return (
    <>
      <div className="min-h-screen bg-black text-white px-4 py-10 max-w-7xl mx-auto">
        {rawProducts?.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-4 items-end">
            <div className="flex flex-col">
              <label className="text-xs uppercase tracking-wider mb-1 text-gray-400">
                Search
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                placeholder="Search products..."
                className="bg-gray-800 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div className="flex flex-col w-40">
              <label className="text-xs uppercase tracking-wider mb-1 text-gray-400">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => updateFilters({ category: e.target.value })}
                className="bg-gray-800 px-4 py-2 rounded-md"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === "all" ? "All" : c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col w-48">
              <label className="text-xs uppercase tracking-wider mb-1 text-gray-400">
                Sort
              </label>
              <select
                value={filters.sort}
                onChange={(e) => updateFilters({ sort: e.target.value })}
                className="bg-gray-800 px-4 py-2 rounded-md"
              >
                <option value="default">Default</option>
                <option value="price_low">Price: Low → High</option>
                <option value="price_high">Price: High → Low</option>
                <option value="name_asc">Name: A → Z</option>
                <option value="name_desc">Name: Z → A</option>
              </select>
            </div>

            <button
              onClick={() => {
                setFilters({
                  search: "",
                  category: "all",
                  sort: "default",
                  minPrice: "",
                  maxPrice: "",
                });
                setCurrentPage(1);
              }}
              className="h-10 px-4 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
            >
              Clear
            </button>

            <div className="ml-auto text-sm text-gray-400">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}{" "}
              of {filteredProducts.length}
            </div>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginatedProducts.map((p) => (
            <ProductCard key={p.id || p._id} product={p} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-800 rounded-md disabled:opacity-40"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              const active = page === currentPage;
              // windowing: show first, last, current +/-1, ellipses
              if (
                page !== 1 &&
                page !== totalPages &&
                Math.abs(page - currentPage) > 1
              ) {
                if (page === 2 || page === totalPages - 1) {
                  return (
                    <span key={page} className="px-2 text-gray-500">
                      ...
                    </span>
                  );
                }
                return null;
              }
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-md ${
                    active
                      ? "bg-yellow-500 text-black"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-800 rounded-md disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Products;
