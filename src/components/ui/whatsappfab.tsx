import { SiWhatsapp } from 'react-icons/si';

const WhatsAppFAB = () => (
  <button
    className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:bg-[#1ebe5d] hover:scale-105 transition-all z-30"
    aria-label="WhatsApp"
  >
    <SiWhatsapp className="w-6 h-6 text-white" />
  </button>
);

export default WhatsAppFAB;