import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Phone, MapPin, Clock, Send, Loader2 } from "lucide-react";

export default function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "general",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Name is required.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "A valid email is required.";
    if (!form.message.trim()) return "Message is required.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    setLoading(true);
    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Message sent successfully!");
      setSubmitted(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "general",
        message: "",
      });
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf0] py-10 sm:py-14 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Get in Touch
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-500 max-w-xl mx-auto">
            Have a question or need help? We'd love to hear from you.
          </p>
        </div>

        {submitted ? (
          /* Success State */
          <div className="max-w-lg mx-auto bg-white rounded-md border border-gray-200 p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-50 text-teal-600 mb-3">
              <Send className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Message Sent!
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              Thank you for reaching out. Our team will respond within 24 hours.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-5 py-2 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-700 transition-colors"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          /* Main Content – Form + Info */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left side – Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-md border border-gray-200 p-5 sm:p-6">
                <h2 className="text-base font-semibold text-gray-900 mb-4">
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        placeholder="Rahul Sharma"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        placeholder="rahul@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Subject
                      </label>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="order">Order Issue</option>
                        <option value="product">Product Question</option>
                        <option value="vendor">Vendor Inquiry</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-md hover:bg-teal-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Right side – Contact Details */}
            <div className="space-y-6">
              <div className="bg-white rounded-md border border-gray-200 p-5 sm:p-6">
                <h2 className="text-base font-semibold text-gray-900 mb-4">
                  Contact Information
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Our Office
                      </p>
                      <p className="text-sm text-gray-500">
                        938, 4th Floor, Ward 3, Gurgaon Village, Gurugram 122001
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Phone</p>
                      <a
                        href="tel:+917042130170"
                        className="text-sm text-gray-500 hover:text-teal-600"
                      >
                        +91 7042130170
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Email</p>
                      <a
                        href="mailto:info@anandavrinda.com"
                        className="text-sm text-gray-500 hover:text-teal-600"
                      >
                        info@anandavrinda.com
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Working Hours
                      </p>
                      <p className="text-sm text-gray-500">
                        Monday – Saturday: 9:00 AM – 6:00 PM
                        <br />
                        Sunday: Closed
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
