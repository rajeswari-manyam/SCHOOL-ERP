
export const typography = {
 
  logo: {
    title: "text-3xl sm:text-4xl font-bold",
    subtitle: "text-lg text-gray-500",
    icon: "text-4xl",
  },
  heading: {
    h1: "text-3xl sm:text-5xl lg:text-7xl font-bold",
    h2: "text-2xl sm:text-4xl lg:text-6xl font-bold",
    h3: "text-xl sm:text-3xl lg:text-5xl font-bold",
    h4: "text-lg sm:text-2xl lg:text-3xl font-bold",
    h5: "text-base sm:text-xl lg:text-2xl font-bold",
    h6: "text-sm sm:text-lg lg:text-xl font-bold",
  },
  body: {
    large: "text-base sm:text-xl",
    base: "text-base sm:text-lg",
    small: "text-sm sm:text-base",
    xs: "text-xs sm:text-sm",
  },
  fontSize: {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
    "5xl": "text-5xl",
  },
  form: {
    label: "text-sm sm:text-base font-medium",
    input: "text-sm sm:text-base",
    helper: "text-xs sm:text-sm",
    error: "text-xs sm:text-sm text-red-600",
  },
};

export const combineTypography = (typographyClass: string, customClass?: string) =>
  customClass ? `${typographyClass} ${customClass}` : typographyClass;

export const fontSize = typography.fontSize;
export default typography;