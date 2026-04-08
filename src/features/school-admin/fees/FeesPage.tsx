import { useFees, useMarkFeePaid } from "./hooks/useFees";
import { useState } from "react";
import { FeePendingTable } from "./components/FeePendingTable";
import { MarkPaidModal } from "./components/MarkPaidModal";
import { DefaultersList } from "./components/DefaultersList";

const FeesPage = () => {
  const { data, isLoading } = useFees();
  const { mutate } = useMarkFeePaid();
  const [selectedFeeId, setSelectedFeeId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleMarkPaid = (feeId: string) => {
    setSelectedFeeId(feeId);
    setModalOpen(true);
  };

  const handleModalSubmit = (paidAt: string) => {
    if (selectedFeeId) {
      mutate({ feeId: selectedFeeId, paidAt });
      setModalOpen(false);
      setSelectedFeeId(null);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <FeePendingTable
        records={data?.records ?? []}
        onMarkPaid={handleMarkPaid}
      />
      <DefaultersList records={data?.records ?? []} />
      <MarkPaidModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default FeesPage;
