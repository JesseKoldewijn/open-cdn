export const getFileBufferFromUrl = async (url: string) => {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(
				`Failed to fetch file from URL: ${response.statusText}`
			);
		}
		console.log("File buffer fetched successfully", {
			url,
			status: response.status,
			statusText: response.statusText,
		});
		const arrayBuffer = await response.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		console.log("Buffer created successfully", {
			url,
			status: response.status,
			statusText: response.statusText,
			bufferLength: buffer.length,
		});
		return buffer;
	} catch (error) {
		console.error("Error fetching file buffer:", error);
		return null;
	}
};
