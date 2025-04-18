import sharp from "sharp";

export interface CreateImageResponseArguments {
	fileBuffer: Buffer;
	filePath: string;
	imageOptions: {
		width?: string;
		height?: string;
		quality?: string;
		format?: string;
	};
}

export const createImageResponse = async ({
	fileBuffer,
	filePath,
	imageOptions,
}: CreateImageResponseArguments) => {
	try {
		const { width, height, quality, format = "png" } = imageOptions;

		if (!fileBuffer) {
			return {
				error: "File not found",
				fileType: null,
				response: null,
			};
		}

		const supportedFileTypes = {
			images: ["jpg", "jpeg", "png", "gif", "webp", "avif", "ico", "svg"],
		};

		const fileType = fileBuffer?.byteLength
			? filePath.toString().split(".").pop() ?? null
			: null;

		const isImageResponse = supportedFileTypes.images.includes(
			fileType ?? ""
		);

		if (!isImageResponse) {
			return {
				error: "Unsupported file type",
				fileType: null,
				response: null,
			};
		}

		const isIco = fileType === "ico";

		const sharpImage = !isIco
			? sharp(fileBuffer)
			: {
					resize: () => sharpImage,
					toFormat: () => sharpImage,
					toBuffer: async () => ({
						data: Buffer.from(fileBuffer),
						info: {
							format: "ico",
						},
					}),
					jpeg: () => sharpImage,
					png: () => sharpImage,
			  };

		if (width || height) {
			sharpImage.resize(
				width ? parseInt(width) : undefined,
				height ? parseInt(height) : undefined
			);
		}

		if (quality) {
			sharpImage.jpeg({ quality: parseInt(quality) });
		}

		if (format !== null && format !== undefined) {
			sharpImage.toFormat(format as keyof sharp.FormatEnum);
		}

		const sharpImageToBuffer = await sharpImage.toBuffer({
			resolveWithObject: true,
		});

		const { data: imageBuffer } = sharpImageToBuffer;

		const fileName = filePath.split("/").pop() ?? filePath;

		const response = new Response(imageBuffer, {
			headers: {
				"Content-Type": isImageResponse
					? `image/${fileType}`
					: "application/octet-stream",
				"Content-Length": fileBuffer?.byteLength.toString() ?? "0",
				"Content-Disposition": `filename=${fileName}`,
			},
			status: 200,
		});

		return {
			error: null,
			fileType,
			response,
		};
	} catch (error) {
		console.error("Error creating image response:", error);
		return {
			error: "Internal server error",
			fileType: null,
			response: null,
		};
	}
};
