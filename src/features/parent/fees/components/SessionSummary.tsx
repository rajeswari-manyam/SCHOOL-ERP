export function SessionSummary() {
    return (
        <div className="w-[320px] h-[183px] p-6 rounded-[24px] bg-[#0B1C30] text-white flex flex-col gap-4">

            <p className="text-[10px] font-semibold tracking-widest text-white/50 uppercase">
                Current Session Summary
            </p>

            <div>
                <p className="text-[11px] text-white/50 mb-1">Total Fees</p>
                <p className="text-[28px] font-bold leading-none">Rs. 1,45,000</p>
            </div>

            <div>
                <div className="flex justify-between text-[11px] text-white/60 mb-1.5">
                    <span>Paid: Rs. 1,04,400</span>
                    <span className="text-white font-semibold">72%</span>
                </div>

                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                        className="h-2 rounded-full bg-emerald-400"
                        style={{ width: "72%" }}
                    />
                </div>
            </div>

        </div>
    );
}