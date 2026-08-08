"use client";

import { useState } from "react";
import { approveTestimonial, deleteTestimonial } from "./actions";

export default function CmsClient({ testimonials }: { testimonials: any[] }) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    setLoading(id);
    const res = await approveTestimonial(id);
    if (!res.success) alert(res.error);
    setLoading(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    setLoading(id);
    const res = await deleteTestimonial(id);
    if (!res.success) alert(res.error);
    setLoading(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Manage Testimonials</h2>
        <p className="text-gray-500 text-sm mt-1">Approve testimonials to show them on the homepage.</p>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="p-4 font-bold text-gray-900">Author</th>
            <th className="p-4 font-bold text-gray-900">Content</th>
            <th className="p-4 font-bold text-gray-900">Rating</th>
            <th className="p-4 font-bold text-gray-900">Status</th>
            <th className="p-4 font-bold text-gray-900 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {testimonials.map((test) => (
            <tr key={test.id} className="hover:bg-gray-50 transition-colors">
              <td className="p-4 font-medium text-gray-900">{test.authorName}</td>
              <td className="p-4 text-gray-600 truncate max-w-xs">{test.content}</td>
              <td className="p-4 text-gray-600">{test.rating} / 5</td>
              <td className="p-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide ${
                  test.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {test.status}
                </span>
              </td>
              <td className="p-4 text-right space-x-2">
                {test.status !== "APPROVED" && (
                  <button 
                    onClick={() => handleApprove(test.id)}
                    disabled={loading === test.id}
                    className="text-sm bg-[#1ab64f] hover:bg-[#149b42] text-white px-3 py-1.5 rounded disabled:opacity-50"
                  >
                    Approve
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(test.id)}
                  disabled={loading === test.id}
                  className="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded disabled:opacity-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {testimonials.length === 0 && (
            <tr>
              <td colSpan={5} className="p-8 text-center text-gray-500">No testimonials found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
