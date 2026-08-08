import prisma from "@/lib/prisma";
import StaffClient from "./StaffClient";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function StaffPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
        <p className="text-gray-500 mt-1">Manage user roles and permissions.</p>
        {session.user.role !== "SUPERADMIN" && (
          <div className="mt-4 p-4 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
            <p className="font-bold">Notice:</p>
            <p className="text-sm">Only Super Admins can change user roles. You are currently viewing this page as a {session.user.role}.</p>
          </div>
        )}
      </div>

      <StaffClient 
        initialUsers={users} 
        currentUserRole={session.user.role} 
        currentUserId={session.user.id} 
      />
    </div>
  );
}
