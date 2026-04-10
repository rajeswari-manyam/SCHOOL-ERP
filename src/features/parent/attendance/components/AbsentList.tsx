interface AbsentDay {
    day: number
    label: string
    time: string
}

const ABSENT_BY_MONTH: Record<string, AbsentDay[]> = {
    "2025-04": [
        { day: 5, label: "April 5, 2025 (Saturday)", time: "9:12 AM" },
        { day: 6, label: "April 6, 2025 (Sunday)", time: "8:52 AM" },
    ],
    "2025-03": [
        { day: 3, label: "March 3, 2025 (Monday)", time: "8:47 AM" },
        { day: 17, label: "March 17, 2025 (Monday)", time: "9:05 AM" },
    ],
    "2025-05": [
        { day: 8, label: "May 8, 2025 (Thursday)", time: "8:55 AM" },
    ],
}

const TREND_DATA = [
    { month: "Nov", value: 88 },
    { month: "Dec", value: 91 },
    { month: "Jan", value: 95 },
    { month: "Feb", value: 89 },
    { month: "Mar", value: 93 },
    { month: "Apr", value: 92 },
]

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
]

interface Props {
    currentDate: Date
    onSelect: (data: AbsentDay) => void
}

function getMonthKey(date: Date) {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, "0")
    return `${y}-${m}`
}

export default function AbsentList({ currentDate, onSelect }: Props) {
    const key = getMonthKey(currentDate)
    const absentDays = ABSENT_BY_MONTH[key] ?? []
    const monthLabel = `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`

    return (
        <div className="space-y-4">
            {/* Absent Days Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 transition-all duration-200 hover:border-[#3525CD] hover:shadow-md hover:-translate-y-1">
                <p className="text-[13px] font-semibold text-gray-800 mb-3">
                    Absent Days — {monthLabel}
                </p>

                {absentDays.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                        <div className="w-10 h-10 rounded-full bg-[#006C49] flex items-center justify-center mb-2">
                            <span className="text-lg">✓</span>
                        </div>
                        <p className="text-[13px] font-medium text-[#006C49]">No absences</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">Full attendance this month!</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {absentDays.map((item) => (
                            <div
                                key={item.day}
                                onClick={() => onSelect(item)}
                               className="bg-red-50 border border-red-100 rounded-lg p-3 cursor-pointer transition-all duration-200 hover:border-[#3525CD] hover:shadow-sm hover:-translate-y-[2px] active:scale-[0.98]"
                            >
                                {/* Day badge + label row */}
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-red-400 flex items-center justify-center text-white font-bold text-[13px] flex-shrink-0">
                                        {item.day}
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-semibold text-gray-800">{item.label}</p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            {/* WhatsApp icon square */}
                                            <div className="w-3.5 h-3.5 rounded-sm bg-[#25D366] flex items-center justify-center flex-shrink-0">
                                                <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-white">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.138.564 4.143 1.539 5.883L0 24l6.305-1.516A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.368l-.36-.213-3.732.897.944-3.635-.235-.374A9.818 9.818 0 1112 21.818z" />
                                                </svg>
                                            </div>
                                            <p className="text-[11px] text-[#006C49] font-medium">
                                                Alert sent at {item.time} via WhatsApp
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Trend Chart Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 transition-all duration-200 hover:border-[#3525CD] hover:shadow-md hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-[15px] font-bold text-gray-900">Attendance Trend</p>
                    <span className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
                        Last 6 Months
                    </span>
                </div>
                <TrendChart />
            </div>
        </div>
    )
}

function TrendChart() {
    const W = 260
    const H = 140
    const PAD_L = 10
    const PAD_R = 10
    const PAD_T = 10
    const PAD_B = 28   // space for month labels
    const MIN_REQ = 75   // dashed line value
    const MIN_Y_VAL = 70
    const MAX_Y_VAL = 100

    const chartW = W - PAD_L - PAD_R
    const chartH = H - PAD_T - PAD_B

    const n = TREND_DATA.length

    // x position for each point
    function xPos(i: number) {
        return PAD_L + (i / (n - 1)) * chartW
    }

    // y position — flipped (higher value = lower y)
    function yPos(v: number) {
        return PAD_T + chartH - ((v - MIN_Y_VAL) / (MAX_Y_VAL - MIN_Y_VAL)) * chartH
    }

    // Min required dashed line y
    const minReqY = yPos(MIN_REQ)

    // Build polyline points
    const points = TREND_DATA.map((d, i) => `${xPos(i)},${yPos(d.value)}`).join(" ")

    return (
        <svg
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            style={{ overflow: "visible" }}
        >
            {/* Vertical grid lines */}
            {TREND_DATA.map((_, i) => (
                <line
                    key={i}
                    x1={xPos(i)} y1={PAD_T}
                    x2={xPos(i)} y2={PAD_T + chartH}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                />
            ))}

            {/* Min Required 75% dashed line */}
            <line
                x1={PAD_L} y1={minReqY}
                x2={W - PAD_R} y2={minReqY}
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeDasharray="5,4"
                opacity="0.7"
            />
            {/* Min Required label */}
            <text
                x={W - PAD_R}
                y={minReqY - 4}
                textAnchor="end"
                fontSize="9"
                fill="#ef4444"
                fontWeight="600"
            >
                Min Required 75%
            </text>

            {/* Trend polyline */}
            <polyline
                points={points}
                fill="none"
                stroke="#818cf8"
                strokeWidth="1.5"
                strokeLinejoin="round"
                opacity="0.5"
            />

            {/* Dots + month labels */}
            {TREND_DATA.map((d, i) => {
                const x = xPos(i)
                const y = yPos(d.value)
                const isLast = i === n - 1
                return (
                    <g key={i}>
                        {/* Dot */}
                        <circle
                            cx={x} cy={y} r={isLast ? 5 : 4.5}
                            fill={isLast ? "#4f46e5" : "#6366f1"}
                            stroke="white"
                            strokeWidth="2"
                        />
                        {/* Month label */}
                        <text
                            x={x}
                            y={H - 4}
                            textAnchor="middle"
                            fontSize="11"
                            fontWeight={isLast ? "700" : "400"}
                            fill={isLast ? "#4f46e5" : "#9ca3af"}
                        >
                            {d.month}
                        </text>
                    </g>
                )
            })}
        </svg>
    )
}