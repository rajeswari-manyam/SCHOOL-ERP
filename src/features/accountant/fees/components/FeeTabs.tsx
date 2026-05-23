import typography from "@/styles/typography";

const tabs = [
  "Pending Fees",
  "All Transactions",
  "Fee Structure",
  "Transport Fees",
  "Concessions",
];

export const FeeTabs = ({
  active,
  setActive,
}: {
  active: string;
  setActive: (t: string) => void;
}) => {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 min-w-max">
        {tabs.map((tab) => {
          const isActive = active === tab;

          return (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`
                ${typography.body.small}
                whitespace-nowrap
                flex-shrink-0
                snap-start

                /* Mobile-first sizing */
                px-3 py-1.5
                sm:px-4 sm:py-2

                /* Shape */
                rounded-full
                transition-all duration-200

                /* Font size */
                text-[11px] sm:text-[13px]

                /* Active vs Inactive */
                ${
                  isActive
                    ? "bg-[#3525CD] text-white shadow-sm font-semibold"
                    : "bg-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 font-medium"
                }
              `}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
};