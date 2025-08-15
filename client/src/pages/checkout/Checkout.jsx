"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { batmanToast } from "@/utils/toast";
import { Shield, Lock } from "lucide-react";
import { useStandardMutation } from "@/lib/useStandardMutation";
import { post } from "@/lib/http";
import useCartStore from "@/store/cartStore";
import { formatPrice } from "@/utils";

const PAYMENT_METHODS = {
  CARD: "credit_card",
  PAYPAL: "paypal",
  COD: "cod",
};

const BatmanCheckout = () => {
  const navigate = useNavigate();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });
  const [paymentDetails, setPaymentDetails] = useState({
    method: PAYMENT_METHODS.CARD,
    card: { number: "", expiry: "", cvv: "", name: "" },
    paypal: { email: "" },
  });

  const {
    items,
    getCartTotal,
    getTaxAmount,
    getShippingCost,
    getFinalTotal,
    clearCart,
  } = useCartStore();

  const postOrder = (data) => post("/orders/create", data);

  const { mutate, isPending } = useStandardMutation(postOrder, {
    successMsg: "Order placed successfully!",
    onSuccess: () => {
      clearCart();
      navigate(`/orders`);
    },
    onError: (error) => {
      batmanToast.error(error.message || "Failed to place order");
    },
  });

  const handleSubmit = async () => {
    if (!isFormValid()) {
      batmanToast.error("Please fill all required fields");
      return;
    }

    const orderData = {
      items: items.map((item) => ({
        product: item.id,
        quantity: item.quantity,
      })),
      shippingAddress,
      payment: {
        method: paymentDetails.method,
        ...(paymentDetails.method === PAYMENT_METHODS.CARD && {
          card: { last4: paymentDetails.card.number.slice(-4) },
        }),
        ...(paymentDetails.method === PAYMENT_METHODS.PAYPAL && {
          email: paymentDetails.paypal.email,
        }),
      },
      subtotal: getCartTotal(),
      tax: getTaxAmount(),
      shipping: getShippingCost(),
      total: getFinalTotal(),
    };

    mutate(orderData);
  };

  const isFormValid = () => {
    const isShippingValid = Object.values(shippingAddress).every(
      (val) => !!val
    );
    const isPaymentValid =
      paymentDetails.method === PAYMENT_METHODS.COD
        ? true
        : paymentDetails.method === PAYMENT_METHODS.PAYPAL
        ? !!paymentDetails.paypal.email
        : !!(
            paymentDetails.card.number &&
            paymentDetails.card.expiry &&
            paymentDetails.card.cvv
          );

    return isShippingValid && isPaymentValid && acceptedTerms;
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-light mb-4">NO EQUIPMENT SELECTED</h2>
          <button
            onClick={() => navigate("/products")}
            className="px-6 py-2 bg-yellow-400 text-black hover:bg-yellow-300 transition-colors"
          >
            RETURN TO ARMORY
          </button>
        </div>
      </div>
    );
  }

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
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        [e.target.name]: e.target.value,
                      })
                    }
                    className="w-full bg-black/50 border-b border-gray-700 px-0 py-3 text-gray-100 placeholder-gray-500 focus:border-yellow-400 focus:outline-none transition-colors"
                  />

                  <input
                    type="text"
                    name="street"
                    placeholder="Street Address"
                    required
                    value={shippingAddress.street}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        [e.target.name]: e.target.value,
                      })
                    }
                    className="w-full bg-black/50 border-b border-gray-700 px-0 py-3 text-gray-100 placeholder-gray-500 focus:border-yellow-400 focus:outline-none transition-colors"
                  />

                  <div className="grid grid-cols-2 gap-6">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      required
                      value={shippingAddress.city}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          [e.target.name]: e.target.value,
                        })
                      }
                      className="w-full bg-black/50 border-b border-gray-700 px-0 py-3 text-gray-100 placeholder-gray-500 focus:border-yellow-400 focus:outline-none transition-colors"
                    />

                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      required
                      value={shippingAddress.state}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          [e.target.name]: e.target.value,
                        })
                      }
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
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          [e.target.name]: e.target.value,
                        })
                      }
                      className="w-full bg-black/50 border-b border-gray-700 px-0 py-3 text-gray-100 placeholder-gray-500 focus:border-yellow-400 focus:outline-none transition-colors"
                    />

                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone"
                      required
                      value={shippingAddress.phone}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          [e.target.name]: e.target.value,
                        })
                      }
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
                  {Object.values(PAYMENT_METHODS).map((method) => (
                    <button
                      key={method}
                      onClick={() =>
                        setPaymentDetails((prev) => ({
                          ...prev,
                          method,
                        }))
                      }
                      className={`px-4 py-2 mx-2 rounded-md ${
                        paymentDetails.method === method
                          ? "bg-yellow-500 text-black"
                          : "bg-gray-800 text-white"
                      }`}
                    >
                      {method === PAYMENT_METHODS.CARD && "Credit Card"}
                      {method === PAYMENT_METHODS.PAYPAL && "PayPal"}
                      {method === PAYMENT_METHODS.COD && "Cash on Delivery"}
                    </button>
                  ))}
                </div>

                {/* Credit Card Details */}
                {paymentDetails.method === PAYMENT_METHODS.CARD && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <input
                      type="text"
                      name="card.number"
                      placeholder="Card Number (4242 4242 4242 4242)"
                      value={paymentDetails.card.number}
                      onChange={(e) =>
                        setPaymentDetails((prev) => ({
                          ...prev,
                          card: {
                            ...prev.card,
                            number: e.target.value,
                          },
                        }))
                      }
                      className="bg-gray-800 px-4 py-2 rounded-md"
                    />
                    <input
                      type="text"
                      name="card.name"
                      placeholder="Name on Card"
                      value={paymentDetails.card.name}
                      onChange={(e) =>
                        setPaymentDetails((prev) => ({
                          ...prev,
                          card: {
                            ...prev.card,
                            name: e.target.value,
                          },
                        }))
                      }
                      className="bg-gray-800 px-4 py-2 rounded-md"
                    />
                    <input
                      type="text"
                      name="card.expiry"
                      placeholder="MM/YY"
                      value={paymentDetails.card.expiry}
                      onChange={(e) =>
                        setPaymentDetails((prev) => ({
                          ...prev,
                          card: {
                            ...prev.card,
                            expiry: e.target.value,
                          },
                        }))
                      }
                      className="bg-gray-800 px-4 py-2 rounded-md"
                    />
                    <input
                      type="text"
                      name="card.cvv"
                      placeholder="CVV"
                      value={paymentDetails.card.cvv}
                      onChange={(e) =>
                        setPaymentDetails((prev) => ({
                          ...prev,
                          card: {
                            ...prev.card,
                            cvv: e.target.value,
                          },
                        }))
                      }
                      className="bg-gray-800 px-4 py-2 rounded-md"
                    />
                  </div>
                )}

                {/* PayPal Email */}
                {paymentDetails.method === PAYMENT_METHODS.PAYPAL && (
                  <input
                    type="email"
                    name="paypal.email"
                    placeholder="PayPal Email"
                    value={paymentDetails.paypal.email}
                    onChange={(e) =>
                      setPaymentDetails((prev) => ({
                        ...prev,
                        paypal: {
                          ...prev.paypal,
                          email: e.target.value,
                        },
                      }))
                    }
                    className="w-full bg-gray-800 px-4 py-2 rounded-md mt-6"
                  />
                )}

                {/* COD Message */}
                {paymentDetails.method === PAYMENT_METHODS.COD && (
                  <div className="bg-gray-800 p-4 rounded-md mt-6">
                    <p className="text-gray-400">
                      Pay with cash upon delivery. Additional fee may apply.
                    </p>
                  </div>
                )}
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
                  {items.map((item) => {
                    console.log("items", items);
                    return (
                      <div
                        key={item.id}
                        className="flex items-center space-x-4"
                      >
                        <div className="w-12 h-12 bg-gray-800 border border-gray-700 flex items-center justify-center">
                          <img
                            src={item.images[0].url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-200 text-sm tracking-wide">
                            {item.name}
                          </p>
                          <p className="text-gray-500 text-xs">
                            QTY: {item.quantity}
                          </p>
                        </div>
                        <p className="text-yellow-400 font-light">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Totals */}
                <div className="space-y-4 border-t border-gray-800 pt-6">
                  <div className="flex justify-between text-gray-400">
                    <span>SUBTOTAL</span>
                    <span>{formatPrice(getCartTotal())}</span>
                  </div>

                  <div className="flex justify-between text-gray-400">
                    <span>TAX</span>
                    <span>{formatPrice(getTaxAmount())}</span>
                  </div>

                  <div className="flex justify-between text-gray-400">
                    <span>SHIPPING</span>
                    <span>
                      {getShippingCost() === 0
                        ? "FREE"
                        : formatPrice(getShippingCost())}
                    </span>
                  </div>

                  <div className="border-t border-gray-800 pt-4">
                    <div className="flex justify-between text-xl font-light text-yellow-400">
                      <span>TOTAL</span>
                      <span>{formatPrice(getFinalTotal())}</span>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="mb-6 mt-6 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-yellow-500 focus:ring-yellow-500"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-400">
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-yellow-500 hover:text-yellow-400"
                      target="_blank"
                    >
                      Terms and Conditions
                    </Link>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isPending || !isFormValid()}
                  className={`w-full mt-8 flex items-center justify-center gap-2 ${
                    isPending || !isFormValid()
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-yellow-400 hover:bg-yellow-300"
                  } text-black font-light tracking-widest py-4 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-black`}
                >
                  {isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      PROCESSING...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      PLACE ORDER
                    </>
                  )}
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
