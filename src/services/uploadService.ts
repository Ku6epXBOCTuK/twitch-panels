export type UploadResult =
  | { ok: true; data: string; error?: never }
  | { ok: false; error: string; data?: never };

export const uploadService = {
  async _process(file: File): Promise<UploadResult> {
    if (!file.type.startsWith("image/")) {
      return { ok: false, error: "Not an image" };
    }
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const img = new Image();
      img.src = base64;
      await img.decode();

      return { ok: true, data: base64 };
    } catch {
      return { ok: false, error: "File damage or unsupported" };
    }
  },

  async fromFile(file: File | undefined): Promise<UploadResult> {
    if (!file) return { ok: false, error: "No file" };
    return this._process(file);
  },

  async fromClipboard(event: ClipboardEvent): Promise<UploadResult> {
    const file = event.clipboardData?.files[0];
    return this.fromFile(file);
  },

  async fromUrl(url: string): Promise<UploadResult> {
    if (!url) return { ok: false, error: "No url" };
    try {
      const response = await fetch(url);
      if (!response.ok) return { ok: false, error: "Invalid url" };
      const blob = await response.blob();
      const file = new File([blob], "image", { type: blob.type });
      return this._process(file);
    } catch {
      return { ok: false, error: "Invalid url, or CORS error" };
    }
  },
};
