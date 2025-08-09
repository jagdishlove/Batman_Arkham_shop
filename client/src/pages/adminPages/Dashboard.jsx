import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Users,
  ShoppingCart,
  PlusCircle,
  UserCheck,
} from "lucide-react";
import { get } from "../../lib/http";
import { useStandardQuery } from "../../lib/useStandardQuery";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { ProductsSection } from "./ProductSection";
import { useQueryClient } from "@tanstack/react-query";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("products");
  const queryClient = useQueryClient();

  // Products Query
  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useStandardQuery(QUERY_KEYS.PRODUCTS.all, () => get("/products"), {
    errorMsg: "Failed to fetch products",
  });

  // Users Stats Query
  const {
    data: usersStats,
    isLoading: usersLoading,
    error: usersError,
  } = useStandardQuery(QUERY_KEYS.USERS.all, () => get("/auth/users/stats"), {
    errorMsg: "Failed to fetch user statistics",
  });

  // Combined loading and error states
  const isLoading = productsLoading || usersLoading;
  const hasError = productsError || usersError;

  const renderStatValue = (type) => {
    if (isLoading) {
      return <div className="h-6 w-16 bg-gray-700 animate-pulse rounded"></div>;
    }
    if (hasError) return "Error";

    switch (type) {
      case "products":
        return products?.products?.length || 0;
      case "totalUsers":
        return usersStats?.total || 0;
      case "activeUsers":
        return usersStats?.active || 0;
      default:
        return 0;
    }
  };

  const stats = [
    {
      label: "Total Products",
      value: renderStatValue("products"),
      icon: Package,
      color: "text-yellow-400",
    },
    {
      label: "Total Users",
      value: renderStatValue("totalUsers"),
      icon: Users,
      color: "text-blue-400",
    },
    {
      label: "Active Users",
      value: renderStatValue("activeUsers"),
      icon: UserCheck,
      color: "text-green-400",
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "products":
        return (
          <ProductsSection
            products={products}
            isLoading={productsLoading}
            error={productsError}
          />
        );
      case "users":
        return (
          <div className="text-white">
            {usersLoading ? (
              "Loading users..."
            ) : usersError ? (
              "Error loading users"
            ) : (
              <div>
                <h3 className="text-xl font-bold mb-4">User Statistics</h3>
                <div className="space-y-2">
                  <p>Total Users: {usersStats?.total || 0}</p>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Admin Header */}
      <div className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-white">
              Batman's Armory - Admin
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-yellow-500/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {stat.value}
                  </p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("products")}
                  className={`flex w-full items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
                    ${
                      activeTab === "products"
                        ? "text-yellow-400 bg-gray-800/50"
                        : "text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50"
                    }`}
                >
                  <Package className="h-5 w-5" />
                  <span>Products</span>
                </button>

                <button
                  onClick={() => setActiveTab("orders")}
                  className={`flex w-full items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
                    ${
                      activeTab === "orders"
                        ? "text-yellow-400 bg-gray-800/50"
                        : "text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50"
                    }`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Orders</span>
                </button>

                <button
                  onClick={() => setActiveTab("users")}
                  className={`flex w-full items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
                    ${
                      activeTab === "users"
                        ? "text-yellow-400 bg-gray-800/50"
                        : "text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50"
                    }`}
                >
                  <Users className="h-5 w-5" />
                  <span>Users</span>
                </button>
              </nav>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4">
              <Link
                to="/admin/products/add"
                className="flex items-center justify-center gap-2 bg-black/20 hover:bg-black/30 text-black font-medium px-4 py-3 rounded-lg transition-all duration-300"
              >
                <PlusCircle className="h-5 w-5" />
                Add New Product
              </Link>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
