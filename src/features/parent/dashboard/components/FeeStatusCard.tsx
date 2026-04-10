import { Card, CardContent } from "@/components/ui/card";

export const FeeStatusCard = () => {
    return (
        <Card
            className="
        rounded-xl border border-[#E8EBF2] shadow-none w-full h-fit
        transition-transform duration-200 ease-in-out
        hover:shadow-lg hover:scale-[1.02]
      "
        >
            <CardContent className="flex flex-col gap-3 p-4 sm:p-5">

                {/* Label */}
                <p className="text-[11px] sm:text-xs text-gray-400">
                    Fee Status
                </p>

                {/* Amount */}
                <h2 className="text-[24px] sm:text-[28px] lg:text-[30px] font-bold text-[#E05C2A] leading-tight">
                    ₹8,500
                </h2>

                {/* Subtext */}
                <p className="text-[11px] sm:text-xs text-gray-400">
                    Outstanding as of today
                </p>

                {/* Actions */}
                <div className="flex flex-col gap-2 mt-2">
                    <button className="w-full bg-[#3525CD] hover:bg-[#2b1fb3] transition text-white rounded-lg py-2.5 sm:py-[10px] text-[13px] font-semibold">
                        Pay Now
                    </button>

                    <button className="text-[12px] text-[#3525CD] text-center hover:underline">
                        View All Fees
                    </button>
                </div>

            </CardContent>
        </Card>
    );
};