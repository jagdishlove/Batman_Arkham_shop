"use client";

import { useParams, Link } from "react-router-dom";
import { CheckCircle, Package } from "lucide-react";
import { useOrder } from "@/hooks/useOrders";
import { formatDate } from "@/lib/utils";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import { formatPrice } from "@/utils";

const OrderConfirmation = () => {
  const { id } = useParams();
  const { data: order, isLoading, error } = useOrder(id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-red-500 text-lg">Order not found</p>
          <Link to="/orders" className="btn btn-primary mt-4">
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Header */}
      <div className="text-center mb-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-gray-600">
          Thank you for your order. We'll send you a confirmation email shortly.
        </p>
      </div>

      {/* Order Details */}
      <div className="card p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Order Number</h3>
            <p className="text-gray-600">{order.orderNumber}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Order Date</h3>
            <p className="text-gray-600">{formatDate(order.createdAt)}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Total</h3>
            <p className="text-xl font-bold text-gray-900">
              {formatPrice(order.total)}
            </p>
          </div>
        </div>

        {/* Order Status */}
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <Package className="h-6 w-6 text-blue-600" />
          <div>
            <p className="font-semibold">Order Status: {order.orderStatus}</p>
            <p className="text-sm text-gray-600">
              We'll notify you when your order ships
            </p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Items</h2>

        <div className="space-y-4">
          {order.items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center space-x-4 p-4 border rounded-lg"
            >
              <img
                src={item.image || "/placeholder.svg?height=80&width=80"}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg"
              />

              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-gray-600">
                  Price: {formatPrice(item.price)}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          <div className="text-gray-600">
            <p>{order.shippingAddress.name}</p>
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.zipCode}
            </p>
            <p>{order.shippingAddress.country}</p>
            <p>{order.shippingAddress.phone}</p>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          <p className="text-gray-600 capitalize">
            {order.paymentMethod.replace("_", " ")}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Status: {order.paymentStatus}
          </p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span>Tax</span>
            <span>{formatPrice(order.tax)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>
              {order.shipping === 0 ? "Free" : formatPrice(order.shipping)}
            </span>
          </div>

          <div className="border-t pt-3">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/orders" className="btn btn-primary">
          View All Orders
        </Link>
        <Link to="/products" className="btn btn-outline">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
