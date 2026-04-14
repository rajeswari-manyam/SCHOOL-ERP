import { Card, CardContent } from "../../../../components/ui/card";
import typography from "../../../../styles/typography";
import { cn } from "../../../../utils/cn";

export function SessionSummary() {
    return (
        <Card
            className="
        w-full sm:w-[320px]
        rounded-[24px]
        bg-[#0B1C30]
        text-white
        border border-white/10
        hover:border-[#3525CD]
        transition-all duration-300
        shadow-none hover:shadow-lg
      "
        >
            {/* Removed CardHeader divider completely */}

            <CardContent className="flex flex-col gap-3 p-4">
                {/* Title */}
                <p
                    className={cn(
                        typography.form.helper,
                        "tracking-widest uppercase text-white/50"
                    )}
                >
                    Current Session Summary
                </p>

                {/* Total Fees */}
                <div>
                    <p className={cn(typography.form.helper, "text-white/50")}>
                        Total Fees
                    </p>
                    <p className="text-[24px] font-bold leading-none">
                        Rs. 1,45,000
                    </p>
                </div>

                {/* Progress */}
                <div>
                    <div className="flex justify-between text-[11px] text-white/60 mb-1">
                        <span>Paid: Rs. 1,04,400</span>
                        <span className="text-white font-semibold">72%</span>
                    </div>

                    <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                        <div
                            className="h-1.5 rounded-full bg-emerald-400 transition-all duration-500"
                            style={{ width: "72%" }}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}