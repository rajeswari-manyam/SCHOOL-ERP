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
    <div className="flex gap-4 border-b">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`pb-2 text-sm ${
            active === tab
              ? "border-b-2 border-primary font-medium"
              : "text-gray-500"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};