import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  User,
  MapPin,
  Home,
  Landmark,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Truck,
  LockKeyhole,
  WalletCards,
  ArrowLeft,
  ChevronRight,
  AlertCircle,
  Plus,
  Edit2,
  Building2,
} from "lucide-react";
import toast from "react-hot-toast";

import { orderService } from "../../../services/order";
import paymentService from "../../../services/payment";
import { useCart } from "../../../context/CartContext";
import api from "../../../services/api";

const PAYMENT_METHODS = [
  {
    id: "razorpay",
    title: "Online Payment",
    description: "Pay using UPI, cards, NetBanking or wallets.",
    badge: "Recommended",
    icon: CreditCard,
  },
  {
    id: "cod",
    title: "Cash on Delivery",
    description: "Pay when your order reaches your doorstep.",
    badge: "Manual",
    icon: Truck,
  },
];

const LABEL_OPTIONS = ["Home", "Work", "Other"];

const emptyAddressForm = {
  fullName: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  landmark: "",
  label: "Home",
  isDefault: false,
};

const cleanText = (value) => String(value || "").trim();
const cleanPhone = (value) =>
  String(value || "")
    .replace(/\D/g, "")
    .slice(0, 10);
const cleanPincode = (value) =>
  String(value || "")
    .replace(/\D/g, "")
    .slice(0, 6);
const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const extractOrder = (response) => {
  const root = response?.data || response || {};
  const inner = root?.data || root;

  return (
    inner?.order ||
    inner?.data?.order ||
    root?.order ||
    root?.data?.order ||
    null
  );
};

const extractRazorpayOrder = (response) => {
  const root = response?.data || response || {};
  const inner = root?.data || root;

  return inner?.razorpay || inner?.data?.razorpay || root?.razorpay || null;
};

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function getProductImage(item) {
  return (
    item?.image ||
    item?.product?.images?.[0]?.url ||
    item?.product?.images?.[0] ||
    item?.images?.[0]?.url ||
    item?.images?.[0] ||
    "/images/placeholder.jpg"
  );
}

function getProductName(item) {
  return item?.name || item?.product?.name || item?.title || "Product";
}

function getProductPrice(item) {
  return Number(item?.price || item?.product?.price || item?.salePrice || 0);
}

function getLabelIcon(label) {
  if (label === "Work") return Building2;
  return Home;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems = [] } = useCart() || {};

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");

  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [savingAddress, setSavingAddress] = useState(false);
  const [saveAddressToBook, setSaveAddressToBook] = useState(true);

  const [shippingAddress, setShippingAddress] = useState(emptyAddressForm);

  const fetchAddresses = useCallback(async () => {
    try {
      setAddressesLoading(true);
      const res = await api.get("/users/addresses");
      const list = res.data?.data?.addresses || [];
      setAddresses(list);
      if (list.length > 0) {
        const defaultAddr = list.find((a) => a.isDefault) || list[0];
        setSelectedAddressId(defaultAddr._id);
        applySavedAddress(defaultAddr);
      } else {
        setShowAddressForm(true);
      }
    } catch {
      setShowAddressForm(true);
    } finally {
      setAddressesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const applySavedAddress = (addr) => {
    setShippingAddress((prev) => ({
      ...prev,
      fullName: addr.fullName || prev.fullName,
      email: addr.email || prev.email,
      phone: addr.phone || prev.phone,
      addressLine1: addr.addressLine1 || "",
      addressLine2: addr.addressLine2 || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || "",
      country: addr.country || "India",
      landmark: addr.landmark || "",
      label: addr.label || "Home",
      isDefault: addr.isDefault || false,
    }));
  };

  const selectedPayment = useMemo(() => {
    return PAYMENT_METHODS.find((method) => method.id === paymentMethod);
  }, [paymentMethod]);

  const cartSummary = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => {
      return sum + getProductPrice(item) * Number(item?.quantity || 1);
    }, 0);

    const itemCount = cartItems.reduce(
      (sum, item) => sum + Number(item?.quantity || 1),
      0,
    );
    const shipping = subtotal > 0 && subtotal < 999 ? 79 : 0;
    const gst = subtotal ? Math.round(subtotal * 0.18) : 0;
    const total = subtotal + shipping + gst;

    return { subtotal, itemCount, shipping, gst, total };
  }, [cartItems]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    let nextValue = value;

    if (name === "phone") nextValue = cleanPhone(value);
    if (name === "pincode") nextValue = cleanPincode(value);

    setShippingAddress((prev) => ({ ...prev, [name]: nextValue }));
  };

  const handleSelectSavedAddress = (addr) => {
    setSelectedAddressId(addr._id);
    setEditingAddressId(null);
    setShowAddressForm(false);
    applySavedAddress(addr);
  };

  const handleStartEdit = (addr) => {
    setEditingAddressId(addr._id);
    setSelectedAddressId(null);
    setShowAddressForm(true);
    applySavedAddress(addr);
  };

  const handleStartAddNew = () => {
    setSelectedAddressId(null);
    setEditingAddressId(null);
    setShowAddressForm(true);
    setShippingAddress((prev) => ({
      ...emptyAddressForm,
      email: prev.email,
    }));
  };

  const handleCancelForm = () => {
    setShowAddressForm(false);
    setEditingAddressId(null);
    if (addresses.length > 0) {
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      setSelectedAddressId(defaultAddr._id);
      applySavedAddress(defaultAddr);
    }
  };

  const saveAddressToDb = async () => {
    try {
      setSavingAddress(true);
      const payload = {
        label: cleanText(shippingAddress.label) || "Home",
        fullName: cleanText(shippingAddress.fullName),
        email: cleanText(shippingAddress.email).toLowerCase() || null,
        phone: cleanPhone(shippingAddress.phone),
        addressLine1: cleanText(shippingAddress.addressLine1),
        addressLine2: cleanText(shippingAddress.addressLine2) || null,
        city: cleanText(shippingAddress.city),
        state: cleanText(shippingAddress.state),
        pincode: cleanPincode(shippingAddress.pincode),
        country: cleanText(shippingAddress.country) || "India",
        landmark: cleanText(shippingAddress.landmark) || null,
        isDefault: addresses.length === 0 || shippingAddress.isDefault,
      };

      let savedAddress;
      if (editingAddressId) {
        const res = await api.put(
          `/users/addresses/${editingAddressId}`,
          payload,
        );
        savedAddress = res.data?.data?.address || payload;
        toast.success("Address updated");
      } else {
        const res = await api.post("/users/addresses", payload);
        savedAddress = res.data?.data?.address || payload;
        toast.success("Address saved");
      }

      await fetchAddresses();
      return savedAddress;
    } catch (error) {
      throw error;
    } finally {
      setSavingAddress(false);
    }
  };

  const validate = () => {
    const fullName = cleanText(shippingAddress.fullName);
    const email = cleanText(shippingAddress.email).toLowerCase();
    const phone = cleanPhone(shippingAddress.phone);
    const addressLine1 = cleanText(shippingAddress.addressLine1);
    const city = cleanText(shippingAddress.city);
    const state = cleanText(shippingAddress.state);
    const pincode = cleanPincode(shippingAddress.pincode);

    if (fullName.length < 3) return "Full name must be at least 3 characters.";
    if (!email) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Please enter a valid email address.";
    if (!/^[6-9]\d{9}$/.test(phone))
      return "Please enter a valid 10-digit Indian phone number.";
    if (addressLine1.length < 8) return "Please enter a complete address.";
    if (!city) return "City is required.";
    if (!state) return "State is required.";
    if (!/^\d{6}$/.test(pincode))
      return "Please enter a valid 6-digit pincode.";
    if (!["razorpay", "cod"].includes(paymentMethod))
      return "Please select a valid payment method.";

    return "";
  };

  const buildCleanAddress = () => ({
    fullName: cleanText(shippingAddress.fullName),
    phone: cleanPhone(shippingAddress.phone),
    addressLine1: cleanText(shippingAddress.addressLine1),
    addressLine2: cleanText(shippingAddress.addressLine2) || null,
    city: cleanText(shippingAddress.city),
    state: cleanText(shippingAddress.state),
    pincode: cleanPincode(shippingAddress.pincode),
    country: cleanText(shippingAddress.country) || "India",
    landmark: cleanText(shippingAddress.landmark) || null,
  });

  const startRazorpayCheckout = async (createdOrder) => {
    const orderMongoId = createdOrder?._id;
    const humanOrderId = createdOrder?.orderId || orderMongoId;

    if (!orderMongoId) {
      throw new Error("Order ID not found after order creation.");
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      throw new Error(
        "Razorpay checkout failed to load. Please check your connection.",
      );
    }

    const razorpayOrderResponse =
      await paymentService.createRazorpayOrder(orderMongoId);
    const razorpayData = extractRazorpayOrder(razorpayOrderResponse);

    if (!razorpayData || !razorpayData.orderId || !razorpayData.keyId) {
      console.error("Razorpay create order response:", razorpayOrderResponse);
      throw new Error("Razorpay order not created properly.");
    }

    const amount = Number(createdOrder.total || 0);

    const options = {
      key: razorpayData.keyId,
      amount: Math.round(amount * 100),
      currency: "INR",
      name: "Anandavrinda",
      description: `Payment for order ${humanOrderId}`,
      order_id: razorpayData.orderId,
      prefill: {
        name: shippingAddress.fullName || createdOrder.customerName || "",
        email: shippingAddress.email || createdOrder.customerEmail || "",
        contact: shippingAddress.phone || createdOrder.customerPhone || "",
      },
      notes: {
        order_id: String(orderMongoId),
        order_number: humanOrderId,
      },
      theme: {
        color: "#0d9488",
      },
      handler: async function (response) {
        try {
          await paymentService.verifyRazorpayPayment(orderMongoId, {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });

          navigate(`/payment/razorpay/success?order_id=${humanOrderId}`, {
            replace: true,
          });
        } catch (verifyError) {
          console.error("Razorpay verify after handler error:", verifyError);
          toast.error("Payment verification failed. Please check your orders.");
          navigate(`/payment/razorpay/success?order_id=${humanOrderId}`, {
            replace: true,
          });
        }
      },
      modal: {
        ondismiss: function () {
          toast.error("Payment cancelled by user.");
        },
      },
    };

    if (!window.Razorpay) {
      throw new Error("Razorpay SDK not loaded");
    }

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    const validationError = validate();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setLoading(true);

    try {
      const isNewOrEditedAddress = !selectedAddressId;
      if (isNewOrEditedAddress && saveAddressToBook) {
        try {
          await saveAddressToDb();
        } catch (addrErr) {
          console.warn("Address save warning (continuing order):", addrErr);
        }
      }

      const cleanAddress = buildCleanAddress();
      const cleanEmail = cleanText(shippingAddress.email).toLowerCase();

      const orderPayload = {
        shippingAddress: cleanAddress,
        billingAddress: cleanAddress,
        paymentMethod,
        email: cleanEmail,
        customerNote:
          paymentMethod === "razorpay"
            ? "Customer selected Razorpay online payment."
            : "Customer selected Cash on Delivery.",
      };

      const orderResponse = await orderService.createOrder(orderPayload);
      const createdOrder = extractOrder(orderResponse);

      if (!createdOrder?._id) {
        console.error("Order create response:", orderResponse);
        throw new Error("Order created but order data not found.");
      }

      if (paymentMethod === "razorpay") {
        await startRazorpayCheckout(createdOrder);
        return;
      }

      toast.success("Order placed successfully.");
      navigate("/account", { replace: true });
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Checkout failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500";

  return (
    <div className="min-h-screen bg-[#fffaf0] px-3 py-5 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="mb-5 flex items-center gap-2 text-sm text-gray-500">
          <MapPin className="h-4 w-4" />
          <span>Address</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <CreditCard className="h-4 w-4" />
          <span>Payment</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <CheckCircle2 className="h-4 w-4" />
          <span>Confirm</span>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.9fr)]">
          <form
            onSubmit={handleSubmit}
            className="rounded-md border border-gray-200 bg-white p-4 sm:p-6"
          >
            <SectionTitle
              icon={MapPin}
              title="Shipping Address"
              subtitle="Select a saved address or add a new one."
            />

            {addressesLoading ? (
              <div className="mt-6 flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
              </div>
            ) : (
              <>
                {addresses.length > 0 && !showAddressForm && (
                  <div className="mt-4 space-y-3">
                    {addresses.map((addr) => {
                      const selected = selectedAddressId === addr._id;
                      const LabelIcon = getLabelIcon(addr.label);
                      return (
                        <div
                          key={addr._id}
                          className={`cursor-pointer rounded-md border p-4 transition ${
                            selected
                              ? "border-teal-500 bg-teal-50"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                          onClick={() => handleSelectSavedAddress(addr)}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              readOnly
                              checked={selected}
                              className="mt-1 h-4 w-4 accent-teal-600"
                            />

                            <div className="min-w-0 flex-1">
                              <div className="mb-1 flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1 rounded border border-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
                                  <LabelIcon className="h-3 w-3" />
                                  {addr.label || "Home"}
                                </span>
                                {addr.isDefault && (
                                  <span className="rounded border border-teal-200 bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-700">
                                    Default
                                  </span>
                                )}
                              </div>

                              <p className="text-sm font-semibold text-gray-900">
                                {addr.fullName}
                              </p>
                              <p className="mt-0.5 text-sm text-gray-600">
                                {addr.addressLine1}
                                {addr.addressLine2
                                  ? `, ${addr.addressLine2}`
                                  : ""}
                              </p>
                              {addr.landmark && (
                                <p className="text-xs text-gray-500">
                                  Landmark: {addr.landmark}
                                </p>
                              )}
                              <p className="text-sm text-gray-600">
                                {addr.city}, {addr.state} — {addr.pincode}
                              </p>
                              <p className="mt-1 text-sm text-gray-700">
                                {addr.phone}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartEdit(addr);
                              }}
                              className="shrink-0 rounded border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:border-teal-300 hover:text-teal-700"
                            >
                              <Edit2 className="mr-1 inline h-3.5 w-3.5" />
                              Edit
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      onClick={handleStartAddNew}
                      className="w-full rounded-md border border-dashed border-gray-300 p-3 text-sm font-medium text-gray-600 hover:border-teal-400 hover:text-teal-700"
                    >
                      <Plus className="mr-1 inline h-4 w-4" />
                      Add a new address
                    </button>
                  </div>
                )}

                {showAddressForm && (
                  <div className="mt-4 space-y-4 rounded-md border border-gray-200 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {editingAddressId
                          ? "Edit delivery address"
                          : "Add new delivery address"}
                      </h3>

                      {addresses.length > 0 && (
                        <button
                          type="button"
                          onClick={handleCancelForm}
                          className="rounded border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {LABEL_OPTIONS.map((label) => (
                        <button
                          type="button"
                          key={label}
                          onClick={() =>
                            setShippingAddress((p) => ({ ...p, label }))
                          }
                          className={`rounded-md border px-3 py-1.5 text-xs font-medium transition ${
                            shippingAddress.label === label
                              ? "border-teal-600 bg-teal-600 text-white"
                              : "border-gray-200 text-gray-600 hover:border-teal-300"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Full Name" icon={User}>
                        <input
                          name="fullName"
                          value={shippingAddress.fullName}
                          onChange={handleChange}
                          required
                          autoComplete="name"
                          placeholder="Rahul Sharma"
                          className={inputClass}
                        />
                      </Field>

                      <Field label="Email Address" icon={Mail}>
                        <input
                          type="email"
                          name="email"
                          value={shippingAddress.email}
                          onChange={handleChange}
                          required
                          autoComplete="email"
                          placeholder="you@example.com"
                          className={inputClass}
                        />
                      </Field>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-[0.8fr_1.2fr]">
                      <Field label="Phone Number" icon={Phone}>
                        <input
                          name="phone"
                          inputMode="numeric"
                          value={shippingAddress.phone}
                          onChange={handleChange}
                          required
                          maxLength={10}
                          autoComplete="tel"
                          placeholder="9876543210"
                          className={inputClass}
                        />
                      </Field>

                      <Field label="Landmark" icon={Landmark} optional>
                        <input
                          name="landmark"
                          value={shippingAddress.landmark}
                          onChange={handleChange}
                          placeholder="Near metro station"
                          className={inputClass}
                        />
                      </Field>
                    </div>

                    <Field label="Address Line 1" icon={Home}>
                      <input
                        name="addressLine1"
                        value={shippingAddress.addressLine1}
                        onChange={handleChange}
                        required
                        autoComplete="address-line1"
                        placeholder="House no, street, area"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Address Line 2" optional>
                      <input
                        name="addressLine2"
                        value={shippingAddress.addressLine2}
                        onChange={handleChange}
                        autoComplete="address-line2"
                        placeholder="Apartment, floor, nearby place"
                        className={inputClass}
                      />
                    </Field>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <Field label="City">
                        <input
                          name="city"
                          value={shippingAddress.city}
                          onChange={handleChange}
                          required
                          autoComplete="address-level2"
                          placeholder="Delhi"
                          className={inputClass}
                        />
                      </Field>

                      <Field label="State">
                        <input
                          name="state"
                          value={shippingAddress.state}
                          onChange={handleChange}
                          required
                          autoComplete="address-level1"
                          placeholder="Delhi"
                          className={inputClass}
                        />
                      </Field>

                      <Field label="Pincode">
                        <input
                          name="pincode"
                          inputMode="numeric"
                          value={shippingAddress.pincode}
                          onChange={handleChange}
                          required
                          maxLength={6}
                          autoComplete="postal-code"
                          placeholder="110001"
                          className={inputClass}
                        />
                      </Field>
                    </div>

                    <label className="flex items-start gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={saveAddressToBook}
                        onChange={(e) => setSaveAddressToBook(e.target.checked)}
                        className="mt-0.5 h-4 w-4 accent-teal-600"
                      />
                      Save this address for next time
                    </label>
                  </div>
                )}
              </>
            )}

            <div className="my-6 border-t border-gray-200" />

            <SectionTitle
              icon={WalletCards}
              title="Payment Method"
              subtitle="Choose how you want to pay."
            />

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                const active = paymentMethod === method.id;

                return (
                  <label
                    key={method.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-md border p-4 transition ${
                      active
                        ? "border-teal-500 bg-teal-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={active}
                      onChange={(event) => setPaymentMethod(event.target.value)}
                      className="mt-1 h-4 w-4 accent-teal-600"
                    />

                    <Icon className="mt-0.5 h-5 w-5 text-gray-500" />

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900">
                          {method.title}
                        </p>
                        <span className="rounded border border-gray-200 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                          {method.badge}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {method.description}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="mt-4 flex gap-2 rounded-md border border-amber-200 bg-amber-50 p-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <p className="text-xs leading-5 text-amber-800">
                Online payment uses Razorpay secure checkout. Do not refresh
                while payment is processing.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || savingAddress || addressesLoading}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading || savingAddress ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {savingAddress ? "Saving address..." : "Processing order..."}
                </>
              ) : (
                <>
                  <LockKeyhole className="h-4 w-4" />
                  {paymentMethod === "razorpay"
                    ? "Pay & place order"
                    : "Place COD order"}
                </>
              )}
            </button>
          </form>

          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-md border border-gray-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-gray-900">
                Order Summary
              </h3>

              <div className="mt-3 space-y-2 text-sm">
                <SummaryRow
                  label={`Subtotal (${cartSummary.itemCount || 0} items)`}
                  value={money(cartSummary.subtotal)}
                />
                <SummaryRow
                  label="Delivery"
                  value={
                    cartSummary.shipping === 0
                      ? "FREE"
                      : money(cartSummary.shipping)
                  }
                  highlight={cartSummary.shipping === 0}
                />
                <SummaryRow
                  label="GST estimate"
                  value={money(cartSummary.gst)}
                />
              </div>

              <div className="my-3 border-t border-gray-200" />

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">
                  Total payable
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {money(cartSummary.total)}
                </span>
              </div>

              {cartSummary.subtotal < 999 && (
                <p className="mt-2 text-xs text-gray-500">
                  Add {money(Math.max(0, 999 - cartSummary.subtotal))} more for
                  free delivery.
                </p>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="rounded-md border border-gray-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Items in cart
                  </h3>
                  <span className="text-xs text-gray-500">
                    {cartSummary.itemCount} items
                  </span>
                </div>

                <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                  {cartItems.slice(0, 5).map((item, index) => (
                    <div
                      key={item?._id || item?.id || index}
                      className="flex items-center gap-3 rounded border border-gray-100 p-2"
                    >
                      <img
                        src={getProductImage(item)}
                        alt={getProductName(item)}
                        className="h-12 w-12 rounded object-cover"
                        onError={(event) => {
                          event.currentTarget.src = "/images/placeholder.jpg";
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-sm font-medium text-gray-900">
                          {getProductName(item)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty {item?.quantity || 1}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        {money(
                          getProductPrice(item) * Number(item?.quantity || 1),
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-md border border-gray-200 bg-white p-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-teal-600" />
                <h3 className="text-sm font-semibold text-gray-900">
                  Payment Safety
                </h3>
              </div>

              <div className="mt-3 space-y-2 text-sm">
                <InfoRow
                  label="Selected payment"
                  value={selectedPayment?.title || "-"}
                />
                <InfoRow
                  label="Gateway"
                  value={paymentMethod === "razorpay" ? "Razorpay" : "COD"}
                />
                <InfoRow
                  label="Environment"
                  value={
                    import.meta.env.VITE_RAZORPAY_ENV === "production"
                      ? "Production"
                      : "Test"
                  }
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-5 w-5 text-teal-600" />
      <div>
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, children, optional = false }) {
  return (
    <label className="block">
      <span className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
        {Icon && <Icon className="h-3.5 w-3.5 text-gray-400" />}
        {label}
        {optional && <span className="text-gray-400">(Optional)</span>}
      </span>
      {children}
    </label>
  );
}

function SummaryRow({ label, value, highlight = false }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span
        className={`font-medium ${highlight ? "text-teal-600" : "text-gray-900"}`}
      >
        {value}
      </span>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="text-right font-medium text-gray-900">{value}</span>
    </div>
  );
}
