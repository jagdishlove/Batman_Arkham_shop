"use client";

import { useState } from "react";

const BatmanCheckout = () => {
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("credit_card");

  // Mock cart data
  const cart = {
    items: [
      {
        productId: {
          _id: "1",
          name: "Tactical Grappling Hook",
          images: [{ url: "/api/placeholder/50/50" }],
        },
        quantity: 1,
        price: 299.99,
      },
      {
        productId: {
          _id: "2",
          name: "Kevlar Body Armor",
          images: [{ url: "/api/placeholder/50/50" }],
        },
        quantity: 1,
        price: 1299.99,
      },
    ],
  };

  const handleAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Order placed! The Dark Knight approves.");
  };

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;

  const formatPrice = (price) => `$${price.toFixed(2)}`;

  return (
    <div
      className="min-h-screen bg-black text-gray-100"
      style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 40% 80%, rgba(120, 119, 198, 0.05) 0%, transparent 50%)`,
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-yellow-400 clip-path-batman"></div>
            <h1 className="text-4xl font-thin tracking-wider text-white">
              CHECKOUT
            </h1>
          </div>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto"></div>
        </div>

        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Forms */}
            <div className="space-y-10">
              {/* Shipping Address */}
              <div className="border border-gray-800 bg-gray-900/30 backdrop-blur-sm rounded-none p-8">
                <h2 className="text-xl font-light tracking-wide mb-8 text-yellow-400">
                  SHIPPING ADDRESS
                </h2>

                <div className="space-y-6">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    required
                    value={shippingAddress.name}
                    onChange={handleAddressChange}
                    className="w-full bg-black/50 border-b border-gray-700 px-0 py-3 text-gray-100 placeholder-gray-500 focus:border-yellow-400 focus:outline-none transition-colors"
                  />

                  <input
                    type="text"
                    name="street"
                    placeholder="Street Address"
                    required
                    value={shippingAddress.street}
                    onChange={handleAddressChange}
                    className="w-full bg-black/50 border-b border-gray-700 px-0 py-3 text-gray-100 placeholder-gray-500 focus:border-yellow-400 focus:outline-none transition-colors"
                  />

                  <div className="grid grid-cols-2 gap-6">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      required
                      value={shippingAddress.city}
                      onChange={handleAddressChange}
                      className="w-full bg-black/50 border-b border-gray-700 px-0 py-3 text-gray-100 placeholder-gray-500 focus:border-yellow-400 focus:outline-none transition-colors"
                    />

                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      required
                      value={shippingAddress.state}
                      onChange={handleAddressChange}
                      className="w-full bg-black/50 border-b border-gray-700 px-0 py-3 text-gray-100 placeholder-gray-500 focus:border-yellow-400 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="ZIP Code"
                      required
                      value={shippingAddress.zipCode}
                      onChange={handleAddressChange}
                      className="w-full bg-black/50 border-b border-gray-700 px-0 py-3 text-gray-100 placeholder-gray-500 focus:border-yellow-400 focus:outline-none transition-colors"
                    />

                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone"
                      required
                      value={shippingAddress.phone}
                      onChange={handleAddressChange}
                      className="w-full bg-black/50 border-b border-gray-700 px-0 py-3 text-gray-100 placeholder-gray-500 focus:border-yellow-400 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="border border-gray-800 bg-gray-900/30 backdrop-blur-sm rounded-none p-8">
                <h2 className="text-xl font-light tracking-wide mb-8 text-yellow-400">
                  PAYMENT METHOD
                </h2>

                <div className="space-y-4">
                  {[
                    { value: "credit_card", label: "CREDIT CARD" },
                    { value: "paypal", label: "PAYPAL" },
                    { value: "cash_on_delivery", label: "CASH ON DELIVERY" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center cursor-pointer group"
                    >
                      <div className="relative">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={option.value}
                          checked={paymentMethod === option.value}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="sr-only"
                        />
                        <div
                          className={`w-4 h-4 border border-gray-600 ${
                            paymentMethod === option.value
                              ? "bg-yellow-400 border-yellow-400"
                              : "bg-transparent"
                          } transition-colors`}
                        >
                          {paymentMethod === option.value && (
                            <div className="w-2 h-2 bg-black absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                          )}
                        </div>
                      </div>
                      <span className="ml-4 text-gray-300 tracking-wide group-hover:text-yellow-400 transition-colors">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div>
              <div className="border border-gray-800 bg-gray-900/30 backdrop-blur-sm rounded-none p-8 sticky top-8">
                <h2 className="text-xl font-light tracking-wide mb-8 text-yellow-400">
                  ORDER SUMMARY
                </h2>

                {/* Order Items */}
                <div className="space-y-6 mb-8">
                  {cart.items.map((item) => (
                    <div
                      key={item.productId._id}
                      className="flex items-center space-x-4"
                    >
                      <div className="w-12 h-12 bg-gray-800 border border-gray-700 flex items-center justify-center">
                        <div className="w-6 h-6 bg-yellow-400/20"></div>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-200 text-sm tracking-wide">
                          {item.productId.name}
                        </p>
                        <p className="text-gray-500 text-xs">
                          QTY: {item.quantity}
                        </p>
                      </div>
                      <p className="text-yellow-400 font-light">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-4 border-t border-gray-800 pt-6">
                  <div className="flex justify-between text-gray-400">
                    <span>SUBTOTAL</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-gray-400">
                    <span>TAX</span>
                    <span>{formatPrice(tax)}</span>
                  </div>

                  <div className="flex justify-between text-gray-400">
                    <span>SHIPPING</span>
                    <span>
                      {shipping === 0 ? "FREE" : formatPrice(shipping)}
                    </span>
                  </div>

                  <div className="border-t border-gray-800 pt-4">
                    <div className="flex justify-between text-xl font-light text-yellow-400">
                      <span>TOTAL</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full mt-8 bg-yellow-400 hover:bg-yellow-300 text-black font-light tracking-widest py-4 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-black"
                >
                  PLACE ORDER
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .clip-path-batman {
          clip-path: polygon(
            50% 0%,
            15% 25%,
            0% 50%,
            15% 75%,
            50% 100%,
            85% 75%,
            100% 50%,
            85% 25%
          );
        }
      `}</style>
    </div>
  );
};

export default BatmanCheckout;
