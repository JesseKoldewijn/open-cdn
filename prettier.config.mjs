/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').options} */
const config = {
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  // Import sorting
  importOrder: [
    "^next/(.*)$",
    "^@next/(.*)$",
    "react",
    "^@/(.*)$",
    "^@/(.css)$",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  // Tailwind
  tailwindAttributes: ["className"],
  tailwindFunctions: ["clsx", "cn", "twMerge"],
};

export default config;
