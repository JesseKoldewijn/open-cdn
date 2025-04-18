import { db } from "../db/connection";
import {
	createImageResponse,
	CreateImageResponseArguments,
} from "../image/create-image-response";
import { createCacheHash } from "./utils";

export const getFileCache = async (
	url: string,
	imageOptions: CreateImageResponseArguments["imageOptions"]
) => {
	const { width, height, quality, format } = imageOptions;
	const cacheKey = createCacheHash(
		`${url}_${width}_${height}_${quality}_${format}`
	);
	const cache = await db.query.files.findFirst({
		where: (files, { eq }) =>
			eq(files.file_hash, cacheKey) && eq(files.remote_url, url),
	});

	if (cache) {
		const cachedResponse = await createImageResponse({
			fileBuffer: Buffer.from(cache.file_base64, "base64"),
			filePath: cache.file_name,
			imageOptions: { width, height, quality, format },
		});
		if (cachedResponse.error) {
			return {
				error: cachedResponse.error,
				fileType: null,
				response: null,
			};
		}
		if (!cachedResponse.fileType || !cachedResponse.response) {
			return {
				error: "File not found",
				fileType: null,
				response: null,
			};
		}
		return {
			error: null,
			fileType: cachedResponse.fileType,
			response: cachedResponse.response,
		};
	}

	return {
		error: "File not cached",
		fileType: null,
		response: null,
	};
};
