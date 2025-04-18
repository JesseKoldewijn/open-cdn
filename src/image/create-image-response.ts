import sharp from "sharp";

export const createImageResponse = async ({
	fileBuffer,
	filePath,
	imageOptions,
}: {
	fileBuffer: Buffer;
	filePath: string;
	imageOptions: {
		width?: string;
		height?: string;
		quality?: string;
		format?: string;
	};
}) => {
	try {
		const { width, height, quality, format } = imageOptions;

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

		const sharpImage = sharp(fileBuffer);

		if (width || height) {
			sharpImage.resize(
				width ? parseInt(width) : undefined,
				height ? parseInt(height) : undefined
			);
		}

		if (quality) {
			sharpImage.jpeg({ quality: parseInt(quality) });
		}

		if (format) {
			sharpImage.toFormat(format as keyof sharp.FormatEnum);
		}

		const response = new Response(fileBuffer, {
			headers: {
				"Content-Type": isImageResponse
					? `image/${fileType}`
					: "application/octet-stream",
				"Content-Length": fileBuffer?.byteLength.toString() ?? "0",
			},
			status: 200,
		});

		if (isImageResponse) {
			response.headers.set(
				"Content-Disposition",
				`inline; filename=${filePath}`
			);
		}

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
