import { FileSpreadsheet, Download } from "lucide-react";

export const dynamic = "force-dynamic";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-500 mt-1">Export data and generate insights.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Bookings Export (CSV/Excel)</h3>
          <p className="text-gray-600 text-sm mb-6">
            Download a complete historical record of all bookings including guest details, room assignments, and payment amounts. 
            Compatible with Microsoft Excel and Google Sheets.
          </p>
          <a 
            href="/api/export/bookings" 
            target="_blank"
            className="inline-flex items-center justify-center bg-[#1ab64f] hover:bg-[#149b42] text-white font-bold py-2.5 px-4 rounded transition-colors w-full sm:w-auto"
          >
            <Download className="w-4 h-4 mr-2" />
            Download CSV Report
          </a>
        </div>
      </div>
    </div>
  );
}
