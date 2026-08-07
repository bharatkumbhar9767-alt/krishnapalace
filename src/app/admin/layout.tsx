import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "MANAGER" && session.user.role !== "RECEPTIONIST")) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Link href="/admin" className="text-xl font-bold">Admin Panel</Link>
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/admin" className="block px-4 py-2 rounded-md hover:bg-slate-800">Dashboard</Link>
          <Link href="/admin/rooms" className="block px-4 py-2 rounded-md hover:bg-slate-800">Rooms</Link>
          <Link href="/admin/bookings" className="block px-4 py-2 rounded-md hover:bg-slate-800">Bookings</Link>
          <Link href="/admin/customers" className="block px-4 py-2 rounded-md hover:bg-slate-800">Customers</Link>
          <Link href="/admin/cms" className="block px-4 py-2 rounded-md hover:bg-slate-800">CMS</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b bg-white flex items-center justify-between px-6">
          <h2 className="text-lg font-semibold">Krishna Palace Administration</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">{session.user.name || session.user.email}</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}
