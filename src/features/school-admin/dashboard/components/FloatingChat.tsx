import { MessageCircle } from "lucide-react";

export const FloatingChat = () => {
  return (
    <button className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl transition hover:bg-emerald-600">
      <MessageCircle size={28} />
    </button>
  );
};
