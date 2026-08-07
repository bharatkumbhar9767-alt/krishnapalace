import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

async function getCustomers() {
  try {
    const customers = await prisma.user.findMany({
      where: { role: "CUSTOMER" },
      include: {
        bookings: {
          orderBy: { checkInDate: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return customers;
  } catch (e) {
    console.error("Failed to fetch customers:", e);
    return [];
  }
}

export default async function AdminCustomersPage() {
  const session = await auth();
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "MANAGER")) {
    redirect("/dashboard");
  }

  const customers = await getCustomers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Customer Management</h1>
      </div>

      <div className="bg-background rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-6 py-4 font-medium">Customer Info</th>
                <th className="px-6 py-4 font-medium">Joined Date</th>
                <th className="px-6 py-4 font-medium text-center">Total Bookings</th>
                <th className="px-6 py-4 font-medium text-right">Total Spent</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No customers found.
                  </td>
                </tr>
              ) : customers.map((customer) => {
                const totalSpent = customer.bookings
                  .filter(b => b.status === "CHECKED_OUT" || b.status === "CONFIRMED")
                  .reduce((acc, curr) => acc + Number(curr.totalAmount), 0);

                return (
                  <tr key={customer.id} className="hover:bg-muted/20">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden relative">
                          {customer.image ? (
                            <Image src={customer.image} alt={customer.name || ""} fill className="object-cover" />
                          ) : (
                            <span>{(customer.name || customer.email || "?").charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{customer.name || "Unnamed"}</div>
                          <div className="text-xs text-muted-foreground">{customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {customer.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center bg-muted px-2 py-1 rounded-md text-xs font-medium">
                        {customer.bookings.length}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium whitespace-nowrap text-right">
                      ${totalSpent.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="outline" size="sm">View Details</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
