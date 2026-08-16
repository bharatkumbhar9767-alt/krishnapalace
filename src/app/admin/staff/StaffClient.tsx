"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createStaff, deleteStaff } from "./actions";

export default function StaffClient({ initialStaff }: { initialStaff: any[] }) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("RECEPTIONIST");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await createStaff({ name, email, password, role });
    
    if (result.success) {
      alert("Staff created successfully");
      window.location.reload();
    } else {
      alert(result.error);
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return;
    
    setLoading(true);
    const result = await deleteStaff(id);
    
    if (result.success) {
      window.location.reload();
    } else {
      alert(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Staff"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-background rounded-xl border shadow-sm p-6 space-y-4">
          <h3 className="text-lg font-semibold">New Staff Member</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input required value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input required type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <select 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={role} 
                onChange={e => setRole(e.target.value)}
              >
                <option value="RECEPTIONIST">Receptionist</option>
                <option value="MANAGER">Manager</option>
              </select>
            </div>
          </div>
          <Button type="submit" disabled={loading}>Create Account</Button>
        </form>
      )}

      <div className="bg-background rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {initialStaff.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                  No staff members found.
                </td>
              </tr>
            ) : initialStaff.map((staff) => (
              <tr key={staff.id} className="hover:bg-muted/20">
                <td className="px-6 py-4 font-medium">{staff.name}</td>
                <td className="px-6 py-4 text-muted-foreground">{staff.email}</td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-semibold ${
                    staff.role === 'MANAGER' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {staff.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(staff.id)} disabled={loading}>
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
