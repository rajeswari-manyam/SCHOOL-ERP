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
   <div className="flex gap-5">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`pb-2 text-sm whitespace-nowrap transition-all ${
            active === tab
              ? "border-b-2 border-blue-600 text-blue-600 font-medium"
              : "border-b-2 border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};