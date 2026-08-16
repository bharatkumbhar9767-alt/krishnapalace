import { getStaff } from "./actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import StaffClient from "./StaffClient";

export const dynamic = "force-dynamic";

export default async function AdminStaffPage() {
  const session = await auth();
  
  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  const result = await getStaff();
  
  // Serialize dates
  const serializedStaff = (result.staff || []).map(s => ({
    ...s,
    createdAt: s.createdAt.toISOString()
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
      </div>
      
      <StaffClient initialStaff={serializedStaff} />
    </div>
  );
}
