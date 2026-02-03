import { building } from "$app/environment";
import { readdirSync } from "node:fs";
import { join } from "path";

export function loadFonts() {
  try {
    const fontsDir = join(process.cwd(), "static", "fonts");
    const files = readdirSync(fontsDir);

    let fonts = files
      .filter((file) => /\.(woff2|woff|ttf|otf)$/i.test(file))
      .map((file) => ({
        name: file.replace(/\.[^/.]+$/, ""),
        file,
        url: `/fonts/${file}`,
        format: getFormat(file),
      }));

    return fonts;
  } catch (error) {
    return [];
  }
}

function getFormat(filename: string) {
  if (filename.endsWith(".woff2")) return "woff2";
  if (filename.endsWith(".woff")) return "woff";
  if (filename.endsWith(".ttf")) return "truetype";
  return "opentype";
}
