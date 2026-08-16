import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  BedDouble, 
  Settings, 
  FileText,
  CalendarCheck,
  ClipboardList
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Role-Based Access Control
  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  if (!["SUPER_ADMIN", "MANAGER", "RECEPTIONIST"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  const role = session.user.role;
  const navItems = [
    { name: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-5 h-5 mr-3" />, show: true },
    { name: "Bookings", href: "/admin/bookings", icon: <CalendarCheck className="w-5 h-5 mr-3" />, show: true },
    { name: "Housekeeping", href: "/admin/housekeeping", icon: <ClipboardList className="w-5 h-5 mr-3" />, show: ["SUPER_ADMIN", "MANAGER", "RECEPTIONIST"].includes(role) },
    { name: "Rooms", href: "/admin/rooms", icon: <BedDouble className="w-5 h-5 mr-3" />, show: ["SUPER_ADMIN", "MANAGER"].includes(role) },
    { name: "Reports", href: "/admin/reports", icon: <FileText className="w-5 h-5 mr-3" />, show: ["SUPER_ADMIN", "MANAGER"].includes(role) },
    { name: "CMS & Settings", href: "/admin/cms", icon: <Settings className="w-5 h-5 mr-3" />, show: ["SUPER_ADMIN", "MANAGER"].includes(role) },
    { name: "Staff", href: "/admin/staff", icon: <Users className="w-5 h-5 mr-3" />, show: role === "SUPER_ADMIN" },
  ].filter(item => item.show);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white shrink-0 hidden md:block">
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-extrabold tracking-tight">Admin Portal</h2>
            <p className="text-sm text-gray-400 mt-1">Role: {session.user.role}</p>
          </div>
          <nav className="flex-1 py-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
