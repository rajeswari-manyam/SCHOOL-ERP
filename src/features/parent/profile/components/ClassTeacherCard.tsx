import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail } from "lucide-react";
import typography from "@/styles/typography";

export interface ClassTeacherInfo {
  name: string;
  phone: string;
  email: string;
  photo?: string | null;
}

export function ClassTeacherCard({ teacher }: { teacher: ClassTeacherInfo | null }) {
  if (!teacher) return null;

  const initials = teacher.name
    .split(" ").filter(Boolean)
    .map((w) => w[0]?.toUpperCase())
    .join("").slice(0, 2);

  return (
    <Card className="rounded-2xl border-0 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#3525CD] hover:border-1 transition-all duration-300">
      <CardContent className="p-6">
        <p className="text-[15px] font-bold text-[#0B1C30] mb-5">
          Class Teacher
        </p>

        <div className="flex items-center gap-3">
          {teacher.photo ? (
            <img src={teacher.photo} alt={teacher.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#3525CD] flex items-center justify-center text-[14px] font-bold text-white shrink-0">
              {initials}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className={typography.body.small + " text-[#0B1C30] font-semibold truncate"}>
              {teacher.name}
            </p>
            <div className="flex flex-col gap-0.5 mt-1">
              {teacher.phone && (
                <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
                  <Phone size={11} strokeWidth={1.2} className="shrink-0" />
                  <span>{teacher.phone}</span>
                </div>
              )}
              {teacher.email && (
                <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
                  <Mail size={11} strokeWidth={1.2} className="shrink-0" />
                  <span className="truncate">{teacher.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
