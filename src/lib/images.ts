import { building } from "$app/environment";
import { readdirSync } from "node:fs";
import { join } from "path";

export function loadImages() {
  try {
    const imagesDir = join(process.cwd(), "static", "backgrounds");
    const files = readdirSync(imagesDir);

    let fonts = files.filter((file) => /\.(png|jpg)$/i.test(file));

    return fonts;
  } catch (error) {
    return [];
  }
}
