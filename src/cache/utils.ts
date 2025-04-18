import { createHash } from "crypto";

export const createCacheHash = (url: string) => {
	const hasher = (input: string) =>
		createHash("sha256").update(input).digest("hex");

	const forwardUrlHash = hasher(url);
	const reverseUrlHash = hasher(url.split("").reverse().join(""));

	return `${forwardUrlHash}:${reverseUrlHash}`;
};
