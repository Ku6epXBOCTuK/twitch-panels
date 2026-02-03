import { loadFonts } from "$lib/fonts";
import { loadImages } from "$lib/images";
import type { PageLoad } from "./$types";

export async function load(): Promise<PageLoad> {
  let images = loadImages();
  let fonts = loadFonts();

  return {
    images,
    fonts,
  };
}

export const prerender = true;
