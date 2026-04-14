

const TREND_DATA = [
  { month: "Nov", value: 88 },
  { month: "Dec", value: 91 },
  { month: "Jan", value: 95 },
  { month: "Feb", value: 89 },
  { month: "Mar", value: 93 },
  { month: "Apr", value: 92 },
];

const TrendChart = () => {
  const W = 260;
  const H = 140;
  const PAD_L = 10;
  const PAD_R = 10;
  const PAD_T = 10;
  const PAD_B = 25;

  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;

  const xs = TREND_DATA.map((d) => d.month);
  const ys = TREND_DATA.map((d) => d.value);

  const minY = Math.min(...ys);
  const maxY = Math.max(...ys) + 5;

  const scaleX = (i: number) =>
    PAD_L + (i / (xs.length - 1)) * innerW;

  const scaleY = (v: number) =>
    PAD_T + innerH - ((v - minY) / (maxY - minY)) * innerH;

  const points = TREND_DATA
    .map((d, i) => `${scaleX(i)},${scaleY(d.value)}`)
    .join(" ");

  return (
    <svg width={W} height={H} className="overflow-visible">
      {/* Grid lines */}
      <line
        x1={PAD_L}
        y1={scaleY(minY)}
        x2={W - PAD_R}
        y2={scaleY(minY)}
        stroke="#E8EBF2"
        strokeWidth="1"
      />
      <line
        x1={PAD_L}
        y1={scaleY(maxY)}
        x2={W - PAD_R}
        y2={scaleY(maxY)}
        stroke="#E8EBF2"
        strokeWidth="1"
      />

      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke="#3525CD"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />

      {/* Dots */}
      {TREND_DATA.map((d, i) => (
        <circle
          key={i}
          cx={scaleX(i)}
          cy={scaleY(d.value)}
          r="3"
          fill="#3525CD"
        />
      ))}

      {/* X labels */}
      {xs.map((label, i) => (
        <text
          key={i}
          x={scaleX(i)}
          y={H - 4}
          textAnchor="middle"
          fontSize="10"
          fill="#6B7280"
        >
          {label}
        </text>
      ))}

      {/* Y labels */}
      <text x={PAD_L} y={PAD_T + 10} fontSize="10" fill="#6B7280">
        {maxY}
      </text>
      <text x={PAD_L} y={H - 10} fontSize="10" fill="#6B7280">
        {minY}
      </text>
    </svg>
  );
};

export default TrendChart;