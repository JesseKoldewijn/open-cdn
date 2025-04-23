import { NextResponse } from "next/server";
import { supportedFileTypesRegexPattern } from "../../../image/supported-file-types";
import { returnImageResponseFromContext } from "../../../image/image-response-logic";

export const GET = async (req: Request) => {
	// Set the Cache-Control header to cache for 7 days
	// c.header(
	//     "Cache-Control",
	//     `public, max-age=${DateTimeConverter.convertToMilliseconds("days", 7)}`
	// );
	// // Application Default Headers
	// c.header("Vary", "Accept-Encoding");
	// c.header("Access-Control-Allow-Origin", "*");
	// c.header("Access-Control-Allow-Methods", "*");
	// c.header("Access-Control-Allow-Headers", "*");

	const url = req.url;
	const pathname = new URL(url).pathname;

	let params = pathname.split("/").slice(1);
	const isDirectQuery = params[0] === "direct-query";

	if (isDirectQuery) {
		const searchParams = new URL(req.url).searchParams;
		const remoteUrl = searchParams.get("dq-url");
		if (!remoteUrl) {
			return NextResponse.json({
				error: "Invalid URL parameters",
				details: {
					remoteUrl,
				},
			});
		}
		const url = new URL(remoteUrl);
		const proto = url.protocol.replace(":", "");
		const domain = url.hostname.split(".").slice(0, -1).join(".");
		const tld = url.hostname.split(".").at(-1);
		const filepath = url.pathname;
		const fileType = filepath.match(
			new RegExp(supportedFileTypesRegexPattern)
		);

		if (!proto || !domain || !tld || !filepath || !fileType) {
			return NextResponse.json({
				error: "Invalid URL parameters",
				details: {
					proto,
					domain,
					tld,
					filepath,
					fileType,
				},
			});
		}

		params[0] = proto;
		params[1] = domain;
		params[2] = tld;
		params[3] = filepath;
	}

	const proto = params[0];
	const domain = params[1];
	const tld = params[2];
	// filepath is any after tld
	const filepath = params.slice(3).join("/");
	const fileType = filepath.match(new RegExp(supportedFileTypesRegexPattern));

	if (!proto || !domain || !tld || !filepath || !fileType) {
		return NextResponse.json({
			error: "Invalid URL parameters",
			details: {
				proto,
				domain,
				tld,
				filepath,
				fileType,
			},
		});
	}

	return returnImageResponseFromContext(
		{
			req: {
				param: () => ({
					proto,
					domain,
					tld,
					filepath,
				}),
				query: () => {
					const searchParams = new URL(req.url).searchParams;
					const params: Record<string, string> = {};
					for (const [key, value] of searchParams.entries()) {
						params[key] = value;
					}
					return params;
				},
			},
		} as any,
		{
			isDirectQuery: true,
		}
	);
};
