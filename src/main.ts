import { Hono } from "hono";
import { DateTimeConverter } from "./utils/date-time/converts";
import { returnImageResponseFromContext } from "./image/image-response-logic";
import { supportedFileTypesRegexPattern } from "./image/supported-file-types";

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

app.get(dynamicUrlPathSegmentsString, async (c) =>
	returnImageResponseFromContext(c)
);

app.get("direct-query", async (c) =>
	returnImageResponseFromContext(c, {
		isDirectQuery: true,
	})
);

export default app;
