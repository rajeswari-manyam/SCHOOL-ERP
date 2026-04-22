// utils/number.utils.ts

export const numberToWords = (num: number): string => {
  if (num == null || isNaN(num)) return "Zero Rupees Only";

  const ones = [
    "", "One", "Two", "Three", "Four", "Five",
    "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
    "Sixteen", "Seventeen", "Eighteen", "Nineteen",
  ];

  const tens = [
    "", "", "Twenty", "Thirty", "Forty",
    "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
  ];

  const convertBelowHundred = (n: number): string => {
    if (n < 20) return ones[n];
    return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
  };

  const convertBelowThousand = (n: number): string => {
    if (n < 100) return convertBelowHundred(n);
    return (
      ones[Math.floor(n / 100)] +
      " Hundred" +
      (n % 100 ? " " + convertBelowHundred(n % 100) : "")
    );
  };

  let result = "";
  let rupees = Math.floor(num);
  let paise = Math.round((num - rupees) * 100);

  if (rupees >= 10_000_000) {
    result += convertBelowThousand(Math.floor(rupees / 10_000_000)) + " Crore ";
    rupees %= 10_000_000;
  }
  if (rupees >= 100_000) {
    result += convertBelowThousand(Math.floor(rupees / 100_000)) + " Lakh ";
    rupees %= 100_000;
  }
  if (rupees >= 1_000) {
    result += convertBelowThousand(Math.floor(rupees / 1_000)) + " Thousand ";
    rupees %= 1_000;
  }
  if (rupees > 0) {
    result += convertBelowThousand(rupees);
  }

  let final = result.trim() || "Zero";

  if (paise > 0) {
    final += ` Rupees and ${convertBelowHundred(paise)} Paise Only`;
  } else {
    final += " Rupees Only";
  }

  return final;
};