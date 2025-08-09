"use client";

import { useState } from "react";
import { Package, Shield, ArrowLeft, ArrowRight, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { batmanToast } from "../utils/toast";
import { formatPrice } from "../utils";

const BatmanOrders = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [currentPage, setCurrentPage] = useState(1);

  // Mock orders data
  const ordersData = {
    orders: [
      {
        id: "1",
        orderNumber: "BAT-2024-001",
        createdAt: "2024-08-01T10:30:00Z",
        orderStatus: "delivered",
        total: 1599.98,
        paymentMethod: "credit_card",
        items: [
          {
            productId: "1",
            name: "Tactical Grappling Hook",
            quantity: 1,
            image: "/api/placeholder/40/40",
          },
          {
            productId: "2",
            name: "Kevlar Body Armor",
            quantity: 1,
            image: "/api/placeholder/40/40",
          },
          {
            productId: "3",
            name: "Night Vision Goggles",
            quantity: 1,
            image: "/api/placeholder/40/40",
          },
        ],
      },
      {
        id: "2",
        orderNumber: "BAT-2024-002",
        createdAt: "2024-07-28T14:15:00Z",
        orderStatus: "shipped",
        total: 899.99,
        paymentMethod: "paypal",
        items: [
          {
            productId: "4",
            name: "Batarang Set",
            quantity: 2,
            image: "/api/placeholder/40/40",
          },
          {
            productId: "5",
            name: "Smoke Grenades",
            quantity: 5,
            image: "/api/placeholder/40/40",
          },
        ],
      },
      {
        id: "3",
        orderNumber: "BAT-2024-003",
        createdAt: "2024-07-25T09:45:00Z",
        orderStatus: "processing",
        total: 2499.99,
        paymentMethod: "credit_card",
        items: [
          {
            productId: "6",
            name: "Utility Belt",
            quantity: 1,
            image: "/api/placeholder/40/40",
          },
        ],
      },
    ],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      hasPrev: false,
      hasNext: false,
    },
  };

  const formatDate = (date) => new Date(date).toLocaleDateString();

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Shield className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-light text-white mb-2">ACCESS DENIED</h2>
          <p className="text-gray-400 mb-8">
            Authentication required to access mission history
          </p>
          <div className="space-y-4">
            <button
              onClick={() => navigate("/login")}
              className="w-full px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-medium tracking-wide hover:opacity-90 transition-all duration-300"
            >
              LOGIN TO CONTINUE
            </button>
            <Link
              to="/products"
              className="block w-full px-6 py-3 bg-gray-800 text-white font-medium tracking-wide hover:bg-gray-700 transition-colors"
            >
              RETURN TO ARMORY
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated but no orders
  if (ordersData?.orders?.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Package className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-light text-white mb-2">
            NO MISSIONS FOUND
          </h2>
          <p className="text-gray-400 mb-8">
            Start your vigilante journey by exploring our equipment
          </p>
          <Link
            to="/products"
            className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-medium tracking-wide hover:opacity-90 transition-all duration-300"
          >
            BROWSE EQUIPMENT
          </Link>
        </div>
      </div>
    );
  }

  const orders = ordersData?.orders || [];
  const pagination = ordersData?.pagination || {};

  const getStatusColor = (status) => {
    const colors = {
      pending: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
      confirmed: "text-blue-400 border-blue-400/30 bg-blue-400/10",
      processing: "text-purple-400 border-purple-400/30 bg-purple-400/10",
      shipped: "text-indigo-400 border-indigo-400/30 bg-indigo-400/10",
      delivered: "text-green-400 border-green-400/30 bg-green-400/10",
      cancelled: "text-red-400 border-red-400/30 bg-red-400/10",
    };
    return colors[status] || "text-gray-400 border-gray-400/30 bg-gray-400/10";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-light tracking-wider text-white mb-2">
            MISSION HISTORY
          </h1>
          <div className="w-20 h-px bg-yellow-400"></div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-gray-800/50 border border-gray-700 backdrop-blur-sm p-6 hover:border-gray-600 transition-colors"
            >
              {/* Order Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-4 border-b border-gray-700">
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">
                    #{order.orderNumber}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                  <span
                    className={`px-3 py-1 border text-xs font-medium tracking-wide uppercase ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                  <button className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-colors">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">VIEW</span>
                  </button>
                </div>
              </div>

              {/* Order Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide">
                    Total
                  </p>
                  <p className="text-white text-lg font-light">
                    {formatPrice(order.total)}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide">
                    Items
                  </p>
                  <p className="text-gray-300">
                    {order.items.length} item
                    {order.items.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide">
                    Payment
                  </p>
                  <p className="text-gray-300 capitalize">
                    {order.paymentMethod.replace("_", " ")}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="pt-4">
                <div className="flex items-center space-x-6 overflow-x-auto">
                  {order.items.slice(0, 4).map((item, index) => (
                    <div
                      key={item.productId}
                      className="flex-shrink-0 flex items-center space-x-3"
                    >
                      <div className="w-10 h-10 bg-gray-700 border border-gray-600 flex items-center justify-center">
                        <div className="w-6 h-6 bg-yellow-400/20"></div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-gray-200 text-sm truncate max-w-32">
                          {item.name}
                        </p>
                        <p className="text-gray-500 text-xs">
                          ×{item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <div className="flex-shrink-0">
                      <p className="text-gray-500 text-sm">
                        +{order.items.length - 4} more
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center mt-12 space-x-4">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={!pagination.hasPrev}
              className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>PREV</span>
            </button>

            <div className="flex items-center space-x-2 text-gray-500">
              <span>{pagination.currentPage}</span>
              <div className="w-6 h-px bg-gray-600"></div>
              <span>{pagination.totalPages}</span>
            </div>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!pagination.hasNext}
              className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
            >
              <span>NEXT</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BatmanOrders;

// {
//   "orderNumber": "BAT-2024-004",
//   "userId": "64f0eabc1234567890abcdef",
//   "orderStatus": "pending",
//   "paymentMethod": "credit_card",
//   "items": [
//     {
//       "productId": "64f1d23ab45678cd9012abcd",
//       "name": "Grappling Hook",
//       "quantity": 1,
//       "image": "/images/hook.jpg",
//       "price": 899.99
//     },
//     {
//       "productId": "64f1d23ab45678cd9012abce",
//       "name": "Kevlar Armor",
//       "quantity": 1,
//       "image": "/images/armor.jpg",
//       "price": 1099.99
//     }
//   ],
//   "total": 1999.98
// }
