import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const subjectConfig: Record<
    string,
    { bg: string; iconBg: string; icon: string }
> = {
    ENGLISH: {
        bg: "bg-[#EEF2FF]",
        iconBg: "bg-[#C7D2FE]",
        icon: "📘",
    },
    MATHS: {
        bg: "bg-[#F0FDF4]",
        iconBg: "bg-[#BBF7D0]",
        icon: "📊",
    },
    SCIENCE: {
        bg: "bg-[#FFF7ED]",
        iconBg: "bg-[#FED7AA]",
        icon: "🔬",
    },
};

const simpleIcons: Record<string, string> = {
    Mathematics: "📐",
    Physics: "⚗️",
    English: "📖",
};

const DownloadIcon = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
            d="M6 1v7M3 5l3 3 3-3M1 10h10"
            stroke="#3525CD"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const cardData = [
    { title: "Tenses and Modals", subject: "ENGLISH" },
    { title: "Quadratic Equations", subject: "MATHS" },
    { title: "Chemical Bonding", subject: "SCIENCE" },
];

const simpleData = [
    { title: "Mathematics: Quadratic Equations", subject: "Mathematics" },
    { title: "Physics: Optics Lab Report", subject: "Physics" },
    { title: "English: Shakespeare Essay", subject: "English" },
];

interface HomeworkCardProps {
    variant?: "card" | "simple";
}

export const HomeworkCard = ({ variant = "card" }: HomeworkCardProps) => {

    // ── Simple variant ──
    if (variant === "simple") {
        return (
            <Card className="w-full rounded-xl border border-[#E8EBF2] shadow-none hover:border-[#3525CD] transition-colors">
                <CardHeader className="px-5 pt-5 pb-3 border-b border-[#F4F6FA]">
                    <CardTitle className="text-[15px] font-semibold text-[#0B1C30]">
                        Homework This Week
                    </CardTitle>
                </CardHeader>

                <CardContent className="p-4 flex flex-col gap-2">
                    {simpleData.map((item, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-4 px-4 py-3 rounded-xl bg-[#F8F9FF] hover:bg-[#EEF2FF] transition-colors cursor-pointer"
                        >
                            <div className="w-9 h-9 rounded-lg bg-white border border-[#E8EBF2] flex items-center justify-center text-lg shrink-0">
                                {simpleIcons[item.subject] ?? "📄"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-semibold text-[#0B1C30] truncate">
                                    {item.title}
                                </p>
                            </div>
                            <button className="text-[12px] text-[#3525CD] font-medium flex items-center gap-1.5 hover:underline shrink-0">
                                <DownloadIcon />
                                Download
                            </button>
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    }

    // ── Card variant ──
    return (
        <Card className="w-full rounded-xl border border-[#E8EBF2] shadow-none hover:border-[#3525CD] transition-colors">

            {/* Header */}
            <CardHeader className="px-5 pt-5 pb-4 border-b border-[#F4F6FA]">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-1">
                            Homework Overview
                        </p>
                        <CardTitle className="text-[22px] font-bold leading-tight flex items-center gap-2">
                            <span className="bg-[#3525CD] text-white px-2.5 py-0.5 rounded-md text-[14px]">
                                {cardData.length}
                            </span>
                            <span className="text-[#0B1C30]">Home Work For This Week</span>
                        </CardTitle>
                        <p className="text-[12px] text-gray-400 mt-0.5">
                            Pending homework for this week
                        </p>
                    </div>
                    <span className="text-[11px] font-semibold text-[#3525CD] bg-[#EEF2FF] px-2.5 py-1 rounded-full shrink-0">
                        {cardData.length} pending
                    </span>
                </div>
            </CardHeader>

            {/* Rows */}
            <CardContent className="p-4 flex flex-col gap-2">
                {cardData.map((item, i) => {
                    const config = subjectConfig[item.subject] ?? {
                        bg: "bg-gray-50",
                        iconBg: "bg-gray-200",
                        icon: "📄",
                    };

                    return (
                        <div
                            key={i}
                            className={`${config.bg} flex items-center gap-4 px-4 py-3.5 rounded-xl hover:opacity-90 transition-opacity cursor-pointer`}
                        >
                            <div className={`${config.iconBg} w-10 h-10 rounded-xl flex items-center justify-center text-[20px] shrink-0`}>
                                {config.icon}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-semibold text-[#0B1C30] truncate">
                                    {item.title}
                                </p>
                            </div>

                            <button className="text-[12px] text-[#3525CD] flex items-center gap-1.5 font-medium hover:underline shrink-0">
                                <DownloadIcon />
                                Download
                            </button>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
};