import { readFileSync } from "fs";
import { globSync } from "glob";

const includePatterns = ["src/**/*.svelte", "src/**/*.css"];

const files = globSync(includePatterns);

const defined = new Set();
const used = new Set();
const usageLocations = [];

files.forEach((file) => {
  const content = readFileSync(file, "utf-8");
  const lines = content.split("\n");

  const defMatches = content.matchAll(/--[\w-]+(?=\s*:)/g);
  for (const m of defMatches) {
    defined.add(m[0]);
  }

  lines.forEach((line, idx) => {
    const varMatches = line.matchAll(/var\(\s*--[\w-]+\s*\)/g);
    for (const match of varMatches) {
      const varName = match[0].slice(4, -1).trim();
      used.add(varName);

      usageLocations.push({
        file,
        line: idx + 1,
        column: match.index + 1,
        varName,
      });
    }
  });
});

let hasUndefined = false;
const undefinedErrors = usageLocations.filter((loc) => !defined.has(loc.varName));

undefinedErrors.forEach(({ file, line, column, varName }) => {
  console.error(`❌ ${file}:${line}:${column} — не определена CSS-переменная "${varName}"`);
  hasUndefined = true;
});

const unused = [...defined].filter((varName) => !used.has(varName));
if (unused.length > 0) {
  console.warn("\n⚠️  Объявлены, но нигде не используются:");
  unused.forEach((varName) => console.warn(`   ${varName}`));
}

if (hasUndefined) {
  console.error("\n❌ Найдены неопределённые переменные. Исправьте их.");
  process.exit(1);
} else {
  if (unused.length === 0) {
    console.log("\n✅ Все CSS-переменные определены и используются.");
  } else {
    console.log("\n✅ Неопределённых переменных нет, но есть неиспользуемые (см. предупреждения).");
  }
  process.exit(0);
}
