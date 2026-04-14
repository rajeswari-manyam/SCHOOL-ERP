import { Card, CardContent } from "../../../../components/ui/card";
import typography, { combineTypography } from "../../../../styles/typography";

type Tab = "pending" | "history" | "annual";

interface AllPaidStateProps {
  onTabChange: (t: Tab) => void;
}

/* ================= ICONS ================= */
const CheckIcon = ({ size = 14, stroke = "white", strokeWidth = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <path
      d="M2 7l3.5 3.5L12 3"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <rect x="1" y="2" width="10" height="9" rx="1.5" stroke="#16A34A" strokeWidth="1.2" />
    <path d="M4 1v2M8 1v2M1 5h10" stroke="#16A34A" strokeWidth="1.2" />
  </svg>
);

const ReceiptIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2 1h8v10L8 9.5 6 11 4 9.5 2 11V1z" stroke="#16A34A" strokeWidth="1.2" />
    <path d="M4 4.5h4M4 6.5h2.5" stroke="#16A34A" strokeWidth="1.2" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="6.5" fill="#25D366" />
  </svg>
);

const BalanceIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="2" y="4" width="14" height="10" rx="2" stroke="#3525CD" strokeWidth="1.4" />
  </svg>
);

const StarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M9 2l1.8 3.6L15 6.3l-3 2.9.7 4.1L9 11.2l-3.7 2.1.7-4.1-3-2.9 4.2-.7L9 2z"
      stroke="#F59E0B"
      fill="#FEF3C7"
      strokeWidth="1.4"
    />
  </svg>
);

const HelpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="7" stroke="#6B7280" strokeWidth="1.4" />
  </svg>
);

/* ================= COMPONENT ================= */
export function AllPaidState({ onTabChange }: AllPaidStateProps) {
  return (
    <div className="flex flex-col gap-5">

      {/* ================= SUCCESS CARD ================= */}
<Card
  className="
    border border-transparent
    hover:border-[#3525CD]
    transition-colors duration-200
  "
>
        <CardContent className="p-5">
          <div className="flex gap-3">

            <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center mt-0.5">
              <CheckIcon />
            </div>

            <div className="flex flex-col gap-1">
              <p className={combineTypography(typography.body.xs, "text-emerald-700")}>
                All fees paid for April 2025
              </p>

              <p className={combineTypography(typography.body.xs, "text-emerald-600")}>
                Ravi Kumar has no outstanding dues for this month.
              </p>

              <div className="flex items-center gap-1.5 mt-1">
                <ReceiptIcon />
                <p className={combineTypography(typography.body.xs, "text-emerald-600")}>
                  Last payment: <b>₹8,500</b> on 1 April 2025 | UPI
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <CalendarIcon />
                <p className={combineTypography(typography.body.xs, "text-emerald-600")}>
                  Next due: <b>May fees</b> on 5 May 2025
                </p>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* ================= QUICK LINKS ================= */}
      <div className="flex gap-5">
        <button
          onClick={() => onTabChange("history")}
          className={combineTypography(typography.body.xs, "text-[#3525CD] hover:underline")}
        >
          View Fee History
        </button>

        <button
          onClick={() => onTabChange("annual")}
          className={combineTypography(typography.body.xs, "text-[#3525CD] hover:underline")}
        >
          View Annual Overview
        </button>
      </div>

      {/* ================= EMPTY STATE ================= */}
   <Card
  className="
    border border-transparent
    hover:border-[#3525CD]
    transition-colors duration-200
  "
>
        <CardContent className="flex flex-col items-center py-8">

          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <CheckIcon size={18} />
          </div>

          <p className={combineTypography(typography.body.xs, "text-[#0B1C30]")}>
            No pending fees
          </p>

          <p className={combineTypography(typography.body.xs, "text-gray-400 text-center max-w-[260px] mt-1")}>
            You will be notified via WhatsApp when new fees are due.
          </p>

          <div className="flex items-center gap-2 mt-4 px-3 py-2 rounded-full bg-[#F0FDF4] border border-emerald-200">
            <WhatsAppIcon />
            <p className={combineTypography(typography.body.xs, "text-gray-600")}>
              +91 98765 43210 will receive reminders
            </p>
          </div>

        </CardContent>
      </Card>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

 <Card className="border border-transparent hover:border-[#3525CD] transition-colors duration-200">
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <BalanceIcon />
              <p className={combineTypography(typography.body.xs, "text-gray-400 uppercase")}>Balance Status</p>
            </div>
            <p className={combineTypography(typography.body.xs, "text-[#0B1C30]")}>₹0.00</p>
            <span className={combineTypography(typography.body.xs, "text-emerald-700 px-2 py-1 rounded-full")}>
              Fully Cleared
            </span>
          </CardContent>
        </Card>

  <Card className="border border-transparent hover:border-[#3525CD] transition-colors duration-200">
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <StarIcon />
              <p className={combineTypography(typography.body.xs, "text-gray-400 uppercase")}>Payment Standing</p>
            </div>
            <p className={combineTypography(typography.body.xs, "text-emerald-600")}>Excellent</p>
            <p className={combineTypography(typography.body.xs, "text-gray-400 mt-1")}>
              12 Consecutive on-time payments
            </p>
          </CardContent>
        </Card>

  <Card className="border border-transparent hover:border-[#3525CD] transition-colors duration-200">
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <HelpIcon />
              <p className={combineTypography(typography.body.xs, "text-gray-400 uppercase")}>Need Help?</p>
            </div>

            <p className={combineTypography(typography.body.xs, "text-[#0B1C30]")}>Contact Accounts</p>

            <button className={combineTypography(typography.body.xs, "text-[#3525CD] mt-2 hover:underline")}>
              Connect now →
            </button>
          </CardContent>
        </Card>

      </div>

    </div>
  );
}