import { MessageCircle, Book, CheckCheck } from "lucide-react";

interface WAPreviewProps {
  title: string;
  subject: string;
  className: string;
  dueDate: string;
}

const WAPreview = ({ title, subject, className, dueDate }: WAPreviewProps) => (
  <div className="bg-[#e5ddd5] rounded-2xl p-4">
    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2.5 flex items-center gap-1.5">
      <MessageCircle className="text-[#25d366] text-base w-4 h-4 inline-block" /> WhatsApp Preview
    </div>
    <div className="flex justify-end">
      <div className="max-w-[260px] bg-[#dcf8c6] rounded-2xl rounded-br-sm px-4 py-3 shadow-sm">
        <p className="text-[11px] font-black text-[#075e54] mb-1"><Book className="inline-block w-4 h-4 mr-1 align-text-bottom" /> New Homework Assigned</p>
        <p className="text-[12px] text-gray-800 font-semibold leading-snug">{title || "Homework Title"}</p>
        <p className="text-[11px] text-gray-500 mt-1">Subject: <span className="font-semibold">{subject || "—"}</span></p>
        <p className="text-[11px] text-gray-500">Class: <span className="font-semibold">{className || "—"}</span></p>
        <p className="text-[11px] text-gray-500">Due: <span className="font-semibold text-red-600">{dueDate || "—"}</span></p>
        <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">Please ensure your child completes and submits this homework on time. Contact the class teacher for any queries.</p>
        <div className="flex justify-end mt-1">
          <span className="text-[10px] text-gray-400">10:30 AM <CheckCheck className="inline-block w-4 h-4 align-text-bottom" /></span>
        </div>
      </div>
    </div>
  </div>
);

export default WAPreview;
