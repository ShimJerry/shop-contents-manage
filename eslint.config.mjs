import tseslintParser from "@typescript-eslint/parser";
import vitest from "@vitest/eslint-plugin";
import eslint from "eslint-plugin-import";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist/", "examples/"], // dist/ 및 examples/ 폴더 무시
  },
  eslint.flatConfigs.recommended, // ✅ import 플러그인 Flat Config 적용
  tseslint.configs.recommended, // ✅ TypeScript ESLint 추천 설정 적용
  {
    settings: {
      "import/resolver": {
        typescript: true,
      },
    },
    rules: {
      eqeqeq: "error",
      curly: ["warn", "multi-line", "consistent"],
      "sort-imports": [
        "error",
        {
          ignoreDeclarationSort: true,
        },
      ],
      "import/no-unresolved": ["error", { commonjs: true, amd: true }],
      "import/named": "off",
      "import/namespace": "off",
      "import/no-named-as-default-member": "off",
      "import/no-duplicates": "error",
      "import/extensions": ["error", "always"],
      "import/order": [
        "error",
        {
          alphabetize: { order: "asc", caseInsensitive: true },
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
          ],
          "newlines-between": "never",
          pathGroups: [
            {
              pattern: "@/**",
              group: "builtin",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
        },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["tests/**/*.ts"],
    languageOptions: {
      parser: tseslintParser,
    },
    plugins: {
      vitest: vitest,
    },
    rules: {
      "import/extensions": ["error", "never"],
      "@typescript-eslint/no-unused-vars": "off",
      "vitest/expect-expect": "off",
      "vitest/consistent-test-it": [
        "error",
        { fn: "it", withinDescribe: "it" },
      ],
    },
  },
);
