import type { Child } from "../types/profile.types";
import { Card, CardContent } from "@/components/ui/card";
import typography from "@/styles/typography";

export function ChildrenCard({ children }: { children: Child[] }) {
  return (
    <Card className="rounded-2xl border-0 shadow-sm hover:shadow-md hover:border-1 hover:border-[#3525CD] transition-shadow mt-5">

      <CardContent className="p-5">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <span className={typography.form.label + " text-[#0B1C30]"}>
            My Children
          </span>

          <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-[#6CF8BB]/10 text-[#006C49]">
            {children.length} REGISTERED
          </span>
        </div>

        {/* LIST */}
        <div className="flex flex-col gap-2">
          {children.map((c) => (
            <div
              key={c.id}
              className="
                flex items-center justify-between
                px-3 py-3 rounded-xl bg-[#F8FAFC]
                hover:bg-[#F1F5FF]
                transition-colors
              "
            >
              {/* LEFT */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                  style={{ background: c.avatarColor }}
                >
                  {c.initials}
                </div>

                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-[#0B1C30] truncate">
                    {c.name}
                  </p>
                  <p className="text-[11px] text-gray-400 truncate">
                    {c.class} | {c.admissionNo}
                  </p>
                </div>
              </div>

              {/* RIGHT STATUS */}
              <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-[#006C49]/10 text-[#006C49]">
                {c.status}
              </span>
            </div>
          ))}
        </div>

        {/* FOOTER BUTTON */}
        <button className="w-full mt-4 text-[12px] font-semibold text-[#3525CD] hover:underline">
          View Academic Progress →
        </button>

      </CardContent>
    </Card>
  );
}