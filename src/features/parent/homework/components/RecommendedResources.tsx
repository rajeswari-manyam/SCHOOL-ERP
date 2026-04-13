import { Card, CardContent } from "@/components/ui/card";
import typography, { combineTypography } from "@/styles/typography";

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ display: "block" }} xmlns="http://www.w3.org/2000/svg">
    <path d="M7 1v8M4 6l3 3 3-3M1 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ display: "block" }} xmlns="http://www.w3.org/2000/svg">
    <path d="M5.5 8.5l3-3M8 5l1.5-1.5a2.12 2.12 0 013 3L11 8M6 9l-1.5 1.5a2.12 2.12 0 01-3-3L3 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const resources = [
  { id: "1", title: "Math Formulas 101", subtitle: "Class 10 Revision", type: "download" },
  { id: "2", title: "Light Refraction Video", subtitle: "Science Lab Supplement", type: "link" },
];

export function RecommendedResources() {
  return (
    <Card className="border-none shadow-none bg-white">
      <CardContent className="p-4 flex flex-col gap-3">

        <p className={combineTypography(typography.body.small, "font-semibold text-[#0B1C30]")}>
          Recommended Resources
        </p>

        <div className="flex flex-col gap-2">
          {resources.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-[#F8FAFC] hover:bg-[#3525CD] transition-all duration-200 cursor-pointer group"
            >
              <div>
                <p className={combineTypography(typography.body.small, "font-semibold text-[#0B1C30] group-hover:text-white")}>
                  {r.title}
                </p>
                <p className={combineTypography(typography.body.xs, "text-gray-400 group-hover:text-white/70")}>
                  {r.subtitle}
                </p>
              </div>

              <span className="flex items-center text-gray-300 group-hover:text-white">
                {r.type === "download" ? <DownloadIcon /> : <LinkIcon />}
              </span>
            </div>
          ))}
        </div>

        <button className="w-full py-2 rounded-xl border border-[#E8EBF2] text-[12px] font-semibold text-[#3525CD] hover:bg-[#3525CD] hover:text-white transition-all">
          View All Study Materials
        </button>

      </CardContent>
    </Card>
  );
}