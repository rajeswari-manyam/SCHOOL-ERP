import HolidayCalendar from "./components/HolidayCalendar";

const HolidaysPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl space-y-3 px-3 py-3 sm:space-y-4 sm:px-4 sm:py-4 md:px-6">

        {/* Page Header */}
        <div>
          <h1 className="text-base font-semibold text-gray-900">Holidays</h1>
          <div className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5">
            <svg className="h-3 w-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-[10px] font-medium text-indigo-600">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
        </div>

        <HolidayCalendar />
      </div>
    </div>
  );
};

export default HolidaysPage;
