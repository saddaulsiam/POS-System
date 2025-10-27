import React, { useEffect, useState } from "react";
import api from "../services/api";

interface AuditLog {
  id: number;
  userId: number;
  action: string;
  entity?: string;
  entityId?: number;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    username: string;
    role: string;
  };
}

const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [filters, setFilters] = useState({ userId: "", action: "", entity: "" });

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit };
      if (filters.userId) params.userId = filters.userId;
      if (filters.action) params.action = filters.action;
      if (filters.entity) params.entity = filters.entity;
      const res = await api.get("/audit-logs", { params });
      setLogs(res.data.logs);
      setTotal(res.data.total);
    } catch (err) {
      setLogs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line
  }, [page, filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-4">Audit Log</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          <input
            className="input input-bordered"
            name="userId"
            placeholder="User ID"
            value={filters.userId}
            onChange={handleFilterChange}
          />
          <input
            className="input input-bordered"
            name="action"
            placeholder="Action"
            value={filters.action}
            onChange={handleFilterChange}
          />
          <input
            className="input input-bordered"
            name="entity"
            placeholder="Entity"
            value={filters.entity}
            onChange={handleFilterChange}
          />
        </div>
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">ID</th>
                <th className="p-2">User</th>
                <th className="p-2">Action</th>
                <th className="p-2">Entity</th>
                <th className="p-2">Entity ID</th>
                <th className="p-2">Details</th>
                <th className="p-2">IP</th>
                <th className="p-2">User Agent</th>
                <th className="p-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center p-4">
                    Loading...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center p-4">
                    No logs found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-b">
                    <td className="p-2">{log.id}</td>
                    <td className="p-2">
                      {log.user?.name} ({log.user?.username})
                    </td>
                    <td className="p-2">{log.action}</td>
                    <td className="p-2">{log.entity}</td>
                    <td className="p-2">{log.entityId}</td>
                    <td className="p-2 max-w-xs truncate" title={log.details}>
                      {log.details}
                    </td>
                    <td className="p-2">{log.ipAddress}</td>
                    <td className="p-2 max-w-xs truncate" title={log.userAgent}>
                      {log.userAgent}
                    </td>
                    <td className="p-2">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <span>
            Showing {logs.length} of {total} logs
          </span>
          <div className="flex gap-2">
            <button className="btn btn-sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Prev
            </button>
            <span>Page {page}</span>
            <button className="btn btn-sm" disabled={page * limit >= total} onClick={() => setPage((p) => p + 1)}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogsPage;
