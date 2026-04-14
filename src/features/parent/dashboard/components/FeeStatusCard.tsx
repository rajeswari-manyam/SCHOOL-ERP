import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeeStatusCardProps {
    isPaid?: boolean;
}

export const FeeStatusCard = ({ isPaid = false }: FeeStatusCardProps) => {
    if (isPaid) {
        return (
          <Card className="rounded-xl border border-[#E8EBF2] shadow-none w-full h-fit 
transition-all duration-200 ease-in-out

hover:border-[#3525CD] hover:shadow-md hover:-translate-y-[2px]
">
                <CardContent className="flex flex-col gap-4 p-5 sm:p-6">

                    {/* Check icon + Title */}
                    <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-white border border-[#BBF7D0] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check size={17} className="text-[#16A34A]" strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-[14px] font-semibold text-[#15803D] leading-snug">
                                All fees paid for April 2025
                            </p>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="flex flex-col gap-1.5">
                        <p className="text-[12px] text-[#4B7A5E]">
                            Last payment:{" "}
                            <span className="font-semibold text-[#15803D]">Rs.8,500</span>{" "}
                            on 1 April 2025 — UPI
                        </p>
                        <p className="text-[12px] text-[#4B7A5E]">
                            Next due:{" "}
                            <span className="font-semibold text-[#15803D]">May fees</span>{" "}
                            on 5 May 2025
                        </p>
                    </div>

                    {/* CTA */}
                    <button className="text-[13px] text-[#15803D] font-semibold text-left hover:underline">
                        View Fee History →
                    </button>

                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="rounded-xl border border-[#E8EBF2] shadow-none w-full h-fit transition-colors duration-200 ease-in-out hover:border-[#3525CD]">
            <CardContent className="flex flex-col gap-2 p-4 sm:p-5">

                <p className="text-[11px] sm:text-xs text-gray-400">Fee Status</p>

                <h2 className="text-[24px] sm:text-[28px] lg:text-[30px] font-bold text-[#BA1A1A]">
                    ₹8,500
                </h2>

                <p className="text-[11px] sm:text-xs text-gray-400">
                    Outstanding as of today
                </p>

                <div className="flex flex-col gap-2 mt-2">
                    <Button className="w-full bg-[#006C49] hover:bg-[#006C49] transition text-white rounded-lg py-2.5 sm:py-[10px] text-[13px] font-semibold">
                        Pay Now
                    </Button>
                    <button className="text-[12px] text-[#006C49] text-center hover:underline">
                        View All Fees
                    </button>
                </div>

            </CardContent>
        </Card>
    );
};