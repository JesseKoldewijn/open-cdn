export const getFileBufferFromUrl = async (url: string) => {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(
				`Failed to fetch file from URL: ${response.statusText}`
			);
		}

		const arrayBuffer = await response.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		return buffer;
	} catch (error) {
		console.error("Error fetching file buffer:", error);
		return null;
	}
};
