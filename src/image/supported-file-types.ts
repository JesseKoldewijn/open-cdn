export const supportedFileTypes = {
	images: ["jpg", "jpeg", "png", "gif", "webp", "avif", "ico", "svg"],
} as const;

export const supportedFileTypesRegexPattern = Object.values(supportedFileTypes)
	.map((type) => type.join("|"))
	.join("|");

export const findSupportedFileType = (filePath: string) => {
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
