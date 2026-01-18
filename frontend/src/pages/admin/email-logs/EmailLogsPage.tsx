"use client";

import { useEffect, useState } from "react";
import {
  Mail,
  CheckCircle,
  AlertCircle,
  Search,
  X,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Copy,
  ExternalLink,
  Download,
  RotateCw,
} from "lucide-react";
import { emailLogService } from "../../../services/admin/admin.emailLog.service";
import type {
  EmailLog,
  EmailLogType,
  EmailLogStatus,
} from "../../../types/admin/email-log.types";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/admin/sideBar";

interface StatCard {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
}

export default function EmailLogsPage() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({
    dateRange: "Last 7 days",
    emailType: "" as EmailLogType | "",
    status: "" as EmailLogStatus | "",
    recipientEmail: "",
  });

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const logsData = await emailLogService.getAll();
      console.log("Fetched logs:", logsData);
      setLogs(logsData);
    } catch (error) {
      console.error("Failed to fetch email logs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create IDs for selection
  const logsWithIds = logs.map((log, index) => ({
    ...log,
    id: index + 1,
  }));

  console.log("Processed logs with IDs:", logsWithIds);

  const filteredLogs = logsWithIds.filter(
    (log) =>
      (searchTerm === "" ||
        log.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.error && log.error.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (filters.status === "" || log.status === filters.status) &&
      (filters.emailType === "" || log.type === filters.emailType) &&
      (filters.recipientEmail === "" ||
        log.to.toLowerCase().includes(filters.recipientEmail.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredLogs.length / rowsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSelectRow = (id: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedLogs.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedLogs.map((log) => log.id)));
    }
  };

  // Helper function to safely get timestamp
  const getTimestamp = (log: EmailLog) => {
    const timestamp = (log as any).timeStamp || log.timeStamp;
    return timestamp || new Date().toISOString();
  };

  const stats: StatCard[] = [
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Total Emails",
      value: logs.length,
      color: "from-blue-600 to-blue-700",
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      label: "Sent",
      value: logs.filter((l) => l.status === "SENT").length,
      color: "from-green-600 to-green-700",
    },
    {
      icon: <AlertCircle className="w-5 h-5" />,
      label: "Failed",
      value: logs.filter((l) => l.status === "FAILED").length,
      color: "from-red-600 to-red-700",
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Test Emails",
      value: logs.filter((l) => l.type === "TEST").length,
      color: "from-indigo-600 to-indigo-700",
    },
  ];

  const getTypeBadge = (type: EmailLogType) => {
    switch (type) {
      case "TEST":
        return {
          className: "bg-indigo-100 text-indigo-700",
          label: "Test",
        };
      case "REAL":
        return {
          className: "bg-green-100 text-green-700",
          label: "Real",
        };
    }
  };

  const formatDateTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      console.error("Error formatting date:", error, timestamp);
      return "Invalid date";
    }
  };

  const handleExportLogs = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Type,To,Subject,Status,Time,Error\n"
      + logs.map(log => 
          `${log.type},${log.to},${log.subject},${log.status},${getTimestamp(log)},${log.error || ''}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `email-logs-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNavigateToTemplates = () => {
    navigate('/admin/email-templates');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-gray-600">Loading email logs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Now properly positioned as the main layout container */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <span>Admin</span>
                <span>›</span>
                <span>Notifications & Email Management</span>
                <span>›</span>
                <span className="text-gray-900 font-medium">Email Logs</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Mail className="w-8 h-8 text-indigo-600" />
                Email Logs
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={handleNavigateToTemplates}
              >
                <Mail size={18} />
                Email Templates
              </Button>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => fetchLogs()}
              >
                <RotateCw size={18} />
                Refresh
              </Button>
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                onClick={handleExportLogs}
              >
                <Download size={18} />
                Export CSV
              </Button>
            </div>
          </div>
          <p className="text-gray-600">
            View and audit all outgoing emails in real-time
          </p>
        </div>

        {/* Stats Grid */}
        <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-2">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg text-white`}
                >
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Area with Scroll */}
        <div className="flex-1 overflow-auto px-8 pb-8">
          {/* Search and Filters Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
              <div className="flex-1 w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by recipient, subject, or error..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full lg:w-auto">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2"
                >
                  <Filter size={18} />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </Button>
                
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={10}>10 rows</option>
                  <option value={20}>20 rows</option>
                  <option value={50}>50 rows</option>
                </select>
              </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Date Range
                    </label>
                    <select
                      value={filters.dateRange}
                      onChange={(e) =>
                        setFilters({ ...filters, dateRange: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                      <option>Last 90 days</option>
                      <option>All time</option>
                    </select>
                  </div>

                  {/* Email Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Email Type
                    </label>
                    <select
                      value={filters.emailType}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          emailType: e.target.value as EmailLogType | "",
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">All Types</option>
                      <option value="TEST">Test</option>
                      <option value="REAL">Real</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          status: e.target.value as EmailLogStatus | "",
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">All Status</option>
                      <option value="SENT">Sent</option>
                      <option value="FAILED">Failed</option>
                    </select>
                  </div>

                  {/* Recipient Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Recipient Email
                    </label>
                    <input
                      type="text"
                      placeholder="Filter by email"
                      value={filters.recipientEmail}
                      onChange={(e) =>
                        setFilters({ ...filters, recipientEmail: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button
                    variant="ghost"
                    onClick={() =>
                      setFilters({
                        dateRange: "Last 7 days",
                        emailType: "",
                        status: "",
                        recipientEmail: "",
                      })
                    }
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <X size={16} className="mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Email Logs Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {selectedRows.size > 0 && (
              <div className="bg-indigo-50 border-b border-indigo-200 px-6 py-4 flex items-center justify-between">
                <div className="text-sm text-indigo-700">
                  {selectedRows.size} email{selectedRows.size !== 1 ? 's' : ''} selected
                </div>
                <Button 
                  size="sm" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                >
                  <RotateCw size={16} />
                  Resend Selected
                </Button>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectedRows.size === paginatedLogs.length &&
                          paginatedLogs.length > 0
                        }
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700 text-sm">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700 text-sm">
                      To
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700 text-sm">
                      Subject
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700 text-sm">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700 text-sm">
                      Time
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700 text-sm">
                      Error
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700 text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedLogs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Mail className="w-12 h-12 text-gray-300" />
                          <div>
                            <p className="text-gray-500 font-medium">No email logs found</p>
                            <p className="text-gray-400 text-sm mt-1">
                              {searchTerm || Object.values(filters).some(f => f) 
                                ? "Try adjusting your search or filters" 
                                : "No emails have been sent yet"}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedLogs.map((log) => {
                      console.log("EMAIL STATUS FROM API:", log.status);

                      const typeBadge = getTypeBadge(log.type);
                      const isSent = log.status === "SENT";
                      const timestamp = getTimestamp(log);
                      
                      console.log(`Log ${log.id}:`, { 
                        status: log.status, 
                        isSent, 
                        type: log.type,
                        timestamp 
                      });

                      return (
                        <tr
                          key={log.id}
                          className={`hover:bg-gray-50 transition-colors ${
                            selectedRows.has(log.id) ? "bg-indigo-50" : ""
                          }`}
                        >
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedRows.has(log.id)}
                              onChange={() => handleSelectRow(log.id)}
                              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                          </td>
                          
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${typeBadge.className}`}
                            >
                              {typeBadge.label}
                            </span>
                          </td>
                          
                          <td className="px-6 py-4">
                            <div className="text-gray-900 font-medium truncate max-w-[200px]">
                              {log.to}
                            </div>
                          </td>
                          
                          <td className="px-6 py-4">
                            <div className="text-gray-700 truncate max-w-[300px]" title={log.subject}>
                              {log.subject}
                            </div>
                          </td>
                          
                          <td className="px-6 py-4">
                            <div 
                              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                                isSent 
                                  ? "bg-green-50 text-green-700 border border-green-200" 
                                  : "bg-red-50 text-red-700 border border-red-200"
                              }`}
                              title={`Status: ${log.status}`}
                            >
                              {isSent ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <AlertCircle className="w-4 h-4" />
                              )}
                              <span className="font-medium">
                                {isSent ? "Sent" : "Failed"}
                              </span>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 text-gray-500 text-sm">
                            <div className="whitespace-nowrap" title={new Date(timestamp).toLocaleString()}>
                              {formatDateTime(timestamp)}
                            </div>
                          </td>
                          
                          <td className="px-6 py-4">
                            {log.error ? (
                              <div className="text-red-600 text-sm truncate max-w-[200px]" title={log.error}>
                                {log.error}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">-</span>
                            )}
                          </td>
                          
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="View Details"
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Copy Email Address"
                                onClick={() => {
                                  navigator.clipboard.writeText(log.to);
                                  // You could add a toast notification here
                                }}
                              >
                                <Copy size={18} />
                              </button>
                              <button
                                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Compose Email"
                                onClick={() =>
                                  window.open(`mailto:${log.to}`, "_blank")
                                }
                              >
                                <ExternalLink size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                {filteredLogs.length === 0
                  ? "No logs found"
                  : `Showing ${
                      (currentPage - 1) * rowsPerPage + 1
                    } to ${Math.min(
                      currentPage * rowsPerPage,
                      filteredLogs.length
                    )} of ${filteredLogs.length} emails`}
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="gap-2"
                >
                  <ChevronLeft size={18} />
                  Previous
                </Button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === pageNum
                            ? "bg-indigo-600 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="gap-2"
                >
                  Next
                  <ChevronRight size={18} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}