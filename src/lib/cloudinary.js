/**
 * Cloudinary Integration for Portfolio (Blog Studio & Notes)
 * API Key: 999339691197845
 * Handles signed image uploads directly to Cloudinary CDN
 */

// Fallback SHA-1 implementation for environments where crypto.subtle is restricted
function sha1Fallback(msg) {
  function rotl(n, s) {
    return (n << s) | (n >>> (32 - s));
  }
  function toHexStr(n) {
    let s = "";
    for (let i = 7; i >= 0; i--) {
      const v = (n >>> (i * 4)) & 0xf;
      s += v.toString(16);
    }
    return s;
  }
  const utf8 = new TextEncoder().encode(msg);
  const words = [];
  for (let i = 0; i < utf8.length; i++) {
    words[i >> 2] |= utf8[i] << (24 - (i % 4) * 8);
  }
  words[utf8.length >> 2] |= 0x80 << (24 - (utf8.length % 4) * 8);
  words[(((utf8.length + 8) >> 6) << 4) + 15] = utf8.length * 8;

  let h0 = 0x67452301;
  let h1 = 0xefcdab89;
  let h2 = 0x98badcfe;
  let h3 = 0x10325476;
  let h4 = 0xc3d2e1f0;

  const w = new Array(80);
  for (let i = 0; i < words.length; i += 16) {
    let a = h0,
      b = h1,
      c = h2,
      d = h3,
      e = h4;
    for (let j = 0; j < 80; j++) {
      if (j < 16) {
        w[j] = (words[i + j] || 0) | 0;
      } else {
        w[j] = rotl(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
      }
      let f, k;
      if (j < 20) {
        f = (b & c) | (~b & d);
        k = 0x5a827999;
      } else if (j < 40) {
        f = b ^ c ^ d;
        k = 0x6ed9eba1;
      } else if (j < 60) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8f1bbcdc;
      } else {
        f = b ^ c ^ d;
        k = 0xca62c1d6;
      }
      const temp = (rotl(a, 5) + f + e + k + w[j]) | 0;
      e = d;
      d = c;
      c = rotl(b, 30);
      b = a;
      a = temp;
    }
    h0 = (h0 + a) | 0;
    h1 = (h1 + b) | 0;
    h2 = (h2 + c) | 0;
    h3 = (h3 + d) | 0;
    h4 = (h4 + e) | 0;
  }
  return [h0, h1, h2, h3, h4].map(toHexStr).join("");
}

export async function computeSHA1(str) {
  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    try {
      const buffer = await window.crypto.subtle.digest(
        "SHA-1",
        new TextEncoder().encode(str)
      );
      return Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    } catch {
      return sha1Fallback(str);
    }
  }
  return sha1Fallback(str);
}

export async function compressImageToDataUrl(file, maxWidth = 1600, maxHeight = 1000, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const CLOUDINARY_CONFIG = {
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || "999339691197845",
  apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET || "EhkeoGUOFGF1bujRj8jNuXnkfz0",
  getCloudName() {
    try {
      const local = localStorage.getItem("cloudinary_cloud_name");
      if (local && local.trim() && local.trim().toLowerCase() !== "gallery") {
        return local.trim();
      }
      if (local && local.trim().toLowerCase() === "gallery") {
        localStorage.removeItem("cloudinary_cloud_name");
      }
    } catch {
      // ignore
    }
    const envVal = (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "").trim();
    return envVal.toLowerCase() === "gallery" ? "" : envVal;
  },
  setCloudName(name) {
    try {
      if (name && name.trim() && name.trim().toLowerCase() !== "gallery") {
        localStorage.setItem("cloudinary_cloud_name", name.trim());
      } else {
        localStorage.removeItem("cloudinary_cloud_name");
      }
    } catch {
      // ignore
    }
  },
  isConfigured() {
    return Boolean(this.getCloudName() && this.apiKey && this.apiSecret);
  },
};

/**
 * Generate Cloudinary authentication signature for signed uploads.
 * Cloudinary requires parameters sorted alphabetically and serialized,
 * concatenated with the API secret, and hashed with SHA-1.
 */
export async function generateCloudinarySignature(params, apiSecret) {
  const sortedKeys = Object.keys(params).sort();
  const serialized = sortedKeys
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return computeSHA1(serialized + apiSecret);
}

/**
 * Upload an image file to Cloudinary with real-time signed authentication.
 *
 * @param {File|Blob} file The image file or blob to upload
 * @param {Object} options Upload options (folder, uploadPreset, cloudName)
 * @returns {Promise<{url: string, secure_url: string, public_id: string, width: number, height: number, format: string, bytes: number}>}
 */
export async function uploadImageToCloudinary(file, options = {}) {
  // Always prepare optimized local dataUrl first so image upload NEVER fails
  let fallbackDataUrl = "";
  try {
    fallbackDataUrl = await compressImageToDataUrl(file);
  } catch {
    try {
      fallbackDataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => resolve("");
        reader.readAsDataURL(file);
      });
    } catch {
      // ignore
    }
  }

  const cloudName = options.cloudName || CLOUDINARY_CONFIG.getCloudName();
  
  // If no valid cloud name or placeholder, return instant optimized image
  if (!cloudName || cloudName.toLowerCase() === "gallery") {
    return {
      url: fallbackDataUrl,
      secure_url: fallbackDataUrl,
      public_id: `local_${Date.now()}`,
      format: "jpeg",
      isFallback: true,
      success: true,
    };
  }

  const apiKey = options.apiKey || CLOUDINARY_CONFIG.apiKey;
  const apiSecret = options.apiSecret || CLOUDINARY_CONFIG.apiSecret;
  const folder = options.folder || "blog_images";
  const timestamp = Math.floor(Date.now() / 1000);

  try {
    const formData = new FormData();
    formData.append("file", file);

    if (options.uploadPreset) {
      formData.append("upload_preset", options.uploadPreset);
    } else {
      const paramsToSign = {
        folder,
        timestamp,
      };
      const signature = await generateCloudinarySignature(paramsToSign, apiSecret);
      formData.append("api_key", apiKey);
      formData.append("timestamp", String(timestamp));
      formData.append("folder", folder);
      formData.append("signature", signature);
    }

    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      return {
        url: data.url,
        secure_url: data.secure_url || data.url,
        public_id: data.public_id,
        width: data.width,
        height: data.height,
        format: data.format,
        bytes: data.bytes,
        isFallback: false,
        success: true,
      };
    }
  } catch (err) {
    console.warn("CDN upload fallback:", err);
  }

  return {
    url: fallbackDataUrl,
    secure_url: fallbackDataUrl,
    public_id: `local_${Date.now()}`,
    format: "jpeg",
    isFallback: true,
    success: true,
  };
}
