"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { writeCartItems } from "../../cartStorage";

// ─────────────────────────────────────────────────────────────────────────────
// Description Parser
// Handles the format:
//   Short Description:  <text>
//   Key Highlights / Bullet Points:
//   1. <point>
//   2. <point>
// ─────────────────────────────────────────────────────────────────────────────
function parseDescription(raw) {
  if (!raw) return null;

  const result = { short: null, highlights: [] };

  // Extract short description
  const shortMatch = raw.match(
    /Short Description:\s*([\s\S]*?)(?=Key Highlights|$)/i,
  );
  if (shortMatch) {
    result.short = shortMatch[1].trim();
  }

  // Extract bullet points (numbered lines like "1. ...", "2. ...")
  const highlightsMatch = raw.match(/Key Highlights[^:]*:\s*([\s\S]*)/i);
  if (highlightsMatch) {
    const lines = highlightsMatch[1]
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    result.highlights = lines
      .map((line) => line.replace(/^\d+\.\s*/, "").trim())
      .filter(Boolean);
  }

  // Fallback: if no recognised structure, treat the whole thing as short description
  if (!result.short && result.highlights.length === 0) {
    result.short = raw.trim();
  }

  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// Formatted Description Component
// ─────────────────────────────────────────────────────────────────────────────
function FormattedDescription({ text }) {
  const parsed = useMemo(() => parseDescription(text), [text]);

  if (!parsed) {
    return (
      <p className="text-lg text-gray-600 leading-relaxed">
        No description available for this toy.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {parsed.short && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
            About this product
          </h3>
          <p className="text-base text-gray-700 leading-relaxed">
            {parsed.short}
          </p>
        </div>
      )}

      {parsed.highlights.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
            Key Highlights
          </h3>
          <ul className="space-y-2">
            {parsed.highlights.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f74872]/10 text-[10px] font-black text-[#f74872]">
                  {index + 1}
                </span>
                <span className="text-sm text-gray-700 leading-relaxed">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────
export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "9582399535";

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/toys/${id}`);
        const data = await response.json();
        if (!response.ok)
          throw new Error(data?.message || "Failed to fetch product.");
        setProduct(data.toy);
        setSelectedImage(
          data.toy?.images?.[0] || "https://placehold.co/800x600?text=No+Image",
        );
        setQuantity(data.toy?.stock > 0 ? 1 : 0);
      } catch (fetchError) {
        setError(fetchError.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const imageList = useMemo(() => {
    if (!product?.images?.length)
      return ["https://placehold.co/800x600?text=No+Image"];
    return product.images;
  }, [product]);

  const redirectToWhatsapp = () => {
    if (!product) return;
    if (!whatsappNumber) {
      alert("Please set NEXT_PUBLIC_WHATSAPP_NUMBER in your env file.");
      return;
    }
    const message = `Hi, I want to buy this toy: ${product.title}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const addToCart = () => {
    if (!product) return;
    const productId = product?._id || product?.id;
    if (!productId) {
      setCartMessage("Invalid product data.");
      return;
    }

    const stock = Number(product.stock) || 0;
    if (stock <= 0) {
      setCartMessage("This product is out of stock.");
      return;
    }

    const finalQuantity = Math.min(Math.max(Number(quantity) || 1, 1), stock);
    const cartKey = "cart_items";

    try {
      const existingRaw = localStorage.getItem(cartKey);
      let existingItems = [];
      if (existingRaw) {
        const parsed = JSON.parse(existingRaw);
        existingItems = Array.isArray(parsed) ? parsed : [];
      }

      const existingIndex = existingItems.findIndex(
        (item) => item.id === productId,
      );
      if (existingIndex >= 0) {
        const currentQty = Number(existingItems[existingIndex].quantity) || 0;
        existingItems[existingIndex].quantity = Math.min(
          currentQty + finalQuantity,
          stock,
        );
      } else {
        existingItems.push({ id: productId, quantity: finalQuantity });
      }

      writeCartItems(existingItems);
      setCartMessage("Added to cart.");
    } catch (_error) {
      setCartMessage("Could not update cart.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f74872]"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16 flex justify-center items-start">
        <div className="max-w-md w-full bg-white rounded-2xl border border-red-100 p-8 text-center shadow-sm">
          <svg
            className="mx-auto h-12 w-12 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="mt-4 text-xl font-bold text-gray-900">
            Oops! Something went wrong
          </h2>
          <p className="mt-2 text-gray-600">{error || "Product not found."}</p>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#f74872] px-6 py-3 text-base font-medium text-white shadow-sm transition-all hover:bg-[#d8355b] w-full"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-8">
          <Link
            href="/shop"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#f74872] transition-colors"
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
            Back to Shop
          </Link>
        </nav>

        <div className="rounded-3xl bg-white p-6 sm:p-8 lg:p-12 shadow-sm border border-gray-100">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Image Gallery */}
            <div className="flex flex-col gap-4">
              <div className="group relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100">
                <Image
                  width={1000}
                  height={1000}
                  src={selectedImage || imageList[0]}
                  alt={product.title}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              {imageList.length > 1 && (
                <div className="grid grid-cols-4 gap-4 sm:grid-cols-5">
                  {imageList.map((imageUrl) => (
                    <button
                      key={imageUrl}
                      type="button"
                      onClick={() => setSelectedImage(imageUrl)}
                      className={`relative aspect-square overflow-hidden rounded-xl transition-all ${
                        selectedImage === imageUrl
                          ? "ring-2 ring-[#f74872] ring-offset-2 opacity-100"
                          : "opacity-70 hover:opacity-100 hover:ring-2 hover:ring-gray-300 hover:ring-offset-2"
                      }`}
                    >
                      <Image
                        width={1000}
                        height={1000}
                        src={imageUrl}
                        alt={`${product.title} view`}
                        className="h-full w-full object-cover object-center bg-gray-100"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-6">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                  {product.title}
                </h1>
                <div className="mt-4 flex items-center">
                  <p className="text-3xl font-black text-[#f74872]">
                    ₹
                    {product.price !== undefined
                      ? parseFloat(product.price).toFixed(2)
                      : "0.00"}
                  </p>
                </div>

                {/* Specs Grid */}
                <div className="mt-5 mb-8 grid grid-cols-2 gap-4 sm:grid-cols-2 text-sm">
                  {[
                    { label: "Category", value: product.category },
                    { label: "Brand", value: product.brand },
                    { label: "Gender", value: product.gender },
                    { label: "Age Group", value: product.age },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="rounded-xl bg-gray-50 p-4 border border-gray-100 text-center sm:text-left"
                    >
                      <dt className="text-gray-500 mb-1 text-xs uppercase tracking-wider font-semibold">
                        {label}
                      </dt>
                      <dd className="font-bold text-gray-900">
                        {value || "-"}
                      </dd>
                    </div>
                  ))}
                </div>

                {/* ── Formatted Description ── */}
                <div >
                  <FormattedDescription text={product.description} />
                </div>
              </div>

              {product.tags?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-gray-900 mb-3 block">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-[#f74872]/10 px-3 py-1 text-xs font-semibold text-[#f74872]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart / Buy */}
              <div className="mt-auto border-t border-gray-200 pt-8">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">
                    Availability
                  </h3>
                  {product.stock > 0 ? (
                    <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-bold text-green-700">
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
                      In Stock ({product.stock})
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-sm font-bold text-red-700">
                      Out of Stock
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <div className="flex items-center rounded-xl border border-gray-300 bg-white flex-shrink-0 h-14 w-full sm:w-auto mt-1 sm:mt-0">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="flex h-full w-12 items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 rounded-l-xl transition-colors disabled:opacity-50"
                      disabled={Number(product.stock) <= 0 || quantity <= 1}
                    >
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
                          d="M20 12H4"
                        />
                      </svg>
                    </button>
                    <input
                      id="qty"
                      title="Quantity"
                      type="number"
                      min={product.stock > 0 ? 1 : 0}
                      max={product.stock > 0 ? product.stock : 0}
                      value={quantity}
                      onChange={(e) => {
                        const stock = Number(product.stock) || 0;
                        if (stock <= 0) {
                          setQuantity(0);
                          return;
                        }
                        setQuantity(
                          Math.min(
                            Math.max(Number(e.target.value) || 1, 1),
                            stock,
                          ),
                        );
                      }}
                      disabled={Number(product.stock) <= 0}
                      className="h-full w-full sm:w-16 border-0 bg-transparent text-center text-lg font-bold text-gray-900 focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      className="flex h-full w-12 items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 rounded-r-xl transition-colors disabled:opacity-50"
                      disabled={
                        Number(product.stock) <= 0 || quantity >= product.stock
                      }
                    >
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
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={addToCart}
                    disabled={Number(product.stock) <= 0}
                    className="flex-1 flex items-center justify-center gap-2 h-14 py-2 rounded-xl bg-[#f74872] px-8 text-lg font-bold text-white shadow-sm transition-all hover:bg-[#d8355b] hover:shadow-md disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
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
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Add to Cart
                  </button>
                </div>

                {cartMessage && (
                  <div
                    className={`mt-4 rounded-lg p-4 text-sm font-bold ${cartMessage.includes("Added") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
                  >
                    {cartMessage}
                  </div>
                )}

                <div className="mt-8 flex sm:flex-row gap-4 border-t border-gray-200 pt-8">
                  <button
                    type="button"
                    onClick={redirectToWhatsapp}
                    className="flex-1 flex items-center justify-center gap-2 h-14 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold transition-all shadow-sm shadow-green-600/20"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                    </svg>
                    Buy Now
                  </button>
                  <Link
                    href="/cart"
                    className="flex items-center justify-center sm:w-1/3 px-6 h-14 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                  >
                    View Cart
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
