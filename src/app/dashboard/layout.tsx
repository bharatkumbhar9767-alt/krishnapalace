import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Redirect admins to admin panel if they somehow end up here
  if (session.user.role === "SUPER_ADMIN" || session.user.role === "MANAGER") {
    redirect("/admin");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl text-primary">Krishna Palace</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm">Welcome, {session.user.name || session.user.email}</span>
            <Link href="/api/auth/signout" className={buttonVariants({ variant: "outline" })}>
              Logout
            </Link>
          </div>
        </div>
      </header>
      
      <div className="container flex-1 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <nav className="space-y-1">
              <Link href="/dashboard" className="block px-4 py-2 rounded-md hover:bg-muted font-medium bg-muted">Overview</Link>
              <Link href="/dashboard/bookings" className="block px-4 py-2 rounded-md hover:bg-muted font-medium">My Bookings</Link>
              <Link href="/dashboard/profile" className="block px-4 py-2 rounded-md hover:bg-muted font-medium">Profile Settings</Link>
            </nav>
          </aside>
          
          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
