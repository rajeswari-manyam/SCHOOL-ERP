import { usePayslips } from "../hooks/usePayslips";
import { PayslipTable } from "../components/PayslipTable";

export default function PayslipsPage() {
  const { data: payslips = [], isLoading } = usePayslips();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Payslips</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : payslips.length === 0 ? (
        <div className="text-gray-500">No payslips found.</div>
      ) : (
        <PayslipTable payslips={payslips} />
      )}
    </div>
  );
}
