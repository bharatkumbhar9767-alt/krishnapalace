"use client";

import { useState } from "react";
import { updateStaffRole } from "./actions";

export default function StaffClient({ initialUsers, currentUserRole, currentUserId }: { initialUsers: any[], currentUserRole: string, currentUserId: string }) {
  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setLoading(userId);
    const res = await updateStaffRole(userId, newRole);
    
    if (res.success) {
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } else {
      alert(res.error);
    }
    setLoading(null);
  };

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'SUPERADMIN': return 'bg-purple-100 text-purple-800';
      case 'MANAGER': return 'bg-blue-100 text-blue-800';
      case 'RECEPTIONIST': return 'bg-yellow-100 text-yellow-800';
      case 'CUSTOMER': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="p-4 font-bold text-gray-900">Name</th>
            <th className="p-4 font-bold text-gray-900">Email</th>
            <th className="p-4 font-bold text-gray-900">Role</th>
            <th className="p-4 font-bold text-gray-900">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
              <td className="p-4 font-medium text-gray-900">{user.name || "N/A"}</td>
              <td className="p-4 text-gray-600">{user.email}</td>
              <td className="p-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide ${getRoleBadge(user.role)}`}>
                  {user.role}
                </span>
              </td>
              <td className="p-4">
                <select 
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  disabled={loading === user.id || currentUserRole !== "SUPERADMIN" || currentUserId === user.id}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="CUSTOMER">Customer</option>
                  <option value="RECEPTIONIST">Receptionist</option>
                  <option value="MANAGER">Manager</option>
                  <option value="SUPERADMIN">Super Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
