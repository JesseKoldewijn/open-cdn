export const getImageParams = (c: Record<string, string>) =>
	Object.keys(c).reduce(
		(acc, key) => {
			acc[key as keyof typeof acc] = c[key];

			return acc;
		},
		{} as {
			width?: string;
			height?: string;
			quality?: string;
			format?: string;
		}
	);
