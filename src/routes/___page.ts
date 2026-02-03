import type { PageLoad } from "./$types";

export function load(): PageLoad {
  return {
    images: imageFiles,
  };
}

export const prerender = true;
