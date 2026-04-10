import typography from "@/styles/typography";

const subjectConfig: Record<
  string,
  { bg: string; iconBg: string; icon: string; badgeColor: string; badgeText: string }
> = {
  ENGLISH: {
    bg: "bg-[#EEF2FF]",
    iconBg: "bg-[#C7D2FE]",
    icon: "📘",
    badgeColor: "text-[#3730A3] bg-[#E0E7FF]",
    badgeText: "ENGLISH",
  },
  MATHS: {
    bg: "bg-[#F0FDF4]",
    iconBg: "bg-[#BBF7D0]",
    icon: "📊",
    badgeColor: "text-[#166534] bg-[#DCFCE7]",
    badgeText: "MATHS",
  },
  SCIENCE: {
    bg: "bg-[#FFF7ED]",
    iconBg: "bg-[#FED7AA]",
    icon: "🔬",
    badgeColor: "text-[#9A3412] bg-[#FFEDD5]",
    badgeText: "SCIENCE",
  },
};

export const AssignmentsList = () => {
  const data = [
    { title: "Tenses and Modals", subject: "ENGLISH", due: "Due: Tomorrow" },
    { title: "Quadratic Equations", subject: "MATHS", due: "Due: 10 Apr" },
    { title: "Chemical Bonding", subject: "SCIENCE", due: "Due: 12 Apr" },
  ];

  return (
    <div>
      <h2 className={`${typography.form.label} text-[#0B1C30] mb-3`}>
        Homework This Week
      </h2>

      <div className="flex flex-col gap-3">
        {data.map((item, i) => {
          const config = subjectConfig[item.subject] ?? {
            bg: "bg-gray-50",
            iconBg: "bg-gray-200",
            icon: "📄",
            badgeColor: "text-gray-600 bg-gray-100",
            badgeText: item.subject,
          };

          return (
            <div
              key={i}
              className={`
                ${config.bg} rounded-xl p-3 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:items-center gap-3
                border border-transparent
                transition-transform duration-200 ease-in-out
                hover:shadow-lg hover:scale-[1.02]
              `}
            >
              {/* Top Row (mobile) */}
              <div className="flex items-center gap-3 flex-1">
                {/* Icon */}
                <div
                  className={`${config.iconBg} w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-lg sm:text-[22px] shrink-0`}
                >
                  {config.icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className={`${typography.form.input} font-semibold text-[#0B1C30] truncate`}>
                    {item.title}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${config.badgeColor}`}>
                      {config.badgeText}
                    </span>

                    <span className={`${typography.body.xs} text-gray-400`}>
                      {item.due}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex justify-end sm:justify-center">
                <button
                  className={`${typography.body.xs} text-[#3525CD] flex items-center gap-1 font-medium hover:underline`}
                >
                  ⬇ Download
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};