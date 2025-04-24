import { db } from "../db/connection";
import { files } from "../db/schema";
import { CreateImageResponseArguments } from "../image/create-image-response";
import { createCacheHash } from "./utils";

export const setFileCache = async (
  fileBuffer: Buffer<ArrayBuffer>,
  url: string,
  mimeType: string,
  imageOptions: CreateImageResponseArguments["imageOptions"],
) => {
  const { width, height, quality, format } = imageOptions;
  const cacheKey = createCacheHash(
    `${url}_${width}_${height}_${quality}_${format}`,
  );

  const safeParseToNumber = (value: unknown) => {
    if (typeof value === "number") {
      return value;
    } else if (typeof value === "string") {
      const parsedValue = parseInt(value, 10);
      return isNaN(parsedValue) ? 100 : parsedValue;
    }
    return 100;
  };

  // Assuming you have a function to insert the cache into your database
  const insertedCache = await db
    .insert(files)
    .values({
      file_name: url.split("/").pop() ?? "unknown",
      byte_size: fileBuffer.byteLength,
      remote_url: url,
      file_hash: cacheKey,
      mime_type: mimeType,
      file_extension: format ?? mimeType.split("/")[1],
      file_base64: fileBuffer.toString("base64"),
      file_width: safeParseToNumber(width ?? 100),
      file_height: safeParseToNumber(height ?? 100),
      file_quality: safeParseToNumber(quality ?? 100),
      createdAt: Math.floor(Date.now() / 1000),
    })
    .execute();

  if (insertedCache[0].affectedRows === 0) {
    return {
      error: "Failed to insert cache",
      fileType: null,
      response: null,
    };
  }

  return insertedCache;
};
