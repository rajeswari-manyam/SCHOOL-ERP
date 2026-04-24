import { Button } from "@/components/ui/button";

interface CommunicationCenterProps {
  onSendReminderToAll: () => void;
  onSendReminderToDueToday: () => void;
  onExportDefaultersPDF: () => void;
  onExportCSV: () => void;
}

export function CommunicationCenter({
  onSendReminderToAll,
  onSendReminderToDueToday,
  onExportDefaultersPDF,
  onExportCSV,
}: CommunicationCenterProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {/* Communication Center */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Communication Center</h3>
        <div className="space-y-2">
          <Button
            onClick={onSendReminderToAll}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-orange-600 transition-colors"
          >
            📢 Send Reminder to All Overdue
          </Button>
          <Button
            variant="outline"
            onClick={onSendReminderToDueToday}
            className="w-full flex items-center justify-center gap-2 border-orange-300 text-orange-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-orange-50 transition-colors"
          >
            🔔 Send Reminder to Due Today
          </Button>
        </div>
      </div>

      {/* Data Export */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Data Export</h3>
        <div className="space-y-2">
          <Button
            variant="outline"
            onClick={onExportDefaultersPDF}
            className="w-full flex items-center justify-center gap-2 border-gray-200 text-gray-700 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
          >
            📄 Export Defaulters PDF
          </Button>
          <Button
            variant="outline"
            onClick={onExportCSV}
            className="w-full flex items-center justify-center gap-2 border-gray-200 text-gray-700 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
          >
            📊 Export CSV
          </Button>
        </div>
      </div>
    </div>
  );
}