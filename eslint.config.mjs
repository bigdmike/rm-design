import { defineConfig } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import vuePlugin from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default defineConfig([
  // 1. 忽略不需要掃描的資料夾
  {
    ignores: ["node_modules/**", "dist/**", ".nuxt/**"]
  },

  // 2. 引入 compat (舊版設定相容)
  ...compat.extends("plugin:compat/recommended"),

  // 3. 設定 .vue 檔案的解析器與比對範圍 (核心關鍵！)
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      }
    },
    plugins: {
      vue: vuePlugin
    }
  },

  // 4. 全域指定要檢查的檔案副檔名
  {
    files: ["**/*.{js,mjs,cjs,ts,vue}"]
  }
]);