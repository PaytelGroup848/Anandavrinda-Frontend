import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  Trash2,
  User,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { adminService } from '../../../services/admin';

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'new', label: 'New' },
  { value: 'read', label: 'Read' },
  { value: 'replied', label: 'Replied' },
  { value: 'closed', label: 'Closed' },
];

const SUBJECT_OPTIONS = [
  { value: '', label: 'All Subjects' },
  { value: 'general', label: 'General Inquiry' },
  { value: 'order', label: 'Order Issue' },
  { value: 'product', label: 'Product Question' },
  { value: 'vendor', label: 'Vendor Inquiry' },
  { value: 'other', label: 'Other' },
];

const SUBJECT_LABELS = {
  general: 'General Inquiry',
  order: 'Order Issue',
  product: 'Product Question',
  vendor: 'Vendor Inquiry',
  other: 'Other',
};

const statusClass = {
  new: 'bg-blue-50 text-blue-700 ring-blue-200',
  read: 'bg-yellow-50 text-yellow-700 ring-yellow-200',
  replied: 'bg-green-50 text-green-700 ring-green-200',
  closed: 'bg-gray-50 text-gray-700 ring-gray-200',
};

function extractApiPayload(response) {
  const root = response || {};
  if (root?.data?.data) return root.data.data;
  if (root?.data) return root.data;
  return root;
}

function formatDate(date) {
  if (!date) return '-';

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return '-';
  }

  return parsed.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function GetInTouch() {
  const [stats, setStats] = useState(null);
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);

  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    subject: '',
    page: 1,
    limit: 10,
  });

  const [adminNotes, setAdminNotes] = useState('');

  const fetchAll = async () => {
    try {
      setLoading(true);

      const [statsRes, queriesRes] = await Promise.all([
        adminService.getContactStats(),
        adminService.getContactQueries(filters),
      ]);

      const statsPayload = extractApiPayload(statsRes);
      const queriesPayload = extractApiPayload(queriesRes);

      setStats(statsPayload?.stats || null);
      setQueries(Array.isArray(queriesPayload?.queries) ? queriesPayload.queries : []);
    } catch (error) {
      console.error('Get in touch fetch error:', error);
      toast.error(error?.response?.data?.message || 'Failed to fetch contact queries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.subject, filters.page]);

  const handleSearch = async () => {
    try {
      setLoading(true);

      const queriesRes = await adminService.getContactQueries({
        ...filters,
        page: 1,
      });

      const queriesPayload = extractApiPayload(queriesRes);
      setQueries(Array.isArray(queriesPayload?.queries) ? queriesPayload.queries : []);
    } catch (error) {
      console.error('Get in touch search error:', error);
      toast.error(error?.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const openQuery = async (queryItem) => {
    try {
      setDetailLoading(true);

      const response = await adminService.getContactQueryById(queryItem._id);
      const payload = extractApiPayload(response);
      const query = payload?.query || null;

      setSelectedQuery(query);
      setAdminNotes(query?.adminNotes || '');

      if (query?.status === 'new') {
        await updateQuery(query._id, { status: 'read' }, { silent: true });
      }
    } catch (error) {
      console.error('Open query error:', error);
      toast.error(error?.response?.data?.message || 'Failed to open query');
    } finally {
      setDetailLoading(false);
    }
  };

  const updateQuery = async (id, data, options = {}) => {
    try {
      if (!options.silent) {
        setSaving(true);
      }

      const response = await adminService.updateContactQuery(id, data);
      const payload = extractApiPayload(response);
      const updatedQuery = payload?.query;

      if (updatedQuery) {
        setSelectedQuery(updatedQuery);
        setAdminNotes(updatedQuery.adminNotes || '');

        setQueries((prev) =>
          prev.map((item) => (item._id === updatedQuery._id ? updatedQuery : item))
        );
      }

      if (!options.silent) {
        toast.success('Query updated');
      }
    } catch (error) {
      console.error('Update query error:', error);
      if (!options.silent) {
        toast.error(error?.response?.data?.message || 'Update failed');
      }
    } finally {
      if (!options.silent) {
        setSaving(false);
      }
    }
  };

  const saveNotes = async () => {
    if (!selectedQuery) return;

    await updateQuery(selectedQuery._id, {
      adminNotes: adminNotes.trim(),
    });
  };

  const deleteQuery = async (id) => {
    const ok = window.confirm('Are you sure you want to delete this query?');
    if (!ok) return;

    try {
      await adminService.deleteContactQuery(id);

      setQueries((prev) => prev.filter((item) => item._id !== id));

      if (selectedQuery?._id === id) {
        setSelectedQuery(null);
        setAdminNotes('');
      }

      toast.success('Query deleted');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Delete failed');
    }
  };

  const selectedSubjectLabel = useMemo(() => {
    if (!selectedQuery) return '';
    return SUBJECT_LABELS[selectedQuery.subject] || selectedQuery.subject;
  }, [selectedQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-wider text-teal-600">
            Get in Touch
          </p>
          <h1 className="text-3xl font-black text-gray-950">Contact Queries</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage messages submitted from the Contact Us page.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAll}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-slate-800"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <StatCard icon={MessageSquare} title="Total" value={stats?.total || 0} />
        <StatCard icon={AlertCircle} title="New" value={stats?.new || 0} />
        <StatCard icon={Clock} title="Read" value={stats?.read || 0} />
        <StatCard icon={CheckCircle2} title="Replied" value={stats?.replied || 0} />
        <StatCard icon={CheckCircle2} title="Closed" value={stats?.closed || 0} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <input
                value={filters.search}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, search: event.target.value }))
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handleSearch();
                }}
                placeholder="Search name, email or message..."
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm font-semibold outline-none focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
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
              className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold outline-none"
            >
              {STATUS_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            <select
              value={filters.subject}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  subject: event.target.value,
                  page: 1,
                }))
              }
              className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold outline-none"
            >
              {SUBJECT_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleSearch}
              className="rounded-2xl bg-teal-600 px-5 py-3 text-sm font-black text-white hover:bg-teal-700"
            >
              Search
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {loading ? (
              <div className="flex h-48 items-center justify-center">
                <Loader2 className="h-7 w-7 animate-spin text-gray-400" />
              </div>
            ) : queries.length === 0 ? (
              <div className="rounded-2xl bg-gray-50 p-8 text-center">
                <p className="font-black text-gray-800">No queries found</p>
                <p className="mt-1 text-sm text-gray-500">
                  Contact form submissions will appear here.
                </p>
              </div>
            ) : (
              queries.map((queryItem) => (
                <button
                  key={queryItem._id}
                  type="button"
                  onClick={() => openQuery(queryItem)}
                  className={`w-full rounded-2xl border p-4 text-left transition hover:border-teal-300 hover:bg-teal-50/40 ${
                    selectedQuery?._id === queryItem._id
                      ? 'border-teal-400 bg-teal-50'
                      : 'border-gray-100 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase text-gray-400">
                        #{queryItem.queryId}
                      </p>
                      <h3 className="mt-1 font-black text-gray-950">{queryItem.name}</h3>
                      <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                        <Mail className="h-3 w-3" />
                        {queryItem.email}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                        {queryItem.message}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        deleteQuery(queryItem._id);
                      }}
                      className="rounded-xl p-2 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge className={statusClass[queryItem.status]}>
                      {queryItem.status}
                    </Badge>
                    <Badge className="bg-gray-50 text-gray-600 ring-gray-200">
                      {SUBJECT_LABELS[queryItem.subject] || queryItem.subject}
                    </Badge>
                    <Badge className="bg-gray-50 text-gray-600 ring-gray-200">
                      {formatDate(queryItem.createdAt)}
                    </Badge>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          {!selectedQuery ? (
            <div className="flex h-full min-h-[520px] items-center justify-center rounded-2xl bg-gray-50 text-center">
              <div>
                <MessageSquare className="mx-auto h-10 w-10 text-gray-300" />
                <h3 className="mt-4 font-black text-gray-800">Select a query</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Open any contact query to view details and update status.
                </p>
              </div>
            </div>
          ) : detailLoading ? (
            <div className="flex h-[520px] items-center justify-center">
              <Loader2 className="h-7 w-7 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="space-y-5">
              <div className="border-b border-gray-100 pb-4">
                <p className="text-xs font-black uppercase text-gray-400">
                  #{selectedQuery.queryId}
                </p>
                <h2 className="mt-1 text-xl font-black text-gray-950">
                  {selectedSubjectLabel}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Received: {formatDate(selectedQuery.createdAt)}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <InfoRow icon={User} label="Name" value={selectedQuery.name} />
                <InfoRow icon={Mail} label="Email" value={selectedQuery.email} />
                <InfoRow
                  icon={Phone}
                  label="Phone"
                  value={selectedQuery.phone || '-'}
                />
                <InfoRow icon={MessageSquare} label="Subject" value={selectedSubjectLabel} />
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs font-black uppercase text-gray-400">Message</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-800">
                  {selectedQuery.message}
                </p>
              </div>

              <div>
                <label className="text-sm font-black text-gray-700">Status</label>
                <select
                  value={selectedQuery.status}
                  onChange={(event) =>
                    updateQuery(selectedQuery._id, { status: event.target.value })
                  }
                  disabled={saving}
                  className="mt-1.5 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold outline-none"
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-black text-gray-700">Admin Notes</label>
                <textarea
                  value={adminNotes}
                  onChange={(event) => setAdminNotes(event.target.value)}
                  rows={4}
                  placeholder="Internal notes about this query..."
                  className="mt-1.5 w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm font-semibold outline-none focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
                />
                <button
                  type="button"
                  onClick={saveNotes}
                  disabled={saving}
                  className="mt-3 inline-flex w-full items-center justify-center rounded-2xl bg-teal-600 px-5 py-3 text-sm font-black text-white hover:bg-teal-700 disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value }) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50">
        <Icon className="h-5 w-5 text-teal-600" />
      </div>
      <p className="mt-4 text-sm font-bold text-gray-500">{title}</p>
      <p className="mt-1 text-2xl font-black text-gray-950">{value}</p>
    </div>
  );
}

function Badge({ children, className }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-black uppercase ring-1 ${className}`}
    >
      {children}
    </span>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
      <div className="flex items-center gap-2 text-xs font-black uppercase text-gray-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="mt-1 text-sm font-semibold text-gray-800">{value}</p>
    </div>
  );
}
