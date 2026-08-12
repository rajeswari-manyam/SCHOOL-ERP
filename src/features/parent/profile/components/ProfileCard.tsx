import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, Briefcase, Pencil } from "lucide-react";
import { ImagePreviewModal } from "@/components/common/ImagePreviewModal";

import type { ProfileCardProps } from "../types/profile.types";
export function ProfileCard({
  name,
  initials,
  photo,
  role,
  phone,
  email,
  relation,
  occupation,
  address,
  onEdit,
}: ProfileCardProps) {
  const [showPhoto, setShowPhoto] = useState(false);

  return (
    <Card
      className="
        rounded-2xl border-0 shadow-sm
        hover:shadow-xl hover:-translate-y-1
        hover:border-[#3525CD]
        hover:border-1
        transition-all duration-300
      "
    >
      <CardContent className="p-5 text-center">

        {/* AVATAR */}
        {photo ? (
          <button type="button" onClick={() => setShowPhoto(true)} className="mx-auto block">
            <img
              src={photo}
              alt={name}
              className="w-[72px] h-[72px] rounded-full object-cover mx-auto mb-3 ring-1 ring-black/5 cursor-pointer hover:scale-105 transition-transform duration-200"
            />
          </button>
        ) : (
          <div className="
            w-[72px] h-[72px] rounded-full
            bg-[#3525CD] flex items-center justify-center
            text-[22px] font-bold text-white
            mx-auto mb-3
            hover:scale-105 transition-transform duration-200
          ">
            {initials}
          </div>
        )}

        {/* NAME */}
        <p className="text-[16px] font-bold text-[#0B1C30]">
          {name}
        </p>

        {/* ROLE / RELATION */}
        <p className="text-[12px] text-gray-400 mt-0.5">
          {relation ? `${role} · ${relation}` : role}
        </p>

        {/* DETAILS */}
        <div className="flex flex-col items-start gap-2 mt-4 text-left">
          {phone && (
            <div className="flex items-center gap-2 text-[12px] text-gray-500">
              <Phone size={12} strokeWidth={1.2} className="shrink-0" />
              <span>{phone}</span>
            </div>
          )}
          {email && (
            <div className="flex items-center gap-2 text-[12px] text-gray-500">
              <Mail size={12} strokeWidth={1.2} className="shrink-0" />
              <span className="truncate">{email}</span>
            </div>
          )}
          {occupation && occupation.toLowerCase() !== "not specified" && (
            <div className="flex items-center gap-2 text-[12px] text-gray-500">
              <Briefcase size={12} strokeWidth={1.2} className="shrink-0" />
              <span>{occupation}</span>
            </div>
          )}
          {address && (
            <div className="flex items-center gap-2 text-[12px] text-gray-500">
              <MapPin size={12} strokeWidth={1.2} className="shrink-0" />
              <span>{address}</span>
            </div>
          )}
        </div>

        {/* BUTTON */}
        <button
          onClick={onEdit}
          className="
            w-full mt-4 py-2.5
            border border-[#E8EBF2]
            rounded-xl
            text-[12px] font-semibold text-[#3525CD]
            flex items-center justify-center gap-1.5
            hover:bg-[#EEF2FF]
            active:scale-95
            transition-all duration-200
          "
        >
          <Pencil size={12} strokeWidth={1.5} />
          Edit Profile
        </button>

      </CardContent>

      {showPhoto && photo && (
        <ImagePreviewModal src={photo} alt={name} title={name} subtitle={role} onClose={() => setShowPhoto(false)} />
      )}
    </Card>
  );
}