interface FeeBannerProps {
  text: string;
  onPayNow?: () => void;
}

export function FeeBanner({ text, onPayNow }: FeeBannerProps) {
  return (
    <div
      className="
  w-[800px] h-[68px]
  flex items-center justify-between
  px-4
  bg-[#FFFBEB]
  border-l-4 border-[#F59E0B]
  rounded-tr-xl rounded-br-xl
  opacity-100

  transition-all duration-200 ease-in-out
  hover:bg-[#FFF7D6]
  hover:border-[#3525CD]
  hover:shadow-md
  hover:-translate-y-[1px]
  cursor-pointer
"
    >
      <div className="flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 2L14.5 13H1.5L8 2Z" stroke="#92400E" strokeWidth="1.3" />
          <path d="M8 6.5v3" stroke="#92400E" strokeWidth="1.3" strokeLinecap="round" />
          <circle cx="8" cy="11" r="0.6" fill="#92400E" />
        </svg>

        <span className="text-[13px] text-[#92400E] font-medium">
          {text}
        </span>
      </div>

      <button
        onClick={onPayNow}
        className="
          shrink-0
          bg-[#006C49]
          text-white
          text-[12px] font-semibold
          px-4 py-1.5
          rounded-lg
          hover:bg-[#1a2f47]
          transition-colors
        "
      >
        Pay Now
      </button>
    </div>
  );
}