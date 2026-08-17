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
  Sparkles,
  BadgeCheck,
  Clock3,
  PackageCheck,
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
    description: "Pay securely using UPI, cards, NetBanking and wallets.",
    badge: "Recommended",
    icon: CreditCard,
    tone: "emerald",
  },
  {
    id: "cod",
    title: "Cash on Delivery",
    description: "Pay safely when your order reaches your doorstep.",
    badge: "Manual",
    icon: Truck,
    tone: "slate",
  },
];

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "Secure payment", value: "256-bit SSL" },
  { icon: PackageCheck, label: "Fast dispatch", value: "Tracked order" },
  { icon: BadgeCheck, label: "Verified quality", value: "Care-grade products" },
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
  const [focusedField, setFocusedField] = useState("");

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

  const progress = useMemo(() => {
    return Math.min(100, Math.round((cartSummary.subtotal / 999) * 100));
  }, [cartSummary.subtotal]);

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

  const getInputClass = (name) => {
    const active = focusedField === name;
    return `w-full mt-1.5 rounded-2xl border px-4 py-3.5 text-sm font-semibold outline-none transition bg-white/90 text-slate-950 placeholder:text-slate-400 ${
      active
        ? "border-teal-400 ring-4 ring-teal-100 shadow-sm"
        : "border-slate-200 hover:border-slate-300 focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
    }`;
  };

  const fieldEvents = (name) => ({
    onFocus: () => setFocusedField(name),
    onBlur: () => setFocusedField(""),
  });

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#ccfbf1,transparent_36%),linear-gradient(135deg,#f8fafc,#ecfeff_45%,#f0fdf4)] px-4 py-6 sm:py-10">
      <div className="pointer-events-none fixed inset-0 opacity-40">
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-teal-200 blur-3xl" />
        <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-emerald-200 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-100 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-black text-slate-600 shadow-sm backdrop-blur hover:bg-white hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <header className="mb-7 overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 p-5 shadow-2xl shadow-teal-100/70 backdrop-blur-xl sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-teal-700 ring-1 ring-teal-100">
                <LockKeyhole className="h-4 w-4" />
                Secure Checkout
              </span>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Complete your order
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Select or add delivery details and pay safely. Online payment
                uses Razorpay Checkout.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-3xl bg-slate-950 p-2 text-white shadow-xl shadow-slate-200 sm:min-w-[420px]">
              {[
                { label: "Address", icon: MapPin, active: true },
                { label: "Payment", icon: CreditCard, active: true },
                { label: "Confirm", icon: CheckCircle2, active: false },
              ].map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.label}
                    className={`rounded-2xl px-3 py-3 text-center ${step.active ? "bg-white text-slate-950" : "text-white/60"}`}
                  >
                    <Icon className="mx-auto h-4 w-4" />
                    <p className="mt-1 text-[11px] font-black uppercase tracking-wider">
                      {index + 1}. {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.85fr)]">
          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-2xl shadow-teal-100/60 backdrop-blur-xl sm:p-8"
          >
            <SectionTitle
              icon={MapPin}
              title="Shipping Details"
              subtitle="Select a saved address or add a new delivery address."
            />

            {addressesLoading ? (
              <div className="mt-6 flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
              </div>
            ) : (
              <>
                {addresses.length > 0 && !showAddressForm && (
                  <div className="mt-6 space-y-3">
                    {addresses.map((addr) => {
                      const selected = selectedAddressId === addr._id;
                      const LabelIcon = getLabelIcon(addr.label);
                      return (
                        <div
                          key={addr._id}
                          className={`relative overflow-hidden rounded-2xl border p-5 transition-all cursor-pointer ${
                            selected
                              ? "border-teal-400 bg-gradient-to-br from-teal-50 to-emerald-50 shadow-lg shadow-teal-100 ring-4 ring-teal-100"
                              : "border-slate-200 bg-white hover:border-teal-200 hover:shadow-md"
                          }`}
                          onClick={() => handleSelectSavedAddress(addr)}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`mt-1 h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center ${selected ? "border-teal-600 bg-teal-600" : "border-slate-300 bg-white"}`}
                            >
                              {selected && (
                                <CheckCircle2 className="h-4 w-4 text-white" />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-600">
                                  <LabelIcon className="h-3 w-3" />
                                  {addr.label || "Home"}
                                </span>
                                {addr.isDefault && (
                                  <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-black text-teal-700 ring-1 ring-teal-100">
                                    Default
                                  </span>
                                )}
                              </div>

                              <p className="font-black text-slate-950 text-sm">
                                {addr.fullName}
                              </p>
                              {addr.email && (
                                <p className="text-xs text-slate-500 mt-0.5">
                                  ✉️ {addr.email}
                                </p>
                              )}
                              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                                {addr.addressLine1}
                                {addr.addressLine2
                                  ? `, ${addr.addressLine2}`
                                  : ""}
                              </p>
                              {addr.landmark && (
                                <p className="text-xs text-slate-500 mt-0.5">
                                  Landmark: {addr.landmark}
                                </p>
                              )}
                              <p className="text-sm text-slate-600 mt-0.5">
                                {addr.city}, {addr.state} — {addr.pincode}
                              </p>
                              <p className="text-sm font-semibold text-slate-700 mt-1">
                                📞 {addr.phone}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartEdit(addr);
                              }}
                              className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-teal-700 hover:border-teal-200 hover:bg-teal-50"
                            >
                              <Edit2 className="h-3.5 w-3.5 inline mr-1" />
                              Edit
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      onClick={handleStartAddNew}
                      className="w-full rounded-2xl border-2 border-dashed border-slate-300 bg-white/50 p-5 text-sm font-black text-slate-600 hover:border-teal-400 hover:bg-teal-50/50 hover:text-teal-700 transition-all"
                    >
                      <Plus className="h-4 w-4 inline mr-2" />+ Add a new
                      address
                    </button>
                  </div>
                )}

                {showAddressForm && (
                  <div className="mt-6 space-y-5 rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-50/60 to-white p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-600 text-white">
                          {editingAddressId ? (
                            <Edit2 className="h-5 w-5" />
                          ) : (
                            <Plus className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-black text-slate-950">
                            {editingAddressId
                              ? "Edit delivery address"
                              : "Add new delivery address"}
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Fill details for this delivery.
                          </p>
                        </div>
                      </div>

                      {addresses.length > 0 && (
                        <button
                          type="button"
                          onClick={handleCancelForm}
                          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
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
                          className={`rounded-xl px-4 py-2 text-xs font-black border transition ${
                            shippingAddress.label === label
                              ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-200"
                              : "bg-white text-slate-600 border-slate-200 hover:border-teal-200"
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
                          className={getInputClass("fullName")}
                          {...fieldEvents("fullName")}
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
                          className={getInputClass("email")}
                          {...fieldEvents("email")}
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
                          className={getInputClass("phone")}
                          {...fieldEvents("phone")}
                        />
                      </Field>

                      <Field label="Landmark" icon={Landmark} optional>
                        <input
                          name="landmark"
                          value={shippingAddress.landmark}
                          onChange={handleChange}
                          placeholder="Near metro station"
                          className={getInputClass("landmark")}
                          {...fieldEvents("landmark")}
                        />
                      </Field>
                    </div>

                    <div>
                      <Field label="Address Line 1" icon={Home}>
                        <input
                          name="addressLine1"
                          value={shippingAddress.addressLine1}
                          onChange={handleChange}
                          required
                          autoComplete="address-line1"
                          placeholder="House no, street, area"
                          className={getInputClass("addressLine1")}
                          {...fieldEvents("addressLine1")}
                        />
                      </Field>
                    </div>

                    <div>
                      <Field label="Address Line 2" optional>
                        <input
                          name="addressLine2"
                          value={shippingAddress.addressLine2}
                          onChange={handleChange}
                          autoComplete="address-line2"
                          placeholder="Apartment, floor, nearby place"
                          className={getInputClass("addressLine2")}
                          {...fieldEvents("addressLine2")}
                        />
                      </Field>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <Field label="City">
                        <input
                          name="city"
                          value={shippingAddress.city}
                          onChange={handleChange}
                          required
                          autoComplete="address-level2"
                          placeholder="Delhi"
                          className={getInputClass("city")}
                          {...fieldEvents("city")}
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
                          className={getInputClass("state")}
                          {...fieldEvents("state")}
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
                          className={getInputClass("pincode")}
                          {...fieldEvents("pincode")}
                        />
                      </Field>
                    </div>

                    <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 cursor-pointer select-none hover:border-teal-200">
                      <input
                        type="checkbox"
                        checked={saveAddressToBook}
                        onChange={(e) => setSaveAddressToBook(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-400"
                      />
                      <div>
                        <p className="text-sm font-black text-slate-900">
                          Save this address for next time
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Stored securely in your account for faster future
                          checkouts.
                        </p>
                      </div>
                    </label>
                  </div>
                )}
              </>
            )}

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            <SectionTitle
              icon={WalletCards}
              title="Payment Method"
              subtitle="Choose the safest payment method for this order."
            />

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                const active = paymentMethod === method.id;

                return (
                  <label
                    key={method.id}
                    className={`group relative cursor-pointer overflow-hidden rounded-3xl border p-5 transition-all ${
                      active
                        ? "border-teal-400 bg-gradient-to-br from-teal-50 to-emerald-50 shadow-xl shadow-teal-100 ring-4 ring-teal-100"
                        : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lg hover:shadow-slate-100"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={active}
                      onChange={(event) => setPaymentMethod(event.target.value)}
                      className="sr-only"
                    />

                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm ring-1 ${active ? "bg-teal-600 text-white ring-teal-500" : "bg-slate-50 text-teal-600 ring-slate-100"}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-black text-slate-950">
                            {method.title}
                          </p>
                          <span
                            className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${method.id === "razorpay" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
                          >
                            {method.badge}
                          </span>
                        </div>
                        <p className="mt-1 text-sm leading-5 text-slate-500">
                          {method.description}
                        </p>
                      </div>

                      <div
                        className={`mt-1 h-5 w-5 rounded-full border-2 ${active ? "border-teal-600 bg-teal-600" : "border-slate-300 bg-white"}`}
                      >
                        {active && (
                          <CheckCircle2 className="h-4 w-4 text-white" />
                        )}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="mt-6 rounded-3xl border border-amber-100 bg-amber-50/80 p-4">
              <div className="flex gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <p className="text-sm leading-6 text-amber-800">
                  Online payment uses Razorpay secure checkout. Do not refresh
                  while payment is processing.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || savingAddress || addressesLoading}
              className="mt-7 flex w-full items-center justify-center gap-3 rounded-3xl bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 px-6 py-4 text-sm font-black uppercase tracking-wide text-white shadow-2xl shadow-teal-200 transition hover:-translate-y-0.5 hover:shadow-teal-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading || savingAddress ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {savingAddress
                    ? "Saving address..."
                    : "Processing secure order..."}
                </>
              ) : (
                <>
                  <LockKeyhole className="h-5 w-5" />
                  {paymentMethod === "razorpay"
                    ? "Pay securely & place order"
                    : "Place COD order"}
                  <ChevronRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-slate-950 text-white shadow-2xl shadow-slate-300">
              <div className="relative p-6">
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-teal-400/30 blur-3xl" />
                <div className="absolute -bottom-20 left-4 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl" />

                <div className="relative">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-teal-100 ring-1 ring-white/10">
                    <Sparkles className="h-3.5 w-3.5" />
                    Order Summary
                  </span>

                  <div className="mt-5 space-y-3">
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

                  <div className="my-5 border-t border-white/10" />

                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-white/50">
                        Total payable
                      </p>
                      <p className="mt-1 text-xs text-white/50">
                        Final amount may be confirmed by backend order.
                      </p>
                    </div>
                    <p className="text-3xl font-black tracking-tight">
                      {money(cartSummary.total)}
                    </p>
                  </div>

                  <div className="mt-5 rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                    <div className="mb-2 flex items-center justify-between text-xs font-bold text-white/70">
                      <span>Free delivery progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-teal-300 to-emerald-300 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-white/50">
                      {cartSummary.subtotal >= 999
                        ? "Free delivery unlocked."
                        : `Add ${money(Math.max(0, 999 - cartSummary.subtotal))} more for free delivery.`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {cartItems.length > 0 && (
              <div className="rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-xl shadow-teal-100/50 backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-black text-slate-950">Items in cart</h3>
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-teal-700">
                    {cartSummary.itemCount} items
                  </span>
                </div>

                <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
                  {cartItems.slice(0, 5).map((item, index) => (
                    <div
                      key={item?._id || item?.id || index}
                      className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3"
                    >
                      <img
                        src={getProductImage(item)}
                        alt={getProductName(item)}
                        className="h-14 w-14 rounded-xl object-cover ring-1 ring-slate-100"
                        onError={(event) => {
                          event.currentTarget.src = "/images/placeholder.jpg";
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-sm font-black text-slate-900">
                          {getProductName(item)}
                        </p>
                        <p className="text-xs text-slate-400">
                          Qty {item?.quantity || 1}
                        </p>
                      </div>
                      <p className="text-sm font-black text-slate-950">
                        {money(
                          getProductPrice(item) * Number(item?.quantity || 1),
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-xl shadow-teal-100/50 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
                  <ShieldCheck className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-black text-slate-950">Payment Safety</h3>
                  <p className="text-xs text-slate-400">
                    Backend verified checkout
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3 rounded-3xl bg-slate-50 p-4">
                <InfoRow
                  label="Selected payment"
                  value={selectedPayment?.title || "-"}
                />
                <InfoRow
                  label="Gateway"
                  value={paymentMethod === "razorpay" ? "Razorpay" : "COD"}
                  green={paymentMethod === "razorpay"}
                />
                <InfoRow
                  label="Environment"
                  value={
                    import.meta.env.VITE_RAZORPAY_ENV === "production"
                      ? "Production"
                      : "Test"
                  }
                />
                <InfoRow
                  label="Order status"
                  value={
                    paymentMethod === "razorpay"
                      ? "After payment verify"
                      : "Pending"
                  }
                />
              </div>

              <div className="mt-4 grid gap-3">
                {TRUST_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">
                          {item.label}
                        </p>
                        <p className="text-xs text-slate-400">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50/90 p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <Clock3 className="mt-0.5 h-5 w-5 text-emerald-700" />
                <p className="text-sm leading-6 text-emerald-800">
                  Test mode me real money deduct nahi hota. Production me live
                  keys, HTTPS domain, callback aur webhook required honge.
                </p>
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
    <div className="flex items-start gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 text-teal-600 ring-1 ring-teal-100">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h2 className="text-lg font-black text-slate-950">{title}</h2>
        <p className="mt-1 text-sm leading-5 text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, children, optional = false }) {
  return (
    <label className="block">
      <span className="flex items-center gap-2 text-sm font-black text-slate-700">
        {Icon && <Icon className="h-4 w-4 text-slate-400" />}
        {label}
        {optional && (
          <span className="text-xs font-bold text-slate-400">Optional</span>
        )}
      </span>
      {children}
    </label>
  );
}

function SummaryRow({ label, value, highlight = false }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-white/55">{label}</span>
      <span
        className={`font-black ${highlight ? "text-emerald-300" : "text-white"}`}
      >
        {value}
      </span>
    </div>
  );
}

function InfoRow({ label, value, green = false }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-slate-500">{label}</span>
      <span
        className={`text-right font-black ${green ? "text-emerald-600" : "text-slate-950"}`}
      >
        {value}
      </span>
    </div>
  );
}
