import eslint from "@eslint/js";
import nextTypescript from "eslint-config-next/typescript";

export default [
  { ignores: ["**/node_modules/**", "**/.next/**", "**/dist/**", "artifacts/**", "logs/**"] },
  eslint.configs.recommended,
  ...nextTypescript
];
