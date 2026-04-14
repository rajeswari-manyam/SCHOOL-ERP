import type { Payslip } from "../types/payslip.types";

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

interface Props {
  payslip: Payslip;
}

const PayslipPdfPreview = ({ payslip }: Props) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Payslip Preview</p>

      {/* Printed payslip */}
      <div className="border border-gray-200 rounded-xl overflow-hidden font-mono text-xs">

        {/* School header */}
        <div className="bg-indigo-600 text-white px-5 py-4 flex items-center justify-between">
          <div>
            <p className="font-extrabold text-sm tracking-wide">Greenfield Public School</p>
            <p className="text-indigo-200 text-[11px]">Hyderabad, Telangana — 500001</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-[11px] text-indigo-200 uppercase tracking-widest">Salary Slip</p>
            <p className="font-extrabold text-sm">{payslip.monthLabel}</p>
          </div>
        </div>

        {/* Employee info grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 px-5 py-4 bg-gray-50 border-b border-gray-200">
          {[
            ["Employee ID",  payslip.employeeId],
            ["Name",         payslip.employeeName],
            ["Designation",  payslip.designation],
            ["Department",   payslip.department],
            ["Bank Account", payslip.bankAccount],
            ["PAN",          payslip.pan],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-gray-400">{label}</span>
              <span className="font-bold text-gray-800">{val}</span>
            </div>
          ))}
        </div>

        {/* Earnings | Deductions two-column table */}
        <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
          {/* Earnings */}
          <div className="px-4 py-3">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 mb-2">Earnings</p>
            {payslip.earnings.map((e) => (
              <div key={e.label} className="flex justify-between py-0.5">
                <span className="text-gray-500 truncate mr-2">{e.label}</span>
                <span className="font-semibold text-gray-800 whitespace-nowrap">{inr(e.amount)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 mt-1 border-t border-gray-200">
              <span className="font-extrabold text-gray-700">Gross</span>
              <span className="font-extrabold text-gray-900">{inr(payslip.grossSalary)}</span>
            </div>
          </div>

          {/* Deductions */}
          <div className="px-4 py-3">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-red-500 mb-2">Deductions</p>
            {payslip.deductions.map((d) => (
              <div key={d.label} className="flex justify-between py-0.5">
                <span className="text-gray-500 truncate mr-2">{d.label}</span>
                <span className="font-semibold text-red-600 whitespace-nowrap">{inr(d.amount)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 mt-1 border-t border-gray-200">
              <span className="font-extrabold text-gray-700">Total</span>
              <span className="font-extrabold text-red-600">{inr(payslip.totalDeductions)}</span>
            </div>
          </div>
        </div>

        {/* Net pay footer */}
        <div className="flex items-center justify-between px-5 py-3 bg-indigo-50">
          <div>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Net Pay (Take Home)</p>
            <p className="text-lg font-extrabold text-indigo-700">{inr(payslip.netSalary)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400">Attendance</p>
            <p className="text-[11px] font-bold text-gray-700">
              {payslip.attendance.presentDays}P &nbsp;
              {payslip.attendance.absentDays}A &nbsp;
              {payslip.attendance.halfDays}H &nbsp;/&nbsp;
              {payslip.attendance.workingDays} days
            </p>
          </div>
        </div>

        {/* Footer note */}
        <div className="px-5 py-2 text-center bg-gray-50 border-t border-gray-100">
          <p className="text-[10px] text-gray-400">
            This is a computer-generated payslip and does not require a signature.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PayslipPdfPreview;
