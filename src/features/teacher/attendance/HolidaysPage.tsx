import { format } from "date-fns";
import TeacherHolidaysTab from "./components/TeacherHolidaysTab";

const HolidaysPage = () => {
  return (
    <div className="flex flex-col gap-4 min-h-full px-3 sm:px-6 pt-2 pb-6">

      {/* Page header */}
      <div>
        <h1 className="text-sm font-semibold text-gray-900">Holidays</h1>
        <p className="text-[11px] text-gray-500 mt-0.5">
          {format(new Date(), "EEEE, d MMMM yyyy")}
        </p>
      </div>

      <TeacherHolidaysTab />
    </div>
  );
};

export default HolidaysPage;
