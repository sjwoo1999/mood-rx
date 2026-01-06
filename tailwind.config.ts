import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          primary: "#2563EB",   // blue-600
          secondary: "#0D9488", // teal-600
          accent: "#F59E0B",    // amber-500
        },
        emotion: {
          anxious: "#2563EB",   // blue-600
          angry: "#E11D48",     // rose-600
          sad: "#4F46E5",       // indigo-600
          tired: "#F59E0B",     // amber-500
          confused: "#334155",  // slate-700
        },
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};
export default config;
