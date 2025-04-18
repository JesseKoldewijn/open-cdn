import { Hono } from "hono";
import { DateTimeConverter } from "./utils/date-time/converts";
import { getFileUrl } from "./file-path/get-url";
import { z } from "zod";
import { getFileBufferFromUrl } from "./file-path/get-file-buffer";
import { createImageResponse } from "./image/create-image-response";
import { getImageParams } from "./image/get-image-params";

const app = new Hono();

// Middleware to add cache control headers
app.use("*", (c, next) => {
	// Set the Cache-Control header to cache for 7 days
	c.header(
		"Cache-Control",
		`public, max-age=${DateTimeConverter.convertToMilliseconds("days", 7)}`
	);

	// Application Default Headers
	c.header("Vary", "Accept-Encoding");
	c.header("Access-Control-Allow-Origin", "*");
	c.header("Access-Control-Allow-Methods", "*");
	c.header("Access-Control-Allow-Headers", "*");
	return next();
});

const supportedFileTypes = {
	images: ["jpg", "jpeg", "png", "gif", "webp", "avif", "ico", "svg"],
} as const;

const supportedFileTypesRegexPattern = Object.values(supportedFileTypes)
	.map((type) => type.join("|"))
	.join("|");

const findSupportedFileType = (filePath: string) => {
	// Extract the file extension from the file path
	const fileExtension = filePath.split(".").pop();
	if (!fileExtension) {
		return null;
	}
	// Check if the file extension is in the supported file types
	const isSupported = Object.values(supportedFileTypes).some((type) =>
		type.includes(fileExtension as any)
	);
	return isSupported ? fileExtension : null;
};

const dynamicUrlPathSegments = [
	// proto can be http or https
	":proto",
	// domain can be any valid domain name
	":domain",
	// tld can be any valid top-level domain which has to be more than 2 characters and can include dots
	":tld",
	// filepath can be any valid file path
	`:filepath{.+\\.(${supportedFileTypesRegexPattern})}`,
];

const dynamicUrlPathSegmentsString = dynamicUrlPathSegments.join("/");

app.get(dynamicUrlPathSegmentsString, async (c) => {
	const params = c.req.param();

	const paramValidator = z.object({
		proto: z.enum(["http", "https"]),
		domain: z.string().min(1),
		tld: z.string().min(2),
		filepath: z.string(),
	});

	const validationResult = paramValidator.safeParse(params);

	if (!validationResult.success) {
		return c.json(
			{
				error: "Invalid URL parameters",
				details: validationResult.error.format(),
			},
			{ status: 400 }
		);
	}

	const filePath = findSupportedFileType(validationResult.data.filepath);

	if (!filePath) {
		return c.json(
			{
				error: "File type not supported or not defined",
			},
			{ status: 415 }
		);
	}

	const file = getFileUrl(validationResult.data);

	if (file.error || !file.url) {
		return c.json(
			{
				error: "File not found",
			},
			{ status: 404 }
		);
	}

	const fileBuffer = await getFileBufferFromUrl(file.url.toString());

	if (!fileBuffer || fileBuffer.byteLength === 0 || !filePath) {
		return c.json(
			{
				error: "File not found",
			},
			{ status: 404 }
		);
	}

	const { width, height, quality, format } = getImageParams(c.req.query());

	const imageFileResponse = await createImageResponse({
		fileBuffer,
		filePath,
		imageOptions: { width, height, quality, format },
	});

	if (imageFileResponse.error) {
		return c.json(
			{
				error: imageFileResponse.error,
			},
			{ status: 500 }
		);
	}

	if (!imageFileResponse.fileType || !imageFileResponse.response) {
		return c.json(
			{
				error: "File not found",
			},
			{ status: 404 }
		);
	}

	// Log the response details
	console.log("Response details:", {
		fileType: imageFileResponse.fileType,
		fileBufferLength: fileBuffer?.byteLength,
		fileUrl: file.url,
		responseStatus: imageFileResponse.response.status,
		responseHeaders: imageFileResponse.response.headers,
	});

	return imageFileResponse.response;
});

export default app;
