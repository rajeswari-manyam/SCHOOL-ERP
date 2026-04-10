export function StudentCard() {
    return (
        <div className="w-[320px] h-[233px] p-6 rounded-[24px] border border-[#C7C4D833] bg-white flex flex-col items-center justify-center gap-3">

            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-[#b2dfdb] overflow-hidden flex items-center justify-center shrink-0">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <ellipse cx="32" cy="58" rx="20" ry="12" fill="#2d6a4f" />
                    <rect x="27" y="38" width="10" height="8" fill="#f5c87a" />
                    <circle cx="32" cy="30" r="13" fill="#f5c87a" />
                    <path d="M19 28 Q20 16 32 15 Q44 16 45 28 Q42 20 32 20 Q22 20 19 28Z" fill="#2c1a0e" />
                    <circle cx="27.5" cy="29" r="1.5" fill="#2c1a0e" />
                    <circle cx="36.5" cy="29" r="1.5" fill="#2c1a0e" />
                    <path d="M27 34 Q32 38 37 34" stroke="#c8845a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                    <path d="M22 46 Q32 42 42 46" stroke="#1a4a3a" strokeWidth="2" fill="none" />
                </svg>
            </div>

            {/* Info */}
            <div className="text-center">
                <p className="text-[14px] font-semibold text-[#0B1C30]">
                    Ravi Kumar
                </p>
                <p className="text-[12px] text-gray-400 mt-0.5">
                    Class 10A · Roll No. 24
                </p>
            </div>

            {/* Status */}
            <span className="text-[10px] font-semibold px-4 py-1.5 rounded-full border border-[#E8EBF2] text-[#0B1C30] tracking-widest uppercase">
                Good Standing
            </span>
        </div>
    );
}