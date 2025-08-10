import { useState } from "react";
import { useStandardQuery } from "@/lib/useStandardQuery";
import { Shield, Search } from "lucide-react";
import { formatDate, formatPrice } from "../../utils";
import { get } from "../../lib/http";
import { useStandardMutation } from "@/lib/useStandardMutation";
import { patch } from "@/lib/http";
import { useQueryClient } from "@tanstack/react-query";

const ORDER_STATUS = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
};

const statusColors = {
  pending: "bg-yellow-500/20 text-yellow-500",
  confirmed: "bg-blue-500/20 text-blue-500",
  shipped: "bg-purple-500/20 text-purple-500",
  delivered: "bg-green-500/20 text-green-500",
};

const OrderSection = ({ orders, orderLoading: isLoading, ordersError:error }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const queryClient = useQueryClient();

  const totalOrders = orders?.length || 0;

  const filteredOrders = orders?.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Status update mutation
  const { mutate: updateOrderStatus, isPending: isUpdating } =
    useStandardMutation(
      ({ orderId, status }) => patch(`/orders/update/${orderId}`, { status }),
      {
        successMsg: "Order status updated successfully",
        onSuccess: () => {
          queryClient.invalidateQueries(["admin-orders"]);
        },
      }
    );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-yellow-400 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Shield className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-xl font-medium text-white mb-2">
          Failed to Load Orders
        </h2>
        <p className="text-gray-400">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-xl font-light tracking-wide text-yellow-400">
            ORDERS MANAGEMENT
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Total Orders:{" "}
            <span className="text-white font-medium">{totalOrders}</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-800 rounded-md focus:outline-none focus:border-yellow-500/50"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-md focus:outline-none focus:border-yellow-500/50"
          >
            <option value="all">All Status</option>
            {Object.entries(ORDER_STATUS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <div className="min-w-full divide-y divide-gray-800">
          <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-900/50 rounded-t-md text-sm font-medium text-gray-400">
            <div className="col-span-2">Order #</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Customer</div>
            <div className="col-span-2">Total</div>
            <div className="col-span-2">Items</div>
            <div className="col-span-2">Status</div>
          </div>

          <div className="divide-y divide-gray-800">
            {filteredOrders?.map((order) => (
              <div
                key={order._id}
                className="grid grid-cols-12 gap-4 px-4 py-4 bg-gray-900/30 items-center hover:bg-gray-900/50 transition-colors"
              >
                <div className="col-span-2 font-medium text-white">
                  {order.orderNumber}
                </div>
                <div className="col-span-2 text-sm text-gray-400">
                  {formatDate(order.createdAt, { format: "short" })}
                </div>
                <div className="col-span-2 text-sm text-gray-300">
                  {order.shippingAddress.name}
                </div>
                <div className="col-span-2 font-medium text-yellow-400">
                  {formatPrice(order.total)}
                </div>
                <div className="col-span-2 text-sm text-gray-400">
                  {order.items.reduce((acc, item) => acc + item.quantity, 0)}{" "}
                  items
                </div>
                <div className="col-span-2">
                  <select
                    value={order.status}
                    disabled={isUpdating}
                    className={`w-full px-3 py-1.5 rounded-md text-sm transition-colors
                      ${statusColors[order.status]} 
                      ${
                        isUpdating
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer hover:bg-opacity-80"
                      }`}
                    onChange={(e) => {
                      updateOrderStatus({
                        orderId: order._id,
                        status: e.target.value,
                      });
                    }}
                  >
                    {Object.entries(ORDER_STATUS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredOrders?.map((order) => (
          <div
            key={order._id}
            className="bg-gray-900/30 border border-gray-800 rounded-lg overflow-hidden"
          >
            <div className="p-4 border-b border-gray-800">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-gray-400">
                    {formatDate(order.createdAt, { format: "short" })}
                  </p>
                </div>
                <select
                  value={order.status}
                  disabled={isUpdating}
                  className={`px-2 py-1 rounded text-sm ${
                    statusColors[order.status]
                  }`}
                  onChange={(e) => {
                    updateOrderStatus({
                      orderId: order._id,
                      status: e.target.value,
                    });
                  }}
                >
                  {Object.entries(ORDER_STATUS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Customer</span>
                <span className="text-white">{order.shippingAddress.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Items</span>
                <span className="text-white">
                  {order.items.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total</span>
                <span className="text-yellow-400 font-medium">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredOrders?.length === 0 && (
        <div className="text-center py-12">
          <Shield className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">
            No orders found matching your criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderSection;
