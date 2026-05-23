import type { ContactInfo } from "../types/profile.types";
import { Card, CardContent } from "@/components/ui/card";
import typography from "@/styles/typography";
export function ContactInfoCard({ contact }: { contact: ContactInfo }) {
  return (
    <Card className="rounded-2xl border-0 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#3525CD] hover:border-1 transition-all duration-300">
      <CardContent className="p-6">

        {/* Header */}
        <p className="text-[15px] font-bold text-[#0B1C30] mb-5">
          Contact Information
        </p>

        {/* Responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">

          <div>
            <p className={typography.form.label + " text-gray-400 uppercase tracking-widest mb-1"}>
              Father Name
            </p>
            <p className={typography.body.small + " text-[#0B1C30]"}>
              {contact.fatherName}
            </p>
          </div>

          <div>
            <p className={typography.form.label + " text-gray-400 uppercase tracking-widest mb-1"}>
              Father Phone
            </p>
            <div className="flex items-center gap-2">
              <p className={typography.body.small + " text-[#0B1C30]"}>
                {contact.fatherPhone}
              </p>
              <span className="text-[10px] text-gray-400 bg-[#F1F5F9] px-2 py-0.5 rounded-md">
                Read-only
              </span>
            </div>
          </div>

          <div>
            <p className={typography.form.label + " text-gray-400 uppercase tracking-widest mb-1"}>
              Mother Name
            </p>
            <p className={typography.body.small + " text-[#0B1C30]"}>
              {contact.motherName}
            </p>
          </div>

          <div>
            <p className={typography.form.label + " text-gray-400 uppercase tracking-widest mb-1"}>
              Mother Email
            </p>
            <p className={typography.body.small + " text-[#0B1C30]"}>
              {contact.motherEmail}
            </p>
          </div>

          <div className="col-span-2">
            <p className={typography.form.label + " text-gray-400 uppercase tracking-widest mb-1"}>
              Emergency Contact
            </p>
            <p className={typography.body.small + " text-[#0B1C30]"}>
              {contact.emergencyContact}
            </p>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}