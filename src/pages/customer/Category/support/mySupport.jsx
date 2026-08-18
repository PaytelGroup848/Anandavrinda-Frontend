import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileQuestion,
  Loader2,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  Send,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import supportService from "../../../../services/support";

const CATEGORY_OPTIONS = [
  { value: "order", label: "Order Issue" },
  { value: "payment", label: "Payment Issue" },
  { value: "refund", label: "Refund Issue" },
  { value: "delivery", label: "Delivery Issue" },
  { value: "product", label: "Product Issue" },
  { value: "account", label: "Account Issue" },
  { value: "technical", label: "Technical Issue" },
  { value: "other", label: "Other" },
];

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

const statusStyle = {
  open: "bg-blue-50 text-blue-700 ring-blue-200",
  in_progress: "bg-yellow-50 text-yellow-700 ring-yellow-200",
  resolved: "bg-green-50 text-green-700 ring-green-200",
  closed: "bg-gray-50 text-gray-700 ring-gray-200",
};

const priorityStyle = {
  low: "bg-gray-50 text-gray-700 ring-gray-200",
  medium: "bg-blue-50 text-blue-700 ring-blue-200",
  high: "bg-orange-50 text-orange-700 ring-orange-200",
  urgent: "bg-red-50 text-red-700 ring-red-200",
};

function extractPayload(response) {
  const root = response || {};
  if (root?.data?.data) return root.data.data;
  if (root?.data) return root.data;
  return root;
}

function formatDate(date) {
  if (!date) return "-";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  return parsed.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MySupport() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
  });

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    page: 1,
    limit: 10,
  });

  const [form, setForm] = useState({
    subject: "",
    category: "other",
    priority: "medium",
    message: "",
  });

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.page]);

  const filteredStats = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter((ticket) => ticket.status === "open").length;
    const inProgress = tickets.filter(
      (ticket) => ticket.status === "in_progress",
    ).length;
    const resolved = tickets.filter(
      (ticket) => ticket.status === "resolved",
    ).length;

    return {
      total,
      open,
      inProgress,
      resolved,
    };
  }, [tickets]);

  useEffect(() => {
    setStats(filteredStats);
  }, [filteredStats]);

  const fetchTickets = async () => {
    try {
      setLoading(true);

      const response = await supportService.getMyTickets(filters);
      const payload = extractPayload(response);

      setTickets(Array.isArray(payload?.tickets) ? payload.tickets : []);
    } catch (error) {
      console.error("My support fetch error:", error);
      toast.error(error?.response?.data?.message || "Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    await fetchTickets();
  };

  const validateForm = () => {
    if (form.subject.trim().length < 5) {
      return "Subject must be at least 5 characters.";
    }

    if (form.message.trim().length < 5) {
      return "Message must be at least 5 characters.";
    }

    if (!CATEGORY_OPTIONS.some((item) => item.value === form.category)) {
      return "Please select a valid category.";
    }

    if (!PRIORITY_OPTIONS.some((item) => item.value === form.priority)) {
      return "Please select a valid priority.";
    }

    return "";
  };

  const createTicket = async (event) => {
    event.preventDefault();

    const errorMessage = validateForm();

    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    try {
      setCreating(true);

      const response = await supportService.createTicket({
        subject: form.subject.trim(),
        category: form.category,
        priority: form.priority,
        message: form.message.trim(),
      });

      const payload = extractPayload(response);
      const newTicket = payload?.ticket;

      if (newTicket) {
        setTickets((prev) => [newTicket, ...prev]);
      } else {
        await fetchTickets();
      }

      setForm({
        subject: "",
        category: "other",
        priority: "medium",
        message: "",
      });

      setShowCreate(false);

      toast.success("Support ticket created successfully");
    } catch (error) {
      console.error("Create ticket error:", error);
      toast.error(error?.response?.data?.message || "Failed to create ticket");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf0] px-4 py-6">
      <div className="mx-auto max-w-6xl space-y-5">
        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              My Support Tickets
            </h1>

            <p className="mt-0.5 text-sm text-gray-500">
              Create and track your support requests.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={fetchTickets}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>

            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
            >
              <Plus className="h-4 w-4" />
              New Ticket
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={MessageSquare} title="Total" value={stats.total} />
          <StatCard icon={AlertCircle} title="Open" value={stats.open} />
          <StatCard icon={Clock} title="In Progress" value={stats.inProgress} />
          <StatCard
            icon={CheckCircle2}
            title="Resolved"
            value={stats.resolved}
          />
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-4">
          <div className="grid gap-2 md:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />

              <input
                value={filters.search}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    search: event.target.value,
                  }))
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSearch();
                  }
                }}
                placeholder="Search by subject or ticket id..."
                className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <select
              value={filters.status}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  status: event.target.value,
                  page: 1,
                }))
              }
              className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleSearch}
              className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
            >
              Search
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {loading ? (
              <div className="flex h-48 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : tickets.length === 0 ? (
              <div className="rounded-md border border-gray-200 bg-gray-50 p-8 text-center">
                <FileQuestion className="mx-auto h-10 w-10 text-gray-300" />

                <h2 className="mt-3 text-base font-semibold text-gray-900">
                  No support tickets yet
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Create your first ticket and our support team will help you.
                </p>

                <button
                  type="button"
                  onClick={() => setShowCreate(true)}
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
                >
                  <Plus className="h-4 w-4" />
                  Create Ticket
                </button>
              </div>
            ) : (
              tickets.map((ticket) => (
                <Link
                  key={ticket._id}
                  to={`/account/support/${ticket._id}`}
                  className="block rounded-md border border-gray-200 bg-white p-4 transition hover:border-teal-300 hover:bg-teal-50/40"
                >
                  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                    <div>
                      <p className="text-xs font-medium uppercase text-gray-400">
                        #{ticket.ticketId}
                      </p>

                      <h3 className="mt-0.5 text-sm font-semibold text-gray-900">
                        {ticket.subject}
                      </h3>

                      <p className="mt-1.5 line-clamp-2 text-sm text-gray-500">
                        {ticket.messages?.[ticket.messages.length - 1]
                          ?.message || "No message"}
                      </p>

                      <p className="mt-2 text-xs text-gray-400">
                        Last update:{" "}
                        {formatDate(ticket.lastMessageAt || ticket.updatedAt)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 md:justify-end">
                      <Badge className={statusStyle[ticket.status]}>
                        {String(ticket.status || "").replace("_", " ")}
                      </Badge>

                      <Badge className={priorityStyle[ticket.priority]}>
                        {ticket.priority}
                      </Badge>

                      <Badge className="bg-gray-50 text-gray-600 ring-gray-200">
                        {ticket.category}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-md bg-white p-5">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Create Support Ticket
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Tell us your issue. Admin support team will reply soon.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={createTicket} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-600">
                  Subject
                </label>

                <input
                  value={form.subject}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      subject: event.target.value,
                    }))
                  }
                  placeholder="Example: Payment successful but order not confirmed"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-gray-600">
                    Category
                  </label>

                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        category: event.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  >
                    {CATEGORY_OPTIONS.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600">
                    Priority
                  </label>

                  <select
                    value={form.priority}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        priority: event.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  >
                    {PRIORITY_OPTIONS.map((priority) => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600">
                  Message
                </label>

                <textarea
                  value={form.message}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      message: event.target.value,
                    }))
                  }
                  rows={5}
                  placeholder="Describe your issue clearly..."
                  className="mt-1 w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-teal-600 px-4 py-3 text-sm font-medium text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Ticket...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Create Ticket
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, title, value }) {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-50">
        <Icon className="h-4 w-4 text-teal-600" />
      </div>

      <p className="mt-3 text-xs font-medium text-gray-500">{title}</p>
      <p className="mt-0.5 text-xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function Badge({ children, className }) {
  return (
    <span
      className={`inline-flex rounded px-2 py-0.5 text-[10px] font-medium uppercase ring-1 ${className}`}
    >
      {children}
    </span>
  );
}
