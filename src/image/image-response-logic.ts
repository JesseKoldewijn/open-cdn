import { eq } from "drizzle-orm";
import { Context } from "hono";
import { z } from "zod";

import { getFileCache } from "../cache/get-cache";
import { setFileCache } from "../cache/set-cache";
import { createCacheHash } from "../cache/utils";
import { db } from "../db/connection";
import { files } from "../db/schema";
import { getFileBufferFromUrl } from "../file-path/get-file-buffer";
import { getFileUrl } from "../file-path/get-url";
import { createImageResponse } from "./create-image-response";
import { getImageParams } from "./get-image-params";
import { findSupportedFileType } from "./supported-file-types";

const getParams = (c: Context, isDirectQuery?: boolean) => {
  const params = c.req.param();
  const searchParams = c.req.query();

  if (isDirectQuery) {
    const urlParam = searchParams["dq-url"];

    if (!urlParam) {
      return {
        error: "Invalid URL parameters",
        params: {
          searchParams,
          isDirectQuery,
        },
      };
    }

    const url = new URL(urlParam);

    const dqPrefixedSearchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (key !== "dq-url") {
        const unprefixedKey = key.replace(/^dq-/, "");
        dqPrefixedSearchParams.set(unprefixedKey, `${value}`);
      }
    }

    return {
      error: null,
      params: {
        ...params,
        proto: url.protocol.replace(":", ""),
        domain: url.hostname.split(".").slice(0, -1).join("."),
        tld: url.hostname.split(".").at(-1),
        filepath: url.pathname,
      },
      searchParams: dqPrefixedSearchParams,
    };
  }
  return {
    error: null,
    params,
    searchParams,
  };
};

export const returnImageResponseFromContext = async (
  c: Context,
  logicOptions?: {
    isDirectQuery?: boolean;
  },
) => {
  const {
    params,
    searchParams,
    error: paramsError,
  } = getParams(c, logicOptions?.isDirectQuery);

  if (paramsError) {
    return c.json(
      {
        error: paramsError,
        details: params,
      },
      { status: 400 },
    );
  }

  const paramValidator = z.object({
    proto: z.enum(["http", "https"]),
    domain: z.string().min(1),
    tld: z.string().min(2),
    filepath: z.string(),
  });

  const validationResult = paramValidator.safeParse(params);

  if (!validationResult.success || !searchParams) {
    return c.json(
      {
        error: "Invalid URL parameters",
        details: validationResult.error?.format(),
        input: params,
      },
      { status: 400 },
    );
  }

  const filePath = findSupportedFileType(validationResult.data.filepath);

  if (!filePath) {
    return c.json(
      {
        error: "File type not supported or not defined",
      },
      { status: 415 },
    );
  }

  const file = getFileUrl(validationResult.data);

  if (file.error || !file.url) {
    return c.json(
      {
        error: "File not found",
        details: file.error,
      },
      { status: 404 },
    );
  }

  const { width, height, quality, format } = getImageParams(
    searchParams as Record<string, string>,
  );

  const cache = await getFileCache(file.url.href.toString(), {
    width,
    height,
    quality,
    format,
  });

  if (cache && cache.response !== null) {
    return cache.response;
  }

  const fileBuffer = await getFileBufferFromUrl(file.url.href.toString());

  if (!fileBuffer || fileBuffer.byteLength === 0 || !filePath) {
    return c.json(
      {
        error: "File not found",
        details: {
          file,
          msg: "File buffer is empty or undefined",
        },
      },
      { status: 404 },
    );
  }

  const imageFileResponse = await createImageResponse({
    fileBuffer,
    filePath: validationResult.data.filepath,
    imageOptions: { width, height, quality, format },
  });

  if (imageFileResponse.error) {
    return c.json(
      {
        error: imageFileResponse.error,
      },
      { status: 500 },
    );
  }

  if (!imageFileResponse.fileType || !imageFileResponse.response) {
    return c.json(
      {
        error: "File not found",
      },
      { status: 404 },
    );
  }

  const fileHash = createCacheHash(
    `${filePath}_${width}_${height}_${quality}_${format}`,
  );

  const doesExist = await db
    .selectDistinct()
    .from(files)
    .where(eq(files.file_hash, fileHash))
    .execute();

  if (doesExist.length === 0) {
    // only create cache if at this point there's no existing cache
    setFileCache(fileBuffer, file.url.href, imageFileResponse.fileType, {
      width,
      height,
      quality,
      format,
    });
  }

  return imageFileResponse.response;
};
