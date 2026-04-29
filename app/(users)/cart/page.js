"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { readCartItems, writeCartItems } from "../cartStorage";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [productsData, setProductsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Read cart items from localStorage
  useEffect(() => {
    const items = readCartItems();
    setCartItems(items);
  }, []);

  // Fetch product details (without images) for items in cart
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (cartItems.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const productPromises = cartItems.map(async (cartItem) => {
        try {
          const response = await fetch(`/api/toys/${cartItem.id}`);
          if (!response.ok) throw new Error("Product not found");
          const data = await response.json();
          return {
            id: cartItem.id,
            product: {
              title: data.toy.title,
              stock: data.toy.stock,
              category: data.toy.category,
              brand: data.toy.brand,
              price: data.toy.price || 0,
            },
            quantity: cartItem.quantity,
          };
        } catch (error) {
          console.error(`Failed to fetch product ${cartItem.id}:`, error);
          return {
            id: cartItem.id,
            product: {
              title: cartItem.name || "Product not found",
              stock: 0,
              price: 0,
            },
            quantity: cartItem.quantity,
          };
        }
      });

      const results = await Promise.all(productPromises);

      // Create a map of product data
      const productMap = {};
      results.forEach(({ id, product, quantity }) => {
        productMap[id] = { ...product, cartQuantity: quantity };
      });

      setProductsData(productMap);
      setLoading(false);
    };

    fetchProductDetails();
  }, [cartItems]);

  const saveCart = (updatedCartItems) => {
    const result = writeCartItems(updatedCartItems);
    if (result.ok) {
      setCartItems(result.items);
    }
  };

  const updateQuantity = async (id, nextQuantity) => {
    const stock = productsData[id]?.stock || 0;
    const quantity = Math.min(Math.max(Number(nextQuantity) || 1, 1), stock);

    const updatedCart = cartItems.map((item) => {
      if (item.id !== id) return item;
      return { ...item, quantity };
    });

    saveCart(updatedCart);

    // Update the productsData with new quantity
    setProductsData((prev) => ({
      ...prev,
      [id]: { ...prev[id], cartQuantity: quantity },
    }));
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    saveCart(updatedCart);

    // Remove from productsData
    setProductsData((prev) => {
      const newData = { ...prev };
      delete newData[id];
      return newData;
    });
  };

  const clearCart = () => {
    saveCart([]);
    setProductsData({});
  };

  const totalItems = useMemo(
    () =>
      cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0),
    [cartItems],
  );

  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const product = productsData[item.id];
      if (!product) return sum;
      return sum + Number(product.price) * (Number(item.quantity) || 0);
    }, 0);
  }, [cartItems, productsData]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setIsCheckingOut(true);
    try {
      // Generate PDF directly in the browser to avoid Next.js server API crashes
      const doc = new jsPDF();

      // Header
      doc.setFontSize(24);
      doc.text("Order Receipt", 105, 20, { align: "center" });

      // Customer Details
      doc.setFontSize(14);
      doc.text("Customer Details", 14, 40);
      doc.setFontSize(10);
      doc.text(`Name: ${checkoutData.name}`, 14, 48);
      doc.text(`Email: ${checkoutData.email}`, 14, 54);
      doc.text(`Phone: ${checkoutData.phone}`, 14, 60);
      doc.text(`Address: ${checkoutData.address}`, 14, 66);

      // Table mapping
      const tableColumn = ["Item ID", "Product Name", "Qty", "Price", "Total"];
      const tableRows = [];

      cartItems.forEach((item) => {
        const product = productsData[item.id] || {};
        const title = product.title || "Unknown Product";
        const price = Number(product.price) || 0;
        const qty = Number(item.quantity) || 0;
        tableRows.push([
          item.id.slice(0, 8),
          title,
          qty,
          `Rs. ${price.toFixed(2)}`,
          `Rs. ${(price * qty).toFixed(2)}`,
        ]);
      });

      autoTable(doc, {
        startY: 75,
        head: [tableColumn],
        body: tableRows,
      });

      const finalY = doc.lastAutoTable?.finalY || 75;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`Total Items: ${totalItems}`, 14, finalY + 12);
      doc.text(`Final Amount: Rs. ${totalPrice.toFixed(2)}`, 14, finalY + 20);

      // Save directly to user device
      doc.save(`Receipt_${Date.now()}.pdf`);

      // Additionally send to the backend for email dispatch
      try {
        const pdfBase64 = doc.output("datauristring");
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...checkoutData,
            pdfBase64,
          }),
        });

        if (!response.ok) {
          console.error(
            "Failed to send checkout email via API.",
            await response.text(),
          );
        }
      } catch (emailError) {
        console.error("Error connecting to checkout API:", emailError);
      }

      setTimeout(() => {
        alert(
          "Checkout successful! Receipt downloaded locally and order placed.",
        );
      }, 500);

      clearCart();
      setIsCheckoutOpen(false);
    } catch (error) {
      console.error(error);
      alert("Checkout failed. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Shopping Cart
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
              your cart
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Continue Shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-50">
              <svg
                className="h-12 w-12 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="mt-6 text-xl font-bold text-gray-900">
              Your cart is empty
            </h3>
            <p className="mt-2 text-gray-500">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <Link
              href="/shop"
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items List */}
            <div className="flex-1 space-y-4">
              {cartItems.map((cartItem) => {
                const product = productsData[cartItem.id];
                if (!product) return null;

                return (
                  <div
                    key={cartItem.id}
                    className="relative flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md sm:flex-row sm:items-center"
                  >
                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-gray-900">
                        {product.title || "Product"}
                      </h2>

                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                        {product.brand && (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                            {product.brand}
                          </span>
                        )}
                        {product.category && (
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                            {product.category}
                          </span>
                        )}
                        <span>
                          ID:{" "}
                          <span className="font-mono text-xs">
                            {cartItem.id.slice(0, 8)}...
                          </span>
                        </span>
                        <span className="font-bold text-gray-900 ml-auto text-base">
                          ₹
                          {product.price
                            ? parseFloat(product.price).toFixed(2)
                            : "0.00"}{" "}
                          / each
                        </span>
                      </div>

                      <div className="mt-4 flex items-center text-sm">
                        {product.stock > 0 ? (
                          <span className="flex items-center text-green-600 font-medium">
                            <svg
                              className="mr-1.5 h-4 w-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            In stock ({product.stock} available)
                          </span>
                        ) : (
                          <span className="flex items-center text-red-500 font-medium">
                            <svg
                              className="mr-1.5 h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Out of stock
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-80 xl:w-96 shrink-0">
              <div className="sticky top-8 flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-4">
                  Order Summary
                </h3>

                <div className="flex items-center justify-between text-gray-600 text-sm">
                  <span>Total Items</span>
                  <span className="font-medium text-gray-900">
                    {totalItems}
                  </span>
                </div>

                <div className="flex items-center justify-between text-gray-900 text-lg font-black mt-2">
                  <span>Total Amount</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>

                <div className="pt-4 border-t border-gray-200 space-y-4 text-sm">
                  <button
                    type="button"
                    className="w-full rounded-xl bg-blue-600 px-6 py-4 text-base font-bold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex justify-center items-center gap-2"
                    onClick={() => {
                      setIsCheckoutOpen(true);
                    }}
                  >
                    <span>Proceed to Checkout</span>
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={clearCart}
                    className="w-full rounded-xl border-2 border-red-100 bg-transparent px-6 py-3 font-semibold text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Clear Entire Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Checkout Modal */}
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    Checkout Details
                  </h2>
                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <form onSubmit={handleCheckout} className="p-6 space-y-4">
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    required
                    type="text"
                    value={checkoutData.name}
                    onChange={(e) =>
                      setCheckoutData({ ...checkoutData, name: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 outline-none"
                    placeholder="Enter Name"
                  />
                </div>
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    value={checkoutData.email}
                    onChange={(e) =>
                      setCheckoutData({
                        ...checkoutData,
                        email: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 outline-none"
                    placeholder="Enter Email"
                  />
                </div>
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-1">
                    Phone Number  
                  </label>
                  <input
                    minLength={10}
                    maxLength={10}
                    required
                    pattern="[0-9]{10}"
                    type="tel"
                    value={checkoutData.phone}
                    onChange={(e) =>
                      setCheckoutData({
                        ...checkoutData,
                        phone: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 outline-none"
                    placeholder="Enter 10 digits number"
                  />
                </div>
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-1">
                  Address
                  </label>
                  <textarea
                    required
                    rows="3"
                    value={checkoutData.address}
                    onChange={(e) =>
                      setCheckoutData({
                        ...checkoutData,
                        address: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 outline-none"
                    placeholder="Enter Address"
                  ></textarea>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsCheckoutOpen(false)}
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl border border-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCheckingOut}
                    className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50"
                  >
                    {isCheckingOut ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>Confirm Order ₹{totalPrice.toFixed(2)}</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
