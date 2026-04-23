
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow } from "@/components/ui/table";
import {Pagination }from "./Pagination";

const invoices = [
  { id: "INV-0055", school: "Hanamkonda Public", sub: "District Sec.", description: "Growth Annual", date: "15 Mar 2025", amount: 15000, status: "Paid", action: "Download" },
  { id: "INV-0054", school: "St. Mary's CBSE", description: "Pro Annual", date: "01 Apr 2025", amount: 25000, status: "Paid", action: "Download" },
  { id: "INV-0053", school: "Kazipet English", description: "Pilot Fee", date: "12 Mar 2025", amount: 1500, status: "Paid", action: "Download" },
  { id: "INV-0052", school: "Global Kids School", description: "Pilot Fee", date: "20 Mar 2025", amount: 1500, status: "Pending", action: "Send Reminder" },
  { id: "INV-0051", school: "Sunrise Academy", description: "Starter Annual", date: "01 Jan 2025", amount: 8000, status: "Overdue", action: "Collect" },
  { id: "INV-0050", school: "Sri Vidya Mandir", description: "Growth Monthly", date: "01 Apr 2025", amount: 2000, status: "Paid", action: "Download" },
  { id: "INV-0049", school: "Little Stars School", description: "Starter Annual", date: "01 Jul 2024", amount: 8000, status: "Paid", action: "Download" },
  { id: "INV-0048", school: "Modern School", description: "Pro Annual", date: "01 Jan 2025", amount: 25000, status: "Paid", action: "Download" },
];

const statusVariants: Record<string, "success" | "warning" | "error" | "default"> = {
  Paid: "success",
  Pending: "warning",
  Overdue: "error",
};

export default function InvoiceTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;
  const filtered = invoices.filter(inv =>
    inv.id.toLowerCase().includes(search.toLowerCase()) ||
    inv.school.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-2 flex flex-col items-center mr-50">
      {/* Filter Bar */}
      <div className="w-full max-w-5xl mb-6 rounded-2xl shadow-xl border border-[#23263a]/30 bg-white/60 backdrop-blur-md flex flex-nowrap items-center gap-3 px-6 py-4">
        <Input
          className="w-64"
          placeholder="Search invoices..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="rounded-full border border-gray-200 px-4 py-2 text-sm border-b bg-[#f6f8fc] focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400">
          <option>All Schools</option>
        </select>
        <select className="rounded-full border border-gray-200 px-4 py-2 text-sm border-b bg-[#f6f8fc] focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400">
          <option>All Status</option>
        </select>
        <Input type="text" className="w-56" placeholder="01 Jan 2025 — 07 Apr 2025" readOnly />
        <Button className="ml-auto flex items-center gap-2 shadow" variant="ghost">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export All
        </Button>
      </div>
      {/* Table */}
      <div className="w-full max-w-5xl rounded-2xl shadow-2xl border border-[#23263a]/30 bg-white/80 backdrop-blur-md overflow-x-auto">
        <Table>
          <TableHeader>
            <tr>
              <th className="py-3 px-4 text-left font-bold tracking-widest uppercase">INVOICE #</th>
              <th className="py-3 px-4 text-left font-bold tracking-widest uppercase">SCHOOL</th>
              <th className="py-3 px-4 text-left font-bold tracking-widest uppercase">DESCRIPTION</th>
              <th className="py-3 px-4 text-left font-bold tracking-widest uppercase">DATE</th>
              <th className="py-3 px-4 text-left font-bold tracking-widest uppercase">AMOUNT</th>
              <th className="py-3 px-4 text-left font-bold tracking-widest uppercase">STATUS</th>
              <th className="py-3 px-4 text-left font-bold tracking-widest uppercase">ACTION</th>
            </tr>
          </TableHeader>
          <TableBody>
            {paginated.map((inv) => (
              <TableRow key={inv.id}>
                <td className="py-3 px-4 font-semibold text-indigo-600 hover:underline cursor-pointer">{inv.id}</td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-gray-900">{inv.school}</div>
                  {inv.sub && <div className="text-xs text-gray-400">{inv.sub}</div>}
                </td>
                <td className="py-3 px-4">{inv.description}</td>
                <td className="py-3 px-4">{inv.date}</td>
                <td className="py-3 px-4 font-semibold">₹{inv.amount.toLocaleString()}</td>
                <td className="py-3 px-4">
                  <Badge variant={statusVariants[inv.status] ?? "default"}>{inv.status}</Badge>
                </td>
                <td className="py-3 px-4">
                  {inv.action === "Download" && (
                    <Button variant="link" size="sm">Download</Button>
                  )}
                  {inv.action === "Send Reminder" && (
                    <Button variant="outline" size="sm" className="flex items-center gap-1 text-yellow-700 border-yellow-300">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01"/><circle cx="12" cy="12" r="10"/></svg>
                      Send Reminder
                    </Button>
                  )}
                  {inv.action === "Collect" && (
                    <Button variant="destructive" size="sm" className="flex items-center gap-1">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>
                      Collect
                    </Button>
                  )}
                </td>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      <div className="w-full max-w-5xl">
       <Pagination page={page} totalPages={totalPages} onChange={setPage} total={filtered.length} pageSize={perPage} />
      </div>
    </div>
  );
}
