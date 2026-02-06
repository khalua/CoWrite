import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import type { AdminInvitation } from '../../types';

export function AdminInvitationsPage() {
  useAuth();
  const [invitations, setInvitations] = useState<AdminInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [impersonating, setImpersonating] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'expired'>('all');

  useEffect(() => {
    adminApi
      .listInvitations()
      .then((res) => setInvitations(res.data))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load invitations'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleImpersonate = async (invitation: AdminInvitation) => {
    try {
      setImpersonating(invitation.id);
      const res = await adminApi.impersonateInvitation(invitation.id);

      if (res.data.user_created) {
        alert(`New user account created for ${invitation.email}. They can reset their password later.`);
      }

      localStorage.setItem('authToken', res.data.token);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to impersonate');
      setImpersonating(null);
    }
  };

  const filteredInvitations = invitations.filter((inv) => {
    if (filter === 'all') return true;
    if (filter === 'expired') return inv.expired || inv.status === 'expired';
    return inv.status === filter;
  });

  const getStatusBadge = (invitation: AdminInvitation) => {
    if (invitation.expired && invitation.status === 'pending') {
      return (
        <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs font-semibold rounded">
          Expired
        </span>
      );
    }

    switch (invitation.status) {
      case 'accepted':
        return (
          <span className="px-2 py-1 bg-green-900/50 text-green-400 text-xs font-semibold rounded">
            Accepted
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 bg-yellow-900/50 text-yellow-400 text-xs font-semibold rounded">
            Pending
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs font-semibold rounded">
            {invitation.status}
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-yellow-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">All Invitations</h1>
        <div className="flex items-center gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="all">All ({invitations.length})</option>
            <option value="pending">
              Pending ({invitations.filter((i) => i.status === 'pending' && !i.expired).length})
            </option>
            <option value="accepted">
              Accepted ({invitations.filter((i) => i.status === 'accepted').length})
            </option>
            <option value="expired">
              Expired ({invitations.filter((i) => i.expired || i.status === 'expired').length})
            </option>
          </select>
          <span className="text-gray-400">{filteredInvitations.length} invitations</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700/50 border-b border-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                Circle
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                Invited By
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                Expires
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                Sent
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredInvitations.map((invitation) => (
              <tr key={invitation.id} className="hover:bg-gray-700/50">
                <td className="px-6 py-4">
                  <p className="font-medium text-white">{invitation.email}</p>
                </td>
                <td className="px-6 py-4">
                  <Link
                    to={`/admin/circles/${invitation.circle.id}`}
                    className="text-yellow-300 hover:underline"
                  >
                    {invitation.circle.name}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <p className="text-gray-300">{invitation.inviter.name}</p>
                  <p className="text-sm text-gray-500">{invitation.inviter.email}</p>
                </td>
                <td className="px-6 py-4">{getStatusBadge(invitation)}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">
                  {new Date(invitation.expires_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm">
                  {new Date(invitation.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleImpersonate(invitation)}
                    disabled={impersonating === invitation.id}
                    className="px-3 py-1 text-sm bg-yellow-800/50 text-yellow-300 rounded hover:bg-yellow-800 disabled:opacity-50"
                  >
                    {impersonating === invitation.id ? 'Switching...' : 'Impersonate'}
                  </button>
                </td>
              </tr>
            ))}
            {filteredInvitations.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No invitations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
