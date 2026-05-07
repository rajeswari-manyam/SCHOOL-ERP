import { useState } from "react";
import { useAttendanceStore } from "../store";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Select } from "../../../../components/ui/select";
import { Textarea } from "../../../../components/ui/textarea";
import { Label } from "../../../../components/ui/label";
import { Switch } from "../../../../components/ui/switch";

const holidayTypeOptions = [
  { label: "National Holiday", value: "National Holiday" },
  { label: "Public Holiday", value: "Public Holiday" },
  { label: "School Event", value: "School Event" },
  { label: "School Day", value: "School Day" },
];

const AddHolidayModal = () => {
  const { showAddHolidayModal, closeAddHoliday } = useAttendanceStore();
  const [holidayName, setHolidayName] = useState("");
  const [date, setDate] = useState("");
  const [holidayType, setHolidayType] = useState("National Holiday");
  const [repeatAnnually, setRepeatAnnually] = useState(true);
  const [notes, setNotes] = useState("");
  const [notifyTeachers, setNotifyTeachers] = useState(true);

  if (!showAddHolidayModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <Card className="w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Add Holiday</h2>
          <Button onClick={closeAddHoliday} variant="ghost" size="sm" className="p-1.5">
            &times;
          </Button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          <div>
            <Label required className="block mb-1">Holiday Name</Label>
            <Input
              value={holidayName}
              onChange={(e) => setHolidayName(e.target.value)}
              placeholder="e.g. Independence Day"
            />
          </div>

          <div>
            <Label required className="block mb-1">Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label required className="block mb-1">Holiday Type</Label>
              <Select
                value={holidayType}
                options={holidayTypeOptions}
                onValueChange={(value) => setHolidayType(value)}
                placeholder="Select holiday type"
              />
            </div>
            <div>
              <Label className="block mb-1">Repeat Annually?</Label>
              <div className="flex items-center gap-3 mt-2.5">
                <Switch
                  checked={repeatAnnually}
                  onCheckedChange={setRepeatAnnually}
                />
                <span className="text-sm text-gray-700 font-medium">
                  {repeatAnnually ? "On" : "Off"}
                </span>
              </div>
            </div>
          </div>

          <div>
            <Label className="block mb-1">Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional: any additional notes for staff"
              size="sm"
            />
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600">
            This holiday will appear on the calendar and attendance will not be expected on this day.
          </div>

          <div className="flex items-center gap-3">
            <Switch checked={notifyTeachers} onCheckedChange={setNotifyTeachers} />
            <span className="text-sm text-gray-700">
              Notify all teachers via WhatsApp <span className="text-green-600">📱</span>
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 px-6 pb-6">
          <Button onClick={closeAddHoliday} variant="outline" className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={closeAddHoliday} className="w-full sm:w-auto">
            Save Holiday
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AddHolidayModal;
