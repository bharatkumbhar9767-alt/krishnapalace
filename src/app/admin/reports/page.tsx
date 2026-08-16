import { getDashboardMetrics } from "./actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ReportsClient from "./ReportsClient";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const session = await auth();
  
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "MANAGER")) {
    redirect("/dashboard");
  }

  const result = await getDashboardMetrics();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
      </div>
      
      {result.error ? (
        <div className="text-red-500">{result.error}</div>
      ) : (
        <ReportsClient data={result} />
      )}
    </div>
  );
}
