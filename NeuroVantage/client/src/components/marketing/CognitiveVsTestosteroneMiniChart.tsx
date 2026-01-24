export function CognitiveVsTestosteroneMiniChart() {
  const treatmentResponseData = [
    { label: "Start", months: 0, cognition: 42, totalT: 280 },
    { label: "1 mo", months: 1, cognition: 46, totalT: 380 },
    { label: "2 mo", months: 2, cognition: 50, totalT: 450 },
    { label: "3 mo", months: 3, cognition: 54, totalT: 520 },
    { label: "4 mo", months: 4, cognition: 57, totalT: 580 },
    { label: "6 mo", months: 6, cognition: 60, totalT: 630 },
  ];

  const xPositions = [10, 60, 110, 160, 210, 260];
  const yMin = 20;
  const yMax = 100;
  const cognitionDomain: [number, number] = [40, 65];
  const testosteroneDomain: [number, number] = [250, 650];

  const toY = (value: number, [min, max]: [number, number]) => {
    const clamped = Math.min(Math.max(value, min), max);
    const ratio = (clamped - min) / (max - min);
    return yMax - ratio * (yMax - yMin);
  };

  const cognitivePoints = treatmentResponseData
    .map((point, idx) => `${xPositions[idx]},${toY(point.cognition, cognitionDomain).toFixed(1)}`)
    .join(" ");
  const testosteronePoints = treatmentResponseData
    .map((point, idx) => `${xPositions[idx]},${toY(point.totalT, testosteroneDomain).toFixed(1)}`)
    .join(" ");

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-medium text-slate-500">
          Cognitive composite and total testosterone over 6 months
        </span>
        <div className="flex items-center gap-3 text-[10px] text-slate-500">
          <div className="flex items-center gap-1">
            <span className="inline-block h-[6px] w-[12px] rounded-full bg-sky-500" />
            <span>Cognitive composite</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-block h-[6px] w-[12px] rounded-full bg-emerald-500" />
            <span>Total testosterone</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-slate-50/60 p-3">
        <svg
          viewBox="0 0 280 120"
          className="w-full h-[120px]"
          role="img"
          aria-label="Illustrative graph of cognitive composite and total testosterone over 6 months"
        >
          <defs>
            <linearGradient id="gridFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e5edf7" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#f8fafc" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="280" height="120" fill="url(#gridFade)" rx="10" />
          {[20, 50, 80, 110].map((y) => (
            <line
              key={y}
              x1="24"
              x2="270"
              y1={y}
              y2={y}
              className="stroke-slate-200"
              strokeWidth="0.8"
              strokeDasharray="2 3"
            />
          ))}
          <line x1="24" y1="10" x2="24" y2="110" className="stroke-slate-300" strokeWidth="1" />
          <line x1="24" y1="110" x2="270" y2="110" className="stroke-slate-300" strokeWidth="1" />
          <polyline
            points={cognitivePoints}
            fill="none"
            className="stroke-sky-500"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {cognitivePoints.split(" ").map((pair, idx) => {
            const [x, y] = pair.split(",").map(Number);
            return <circle key={`cog-${idx}`} cx={x} cy={y} r="3" className="fill-sky-500" />;
          })}
          <polyline
            points={testosteronePoints}
            fill="none"
            className="stroke-emerald-500"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {testosteronePoints.split(" ").map((pair, idx) => {
            const [x, y] = pair.split(",").map(Number);
            return <circle key={`t-${idx}`} cx={x} cy={y} r="3" className="fill-emerald-500" />;
          })}
          {treatmentResponseData.map((point, idx) => (
            <text
              key={point.label}
              x={xPositions[idx]}
              y={118}
              textAnchor="middle"
              className="fill-slate-400 text-[9px]"
            >
              {point.label}
            </text>
          ))}
          <text
            x="2"
            y="18"
            className="fill-slate-400 text-[9px]"
            transform="rotate(-90 2 18)"
          >
            Normalized score (0–100)
          </text>
        </svg>

        <p className="mt-2 text-[10px] text-slate-500">
          Illustrative example only. Not real patient data.
        </p>
      </div>
    </div>
  );
}
